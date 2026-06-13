import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      default: 1000,
    },
  },
  { timestamps: true },
);
export const User = mongoose.model("User", userSchema);
