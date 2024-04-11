require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./services/routes/api.route");
const app = express();
const port = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(express.json());
app.use("/authors", apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
