import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "staff", "guest"],
      default: "guest"
    },

    emailVerified: {
      type: Boolean,
      default: false
    },

    passwordChangedAt: {
      type: Date
    },

    isActive: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
)

export const User = mongoose.model("User", userSchema);