import mongoose from 'mongoose';
import { EQUIPMENT_STATUS, FIRE_EQUIPMENT_TYPES } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const fireEquipmentSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: FIRE_EQUIPMENT_TYPES,
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
      min: 1,
      default: 1
    },

    locationOnBoard: {
      type: String,
      trim: true,
      lowercase: true
    },

    extinguishingAgent: {
      type: String,
      trim: true,
      lowercase: true
    },

    capacity: {
      type: String,
      trim: true
    },

    lastInspectionDate: Date,
    nextInspectionDate: Date,
    lastServiceDate: Date,
    nextServiceDate: Date,
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

const FireEquipment = model('FireEquipment', fireEquipmentSchema);
export default FireEquipment;