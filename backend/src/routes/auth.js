import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "shift_token";


import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

router.post("/register", async (req, res) => {
  const { personnelCode, name, line } = req.body;
  if (!personnelCode || !name || !line)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const exists = await User.findOne({ personnelCode });
    if (exists)
      return res.status(409).json({ message: "Personnel code exists" });

    const user = await User.create({ personnelCode, name, line });
    return res
      .status(201)
      .json({ message: "User created", user: { personnelCode, name, line } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { personnelCode } = req.body;
  if (!personnelCode)
    return res.status(400).json({ message: "Personnel code required" });

  try {
    const user = await User.findOne({ personnelCode });
    if (!user)
      return res.status(401).json({ message: "Invalid personnel code" });

    const token = jwt.sign(
      {
        id: user._id,
        personnelCode: user.personnelCode,
        line: user.line,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',  
  maxAge: 24 * 3600 * 1000,
  domain: "googlesheets-1-9526.onrender.com" 
});

    res.json({
      message: "Logged in",
      user: {
        personnelCode: user.personnelCode,
        name: user.name,
        line: user.line,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/logout", (req, res) => {
   res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
});

router.get("/me", verifyTokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
