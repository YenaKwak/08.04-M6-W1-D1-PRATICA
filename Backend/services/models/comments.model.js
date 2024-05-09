import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "BlogPost",
    required: true,
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Comment = model("Comment", commentSchema);

export default Comment;
