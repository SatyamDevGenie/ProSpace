import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Welcome to ProSpace API");
})

app.listen(PORT, () => {
    console.log(`🚀 ProSpace API running on port ${PORT}`);
});
