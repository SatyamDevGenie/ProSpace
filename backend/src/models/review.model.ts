import { Schema, model, Types } from "mongoose";

export interface IReview {
    user: Types.ObjectId;
    rating: number;
    text: string;
    likedBy: Types.ObjectId[];
}

const reviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

reviewSchema.index({ user: 1 });
reviewSchema.index({ createdAt: -1 });

export default model<IReview>("Review", reviewSchema);
