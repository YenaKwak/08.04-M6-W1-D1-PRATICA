import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import passportSetup from "./services/config/passport-setup.js";
import authorsRoute from "./services/routes/authors.route.js";
import blogPostsRoutes from "./services/routes/blogPosts.route.js";
import authRoutes from "./services/routes/auth.route.js";
import parser from "./root/cloudinaryConfig.js";
import commentRouter from "./services/routes/comments.route.js";

const app = express();
const port = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/api/authors", authorsRoute); // API 경로 변경
app.use("/api/blogPosts", blogPostsRoutes); // API 경로 변경
app.use("/auth", authRoutes);
app.use("/api", commentRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
