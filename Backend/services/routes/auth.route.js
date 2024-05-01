import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { authMiddleware } from "../middlewares/authenticateToken.js";

export const authRouter = Router();

//로그인페이지
authRouter.get("/", async (req, res, next) => {
  res.send("login page");
});
