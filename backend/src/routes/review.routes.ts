import { Router } from "express";
import {
    createReview,
    updateMyReview,
    getAllReviews,
    getPublicReviews,
    toggleLike,
    getMyReview,
    deleteMyReview
} from "../controllers/review.controller";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

router.get("/", protect, getPublicReviews);
router.get("/me", protect, getMyReview);
router.post("/", protect, createReview);
router.patch("/:id", protect, updateMyReview);
router.delete("/:id", protect, deleteMyReview);
router.patch("/:id/like", protect, toggleLike);

router.get("/admin/all", protect, isAdmin, getAllReviews);

export default router;
