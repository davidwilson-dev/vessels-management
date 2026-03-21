import mongoose from 'mongoose';
import { EQUIPMENT_STATUS } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const breathingApparatusSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
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

    cylinderCapacityLitres: Number,
    workingPressureBar: Number,

    locationOnBoard: {
      type: String,
      trim: true,
      lowercase: true
    },

    lastInspectionDate: Date,
    nextInspectionDate: Date,
    expiryDate: Date,

    status: {
      type: String,
      enum: EQUIPMENT_STATUS,
      default: 'active',
      index: true
    },

    notes: {
      type: String,
      trim: true
    }
  },
  baseSchemaOptions
);

const BreathingApparatus = model('BreathingApparatus', breathingApparatusSchema);
export default BreathingApparatus;