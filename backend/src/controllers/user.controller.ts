import { Request, Response } from "express";
import User from "../models/user.model";
import Booking from "../models/booking.model";
import Desk from "../models/desk.model";

/* ================= GET MY PROFILE ================= */
export const getMyProfile = async (req: any, res: Response) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
};

/* ================= GET MY BOOKINGS (HISTORY) ================= */
export const getMyBookings = async (req: any, res: Response) => {
    const bookings = await Booking.find({ user: req.user.id })
        .populate("desk")
        .sort({ date: -1 });

    res.json({
        total: bookings.length,
        bookings
    });
};

/* ================= UPDATE MY BOOKING ================= */
export const updateMyBooking = async (req: any, res: Response) => {
    const { bookingId } = req.params;
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

    const booking = await Booking.findOne({
        _id: bookingId,
        user: req.user.id
    });

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }

    if (!["PENDING", "APPROVED"].includes(booking.status)) {
        return res.status(400).json({
            message: "Cannot update - booking is rejected or cancelled"
        });
    }

    // Prevent past date updates
    if (new Date(date) < new Date()) {
        return res.status(400).json({
            message: "Cannot update booking to past date"
        });
    }

    // Prevent double booking for same day
    const exists = await Booking.findOne({
        user: req.user.id,
        date,
        _id: { $ne: bookingId }
    });

    if (exists) {
        return res.status(400).json({
            message: "You already have a booking for this date"
        });
    }

    booking.desk = deskId;
    booking.date = date;

    await booking.save();

    const populated = await Booking.findById(booking._id).populate("desk");

    res.json({
        message: "Booking updated successfully",
        booking: populated
    });
};

/* ================= ADMIN: USER BOOKING HISTORY ================= */
export const adminGetUserBookings = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId })
        .populate("desk")
        .populate("user", "name email")
        .sort({ date: -1 });

    res.json({
        userId,
        total: bookings.length,
        bookings
    });
};
