import mongoose from 'mongoose';
import { FUEL_TYPES, EQUIPMENT_STATUS } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const mainEngineSchema = new Schema(
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

    engineNumber: {
      type: String,
      trim: true
    },

    powerKw: Number,
    rpm: Number,

    fuelType: {
      type: String,
      enum: FUEL_TYPES,
      default: 'diesel'
    },

    cylinders: Number,
    manufacturerYear: Number,
    installationDate: Date,
    lastServiceDate: Date,
    nextServiceDate: Date,

    runningHours: {
      type: Number,
      min: 0,
      default: 0
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

mainEngineSchema.index({ vessel: 1, serialNumber: 1 }, { sparse: true });

const MainEngine = model('MainEngine', mainEngineSchema);
export default MainEngine;