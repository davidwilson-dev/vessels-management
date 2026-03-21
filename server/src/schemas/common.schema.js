import mongoose from 'mongoose';

const { Schema } = mongoose;

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false
};

export const refField = (ref, required = false) => ({
  type: Schema.Types.ObjectId,
  ref,
  required,
  index: true
});

export const commonTextField = {
  type: String,
  trim: true
};

export const commonLowerTextField = {
  type: String,
  trim: true,
  lowercase: true
};

export const commonEquipmentFields = {
  vessel: refField('Vessel', true),

  name: {
    type: String,
    trim: true,
    required: true
  },

  maker: {
    type: String,
    trim: true,
    lowercase: true
  },

  model: {
    type: String,
    trim: true
  },

  serialNumber: {
    type: String,
    trim: true,
    index: true
  },

  quantity: {
    type: Number,
    min: 0,
    default: 1
  },

  locationOnBoard: {
    type: String,
    trim: true,
    lowercase: true
  },

  manufactureDate: Date,
  installationDate: Date,
  lastInspectionDate: Date,
  nextInspectionDate: Date,
  lastServiceDate: Date,
  nextServiceDate: Date,
  expiryDate: Date,

  notes: {
    type: String,
    trim: true
  }
};

export const certificateSubSchema = new Schema(
  {
    name: { type: String, trim: true },
    number: { type: String, trim: true },
    issuedBy: { type: String, trim: true },
    issueDate: Date,
    expiryDate: Date
  },
  { _id: false }
);

export const emergencyContactSubSchema = new Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true }
  },
  { _id: false }
);