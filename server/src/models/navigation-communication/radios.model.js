import mongoose from 'mongoose';
import { EQUIPMENT_STATUS, RADIO_TYPES } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const radioSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: RADIO_TYPES,
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

    callSign: {
      type: String,
      trim: true
    },

    mmsi: {
      type: String,
      trim: true
    },

    installationDate: Date,
    lastInspectionDate: Date,
    nextInspectionDate: Date,

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

const Radio = model('Radio', radioSchema);
export default Radio;