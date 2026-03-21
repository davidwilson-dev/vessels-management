import mongoose from 'mongoose';
import { EQUIPMENT_STATUS } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const generatorSchema = new Schema(
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

    ratedPowerKva: Number,
    voltage: Number,
    frequencyHz: Number,

    runningHours: {
      type: Number,
      min: 0,
      default: 0
    },

    installationDate: Date,
    lastServiceDate: Date,
    nextServiceDate: Date,

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

const Generator = model('Generator', generatorSchema);
export default Generator;