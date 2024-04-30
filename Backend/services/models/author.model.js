const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  { collection: "author" }
);

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
