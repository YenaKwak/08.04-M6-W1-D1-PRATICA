require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authorsRoute = require("./services/routes/authors.route");
const blogPostsRoutes = require("./services/routes/blogPosts.route");
const { parser } = require("./root/cloudinaryConfig"); //특정라우트에만 적용하기위해..
const commentRouter = require("./services/routes/comments.route");

const app = express();
const port = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(cors());
app.use(express.json());
app.use("/api/authors", authorsRoute); // API 경로 변경
app.use("/api/blogPosts", blogPostsRoutes); // API 경로 변경
app.use("/api", commentRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
