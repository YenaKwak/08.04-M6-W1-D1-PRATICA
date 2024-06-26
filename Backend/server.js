import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import passportSetup from "./services/config/passport-setup.js";
import authorsRoute from "./services/routes/authors.route.js";
import blogPostsRoutes from "./services/routes/blogPosts.route.js";
import { authRouter } from "./services/routes/auth.route.js";
import { parser } from "./root/cloudinaryConfig.js";
import commentRouter from "./services/routes/comments.route.js";

const app = express();
const port = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));
console.log("JWT Secret:", process.env.JWT_SECRET);
app.use(
  cors({
    origin: "http://localhost:3000", // 클라이언트 주소
    credentials: true,
  })
);

app.use(express.json());
app.use(passportSetup.initialize());
app.use("/api/authors", authorsRoute);
app.use("/api/blogPosts", blogPostsRoutes);
app.use("/api/auth", authRouter);
app.use("/api", commentRouter);
app.use(passport.initialize());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
