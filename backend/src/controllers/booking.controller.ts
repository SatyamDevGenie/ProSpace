import Booking from "../models/booking.model";
import Desk from "../models/desk.model";
import { Request, Response } from "express";

export const createBooking = async (req: any, res: Response) => {
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

    booking.desk = deskId;
    booking.date = date;
    await booking.save();

    const populated = await Booking.findById(booking._id).populate("desk");
    res.json(populated);
};

export const cancelMyBooking = async (req: any, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.id)
        return res.status(403).json({ message: "Not your booking" });
    booking.status = "CANCELLED";
    await booking.save();
    const populated = await Booking.findById(booking._id).populate("desk");
    res.json(populated);
};

const VALID_STATUSES = ["PENDING", "APPROVED"] as const;

export const adminCreateBooking = async (req: Request, res: Response) => {
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
    res.json(populated);
};

export const rejectBooking = async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "REJECTED";
    await booking.save();
    const populated = await Booking.findById(booking._id).populate("user", "name email").populate("desk");
    res.json(populated);
};

export const adminCancelBooking = async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "ADMIN_CANCELLED";
    await booking.save();
    const populated = await Booking.findById(booking._id).populate("user", "name email").populate("desk");
    res.json(populated);
};
