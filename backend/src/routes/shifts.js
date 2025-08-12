import express from "express";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";
import fetch from "node-fetch";
import Papa from "papaparse";

const router = express.Router();

router.get("/", verifyTokenMiddleware, async (req, res) => {
  try {
    const response = await fetch(process.env.CSV_SHIFTS_URL);
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const userLine = req.user.line; // e.g. "isaar" or "voroodi"
    const daysInMonth = 30;

    const shiftsForLine =
      userLine === "isaar"
        ? ["morning", "evening", "night"]
        : ["morning", "evening"];

    // Prepare grid data: for each day prepare shifts with "available" status
    const grid = [];
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push({
        day,
        shifts: shiftsForLine.map((shift) => ({
          key: `${day}_${shift}`,
          shift,
          status: "available",
        })),
      });
    }

    res.json({ user: req.user, grid });
  } catch (error) {
    console.error("Error fetching shifts:", error);
    res.status(500).json({ message: "Failed to fetch shifts" });
  }
});

export default router;
