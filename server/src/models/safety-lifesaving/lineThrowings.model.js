import mongoose from 'mongoose';
import { EQUIPMENT_STATUS } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const lineThrowingSchema = new Schema(
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
      trim: true
    },

    quantity: {
      type: Number,
      min: 1,
      default: 1
    },

    expiryDate: Date,
    lastInspectionDate: Date,
    nextInspectionDate: Date,

    storageLocation: {
      type: String,
      trim: true,
      lowercase: true
    },

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

const LineThrowing = model('LineThrowing', lineThrowingSchema);
export default LineThrowing;