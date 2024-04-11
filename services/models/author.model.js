const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  birthday: String,
  avatar: String,
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
