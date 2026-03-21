import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    dateOfBirth: {
      type: Date,
      required: true
    },

    address: {
      type: String,
      default: ""
    },

    idCardNumber: {
      type: String,
      default: ""
    },

    phoneNumber: {
      type: String,
      default: ""
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other"
    },

    position: {
      type: String,
      default: ""
    },

    avatarUrl: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    }   
  },
  { timestamps: true }
)

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);