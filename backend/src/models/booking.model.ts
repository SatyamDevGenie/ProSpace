import { Schema, model, Types } from "mongoose";

export type BookingStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "ADMIN_CANCELLED";

export interface IBooking {
    user: Types.ObjectId;
    desk: Types.ObjectId;
    date: string;
    status: BookingStatus;
}

const bookingSchema = new Schema<IBooking>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    desk: { type: Schema.Types.ObjectId, ref: "Desk", required: true },
    date: { type: String, required: true },
    status: { type: String, default: "PENDING" }
}, { timestamps: true });

bookingSchema.index({ user: 1, date: 1 }, { unique: true });
bookingSchema.index({ desk: 1, date: 1 }, { unique: true });

export default model<IBooking>("Booking", bookingSchema);
