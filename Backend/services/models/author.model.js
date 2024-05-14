import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String },
    username: { type: String, required: false }, // Make username not required
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Make password not required if using Google ID
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("Author", authorSchema);
