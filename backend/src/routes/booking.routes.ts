import { Router } from "express";
import {
    createBooking,
    myBookingHistory,
    updateMyBooking,
    cancelMyBooking,
    adminCreateBooking,
    adminAllBookings,
    approveBooking,
    rejectBooking,
    adminCancelBooking
} from "../controllers/booking.controller";

import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

router.post("/create", protect, createBooking);
router.get("/me/history", protect, myBookingHistory);
router.patch("/me/:id", protect, updateMyBooking);
router.delete("/me/:id", protect, cancelMyBooking);

router.post("/admin/create", protect, isAdmin, adminCreateBooking);
router.get("/admin/all", protect, isAdmin, adminAllBookings);
router.patch("/admin/approve/:id", protect, isAdmin, approveBooking);
router.patch("/admin/reject/:id", protect, isAdmin, rejectBooking);
router.patch("/admin/cancel/:id", protect, isAdmin, adminCancelBooking);

export default router;
