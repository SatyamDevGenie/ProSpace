import { Router } from "express";
import {
    getMyProfile,
    getMyBookings,
    updateMyBooking,
    adminGetUserBookings
} from "../controllers/user.controller";

import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

/* ================= USER ================= */

// Logged-in user profile
router.get("/me", protect, getMyProfile);

// Logged-in user booking history (past + upcoming)
router.get("/me/bookings", protect, getMyBookings);

// Update own booking (only if PENDING)
router.patch("/me/bookings/:bookingId", protect, updateMyBooking);

/* ================= ADMIN ================= */

// Admin can see booking history of any user
router.get(
    "/admin/:userId/bookings",
    protect,
    isAdmin,
    adminGetUserBookings
);

export default router;
