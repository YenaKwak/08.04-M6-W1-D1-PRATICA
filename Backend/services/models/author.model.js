import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    googleId: { type: String, unique: true, sparse: true },
    birth: { type: String },
    avatar: { type: String },
    bio: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("Author", authorSchema);
