import Booking from "../models/booking.model";
import { Request, Response } from "express";

export const createBooking = async (req: any, res: Response) => {
    const { deskId, date } = req.body;

    const booking = await Booking.create({
        user: req.user.id,
        desk: deskId,
        date
    });

    res.status(201).json(booking);
};

export const myBookingHistory = async (req: any, res: Response) => {
    const bookings = await Booking.find({ user: req.user.id })
        .populate("desk")
        .sort({ date: -1 });

    res.json(bookings);
};

export const updateMyBooking = async (req: any, res: Response) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Not found" });
    if (booking.status !== "PENDING")
        return res.status(400).json({ message: "Cannot update" });

    booking.desk = req.body.deskId;
    booking.date = req.body.date;
    await booking.save();

    res.json(booking);
};

export const cancelMyBooking = async (req: any, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    booking!.status = "CANCELLED";
    await booking!.save();
    res.json(booking);
};

const VALID_STATUSES = ["PENDING", "APPROVED"] as const;

export const adminCreateBooking = async (req: Request, res: Response) => {
    const { userId, deskId, date, status } = req.body ?? {};

    if (!userId || !deskId || !date) {
        return res.status(400).json({
            message: "userId, deskId and date are required"
        });
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
    booking!.status = "APPROVED";
    await booking!.save();
    res.json(booking);
};

export const rejectBooking = async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    booking!.status = "REJECTED";
    await booking!.save();
    res.json(booking);
};

export const adminCancelBooking = async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    booking!.status = "ADMIN_CANCELLED";
    await booking!.save();
    res.json(booking);
};
