require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 3002;
const apiRoutes = require("./services/routes/api.route"); // 이름 변경
const blogPostsRoutes = require("./services/routes/blogPosts.route");
const { parser } = require("./root/cloudinaryConfig");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(cors());
app.use(express.json());
app.use("/api/authors", apiRoutes); // API 경로 변경
app.use("/api/blogPosts", blogPostsRoutes); // API 경로 변경

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
