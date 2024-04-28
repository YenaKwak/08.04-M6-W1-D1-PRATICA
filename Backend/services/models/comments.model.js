const mongoose = require("mongoose");
const { Schema } = mongoose;

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

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
