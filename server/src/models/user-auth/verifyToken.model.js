import mongoose from "mongoose"

const verifyTokenSchema = new mongoose.Schema({

 userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 verifyTokenHash:{
  type:String,
  required:true
 },

 type:{
  type:String,
  enum:["verify_email","reset_password"],
  required:true
 },

 expiresAt:{
  type:Date,
  required:true
 }

},{timestamps:true})

export const VerifyToken = mongoose.model("VerifyToken",verifyTokenSchema)