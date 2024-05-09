import mongoose from "mongoose";
const { Schema, model } = mongoose;

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

const BlogPost = model("BlogPost", blogPostSchema);

export default BlogPost;
