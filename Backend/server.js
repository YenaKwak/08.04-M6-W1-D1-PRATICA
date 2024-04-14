require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const apiRoutes = require("./services/routes/api.route");
const port = process.env.PORT || 3002;
const blogPostsRoutes = require("./services/routes/blogPosts.route");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(cors());
app.use(express.json());
app.use("/authors", apiRoutes);
app.use("/api/blogPosts", blogPostsRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
