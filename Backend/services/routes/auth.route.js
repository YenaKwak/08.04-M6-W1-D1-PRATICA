import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Author from "../models/author.model.js";
import passport from "passport";
import {
  authMiddleware,
  generateJWT,
} from "../middlewares/authenticateToken.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const author = await Author.findOne({ email }).select("+password");
    if (!author) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Author not found." });
    }

    const isMatch = await bcrypt.compare(password, author.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { authorId: author._id, email: author.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    res.json({ token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

authRouter.get("/me", authMiddleware, (req, res) => {
  res.json(req.author);
});

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // 토큰을 클라이언트로 리디렉션하는 로직
    const token = req.user.token;
    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  }
);
