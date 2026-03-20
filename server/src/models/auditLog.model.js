import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  action: {
    type: String,
    required: true
  },

  ip: String,
  
  userAgent: String
}, 
{ timestamps: true });

export const AuditLog = mongoose.model("AuditLog", AuditLogSchema);