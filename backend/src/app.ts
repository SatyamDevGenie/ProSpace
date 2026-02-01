import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import deskRoutes from "./routes/desk.routes";
import bookingRoutes from "./routes/booking.routes";

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/desks", deskRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/api/health", (_req, res) => {
    res.json({ status: "OK", message: "ProSpace backend running 🚀" });
});

/* ================= GLOBAL ERROR HANDLER ================= */

app.use(
    (
        err: any,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
    ) => {
        console.error(err.stack);
        res.status(500).json({
            message: "Internal Server Error",
            error:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : err.message
        });
    }
);

export default app;
