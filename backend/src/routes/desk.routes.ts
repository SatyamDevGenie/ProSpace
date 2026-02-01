import express from "express";
import {
  createDesk,
  getAllDesks,
  getDeskById,
  updateDesk,
  deleteDesk
} from "../controllers/desk.controller";

import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = express.Router();

/* ================= PUBLIC / USER ================= */

// Get all desks (users & admin)
router.get("/", protect, getAllDesks);

// Get single desk by ID
router.get("/:id", protect, getDeskById);

/* ================= ADMIN ONLY ================= */

// Create new desk
router.post("/", protect, isAdmin, createDesk);

// Update desk (status, seat number, etc.)
router.put("/:id", protect, isAdmin, updateDesk);

// Delete desk
router.delete("/:id", protect, isAdmin, deleteDesk);

export default router;
