import Booking from "../models/booking.model";
import Desk from "../models/desk.model";
import { Request, Response } from "express";
import {
    sendBookingApprovedEmail,
    sendBookingRejectedEmail,
    sendAdminCancelledEmail,
    sendUserCancelledToAdminEmail
} from "../utils/email";

/** MongoDB duplicate key error code - occurs when two users book same desk+date simultaneously */
const MONGO_DUPLICATE_KEY = 11000;

export const createBooking = async (req: any, res: Response) => {
    try {
        const { deskId, date } = req.body ?? {};

        if (!deskId || !date) {
            return res.status(400).json({ message: "deskId and date are required" });
        }

        const desk = await Desk.findById(deskId);
        if (!desk) {
            return res.status(404).json({ message: "Desk not found" });
        }
        if (!desk.isActive) {
            return res.status(400).json({ message: "Desk is not available" });
        }

        const booking = await Booking.create({
            user: req.user.id,
            desk: deskId,
            date
        });

        const populated = await Booking.findById(booking._id).populate("desk");
        res.status(201).json(populated);
    } catch (err: any) {
        if (err?.code === MONGO_DUPLICATE_KEY) {
            return res.status(409).json({
                message: "This desk is already booked for that date. Someone else may have just booked it."
            });
        }
        throw err;
    }
};

export const myBookingHistory = async (req: any, res: Response) => {
    const bookings = await Booking.find({ user: req.user.id })
        .populate("desk")
        .sort({ date: -1 });

    res.json(bookings);
};

export const updateMyBooking = async (req: any, res: Response) => {
    const { deskId, date } = req.body ?? {};
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Not found" });
    if (booking.user.toString() !== req.user.id)
        return res.status(403).json({ message: "Not your booking" });
    if (!["PENDING", "APPROVED"].includes(booking.status))
        return res.status(400).json({ message: "Cannot update - booking is rejected or cancelled" });
    if (!deskId || !date)
        return res.status(400).json({ message: "deskId and date are required" });

    const desk = await Desk.findById(deskId);
    if (!desk)
        return res.status(404).json({ message: "Desk not found" });
    if (!desk.isActive)
        return res.status(400).json({ message: "Desk is not available" });

    const today = new Date().toISOString().split("T")[0];
    if (date < today)
        return res.status(400).json({ message: "Cannot update booking to past date" });

    const exists = await Booking.findOne({
        user: req.user.id,
        date,
        _id: { $ne: req.params.id }
    });
    if (exists)
        return res.status(400).json({ message: "You already have a booking for this date" });

    try {
        booking.desk = deskId;
        booking.date = date;
        await booking.save();

        const populated = await Booking.findById(booking._id).populate("desk");
        res.json(populated);
    } catch (err: any) {
        if (err?.code === MONGO_DUPLICATE_KEY) {
            return res.status(409).json({
                message: "This desk is already booked for that date. Please choose another desk or date."
            });
        }
        throw err;
    }
};

export const cancelMyBooking = async (req: any, res: Response) => {
    const { reason } = req.body ?? {};
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.id)
        return res.status(403).json({ message: "Not your booking" });
    if (!["PENDING", "APPROVED"].includes(booking.status))
        return res.status(400).json({ message: "Cannot cancel - booking is already rejected or cancelled" });
    const today = new Date().toISOString().split("T")[0];
    if (booking.date < today)
        return res.status(400).json({ message: "Cannot cancel - booking date has passed" });
    booking.status = "CANCELLED";
    await booking.save();
    const populated = await Booking.findById(booking._id).populate("user", "name email").populate("desk");
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
    if (adminEmail) {
        try {
            const u = populated!.user as { name?: string; email?: string } | null;
            const d = populated!.desk as { deskNumber?: string } | null;
            const userName = (u && typeof u === "object" ? u.name : null) ?? "User";
            const userEmail = (u && typeof u === "object" ? u.email : null) ?? "";
            const deskNumber = (d && typeof d === "object" ? d.deskNumber : null) ?? "—";
            await sendUserCancelledToAdminEmail(
                adminEmail,
                userName,
                userEmail,
                deskNumber,
                populated!.date,
                typeof reason === "string" ? reason : ""
            );
            console.log(`[Email] User-cancelled notification sent to admin (${adminEmail})`);
        } catch (e) {
            console.error("Failed to send user-cancelled email to admin:", e);
        }
    }
    res.json(populated);
};

const VALID_STATUSES = ["PENDING", "APPROVED"] as const;

export const adminCreateBooking = async (req: Request, res: Response) => {
    try {
        const { userId, deskId, date, status } = req.body ?? {};

        if (!userId || !deskId || !date) {
            return res.status(400).json({
                message: "userId, deskId and date are required"
            });
        }

        const desk = await Desk.findById(deskId);
        if (!desk) {
            return res.status(404).json({ message: "Desk not found" });
        }
        if (!desk.isActive) {
            return res.status(400).json({ message: "Desk is not available" });
        }

        const bookingStatus = status && VALID_STATUSES.includes(status) ? status : "PENDING";

        const booking = await Booking.create({
            user: userId,
            desk: deskId,
            date,
            status: bookingStatus
        });

        const populated = await Booking.findById(booking._id)
            .populate("user", "name email")
            .populate("desk");

        res.status(201).json(populated);
    } catch (err: any) {
        if (err?.code === MONGO_DUPLICATE_KEY) {
            return res.status(409).json({
                message: "This desk is already booked for that date."
            });
        }
        throw err;
    }
};

export const adminAllBookings = async (_: Request, res: Response) => {
    const bookings = await Booking.find()
        .populate("user")
        .populate("desk")
        .sort({ createdAt: -1 });

    res.json(bookings);
};

export const approveBooking = async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "APPROVED";
    await booking.save();
    const populated = await Booking.findById(booking._id).populate("user", "name email").populate("desk");
    const u = populated!.user as { email?: string; name?: string };
    const d = populated!.desk as { deskNumber?: string };
    if (u?.email) {
        try {
            await sendBookingApprovedEmail(u.email, u.name ?? "User", d?.deskNumber ?? "—", populated!.date);
        } catch (e) {
            console.error("Failed to send booking-approved email:", e);
        }
    }
    res.json(populated);
};

export const rejectBooking = async (req: Request, res: Response) => {
    const { reason } = req.body ?? {};
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "REJECTED";
    await booking.save();
    const populated = await Booking.findById(booking._id).populate("user", "name email").populate("desk");
    const u = populated!.user as { email?: string; name?: string };
    const d = populated!.desk as { deskNumber?: string };
    if (u?.email) {
        try {
            await sendBookingRejectedEmail(u.email, u.name ?? "User", d?.deskNumber ?? "—", populated!.date, reason ?? "");
        } catch (e) {
            console.error("Failed to send booking-rejected email:", e);
        }
    }
    res.json(populated);
};

export const adminCancelBooking = async (req: Request, res: Response) => {
    const { reason } = req.body ?? {};
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "ADMIN_CANCELLED";
    await booking.save();
    const populated = await Booking.findById(booking._id).populate("user", "name email").populate("desk");
    const u = populated!.user as { email?: string; name?: string };
    const d = populated!.desk as { deskNumber?: string };
    if (u?.email) {
        try {
            await sendAdminCancelledEmail(u.email, u.name ?? "User", d?.deskNumber ?? "—", populated!.date, reason ?? "");
        } catch (e) {
            console.error("Failed to send admin-cancelled email:", e);
        }
    }
    res.json(populated);
};
