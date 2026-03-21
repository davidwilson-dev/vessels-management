import mongoose from 'mongoose';
import { EQUIPMENT_STATUS } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const epirbSchema = new Schema(
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

    hexId: {
      type: String,
      trim: true,
      index: true
    },

    batteryExpiryDate: Date,
    hydrostaticReleaseExpiryDate: Date,
    lastTestDate: Date,
    nextTestDate: Date,
    registrationExpiryDate: Date,

    locationOnBoard: {
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

const EPIRB = model('EPIRB', epirbSchema);
export default EPIRB;