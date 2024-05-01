import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { authMiddleware } from "../middlewares/authenticateToken.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid password");
    }
    const token = generateJWT({ userId: user.id });
    res.json(token);
  } catch (err) {
    res.status(500).send("Server error", error);
  }
});

authRouter.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});
