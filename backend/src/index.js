import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.js";
import shiftsRoutes from "./routes/shifts.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'https://googlesheets-gb76.vercel.app',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/shifts", shiftsRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
