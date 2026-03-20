import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  tokenHash: {
    type: String,
    required: true,
    index: true
  },

  browser: {
    type: String,
  },

  browserVersion: {
    type: String,
  },

  os: {
    type: String,
  },

  osVersion: {
    type: String,
  },

  deviceType: {
    type: String
  },

  userAgent: {
    type: String
  },

  ip: {
    type: String
  },

  expiresAt: {
    type: Date,
    required: true,
    index: true
  },

  revoked: {
    type: Boolean,
    default: false
  },

  revokedAt: {
    type: Date
  }
}, { timestamps: true })

export const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
)