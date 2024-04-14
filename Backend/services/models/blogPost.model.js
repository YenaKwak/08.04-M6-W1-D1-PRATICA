const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    category: String,
    title: { type: String, required: true },
    cover: String,
    readTime: {
      value: Number,
      unit: String,
    },
    author: {
      name: String,
      avatar: String,
    },
    content: String,
  },
  { timestamps: true }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
