import { Request, Response } from "express";
import Desk from "../models/desk.model";

/**
 * @desc    Create a new desk (Admin only)
 * @route   POST /api/desks
 * @access  Admin
 */
export const createDesk = async (req: Request, res: Response) => {
    try {
        const { deskNumber } = req.body;

        if (!deskNumber) {
            return res.status(400).json({ message: "Desk number is required" });
        }

        const existingDesk = await Desk.findOne({ deskNumber });
        if (existingDesk) {
            return res.status(400).json({ message: "Desk already exists" });
        }

        const desk = await Desk.create({
            deskNumber,
            isActive: true
        });

        res.status(201).json({
            message: "Desk created successfully",
            desk
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create desk" });
    }
};

/**
 * @desc    Get all desks
 * @route   GET /api/desks
 * @access  User/Admin
 */
export const getAllDesks = async (_req: Request, res: Response) => {
    try {
        const desks = await Desk.find().sort({ deskNumber: 1 });

        res.status(200).json(desks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch desks" });
    }
};

/**
 * @desc    Get desk by ID
 * @route   GET /api/desks/:id
 * @access  User/Admin
 */
export const getDeskById = async (req: Request, res: Response) => {
    try {
        const desk = await Desk.findById(req.params.id);

        if (!desk) {
            return res.status(404).json({ message: "Desk not found" });
        }

        res.status(200).json(desk);
    } catch (error) {
        res.status(400).json({ message: "Invalid desk ID" });
    }
};

/**
 * @desc    Update desk details
 * @route   PUT /api/desks/:id
 * @access  Admin
 */
export const updateDesk = async (req: Request, res: Response) => {
    try {
        const { deskNumber, isActive } = req.body;

        const desk = await Desk.findById(req.params.id);
        if (!desk) {
            return res.status(404).json({ message: "Desk not found" });
        }

        // Prevent duplicate desk numbers
        if (deskNumber && deskNumber !== desk.deskNumber) {
            const duplicate = await Desk.findOne({ deskNumber });
            if (duplicate) {
                return res.status(400).json({ message: "Desk number already in use" });
            }
            desk.deskNumber = deskNumber;
        }

        if (typeof isActive === "boolean") {
            desk.isActive = isActive;
        }

        await desk.save();

        res.status(200).json({
            message: "Desk updated successfully",
            desk
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update desk" });
    }
};

/**
 * @desc    Delete desk
 * @route   DELETE /api/desks/:id
 * @access  Admin
 */
export const deleteDesk = async (req: Request, res: Response) => {
    try {
        const desk = await Desk.findById(req.params.id);

        if (!desk) {
            return res.status(404).json({ message: "Desk not found" });
        }

        await desk.deleteOne();

        res.status(200).json({ message: "Desk deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete desk" });
    }
};
