import { Schema, model } from "mongoose";

export interface IDesk {
    deskNumber: string;
    isActive: boolean;
}

const deskSchema = new Schema<IDesk>({
    deskNumber: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
});

export default model<IDesk>("Desk", deskSchema);
