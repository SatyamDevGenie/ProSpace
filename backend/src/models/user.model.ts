import { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
}, { timestamps: true });

export default model<IUser>("User", userSchema);
