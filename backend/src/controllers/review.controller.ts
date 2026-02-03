import Review from "../models/review.model";
import { Request, Response } from "express";

export const createReview = async (req: any, res: Response) => {
    const { rating, text } = req.body ?? {};
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ message: "Review text is required" });
    }

    const existing = await Review.findOne({ user: req.user.id });
    if (existing) {
        return res.status(400).json({ message: "You have already submitted a review. You can update it instead." });
    }

    const review = await Review.create({
        user: req.user.id,
        rating,
        text: text.trim()
    });

    const populated = await Review.findById(review._id).populate("user", "name email");
    res.status(201).json(populated);
};

export const updateMyReview = async (req: any, res: Response) => {
    const { rating, text } = req.body ?? {};
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your review" });
    }

    if (rating !== undefined) {
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        review.rating = rating;
    }
    if (text !== undefined) {
        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({ message: "Review text is required" });
        }
        review.text = text.trim();
    }

    await review.save();
    const populated = await Review.findById(review._id).populate("user", "name email");
    res.json(populated);
};

export const getAllReviews = async (_req: Request, res: Response) => {
    const reviews = await Review.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();

    const withLikes = (reviews as any[]).map((r) => ({
        ...r,
        likes: r.likedBy?.length ?? 0
    }));
    res.json(withLikes);
};

export const getPublicReviews = async (req: any, res: Response) => {
    const reviews = await Review.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();

    const userId = req.user?.id;
    const withLiked = reviews.map((r: any) => ({
        ...r,
        likes: r.likedBy?.length ?? 0,
        likedByMe: userId && r.likedBy?.some((id: any) => id.toString() === userId)
    }));

    res.json(withLiked);
};

export const toggleLike = async (req: any, res: Response) => {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const uid = req.user.id;
    const idx = review.likedBy.findIndex((id) => id.toString() === uid);
    if (idx >= 0) {
        review.likedBy.splice(idx, 1);
    } else {
        review.likedBy.push(uid as any);
    }
    await review.save();

    const populated = await Review.findById(review._id).populate("user", "name email").lean();
    const userId = req.user.id;
    const r = populated as any;
    res.json({
        ...r,
        likes: r.likedBy?.length ?? 0,
        likedByMe: r.likedBy?.some((id: any) => id.toString() === userId)
    });
};

export const getMyReview = async (req: any, res: Response) => {
    const review = await Review.findOne({ user: req.user.id }).populate("user", "name email");
    if (!review) return res.json(null);
    res.json(review);
};

export const deleteMyReview = async (req: any, res: Response) => {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your review" });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
};
