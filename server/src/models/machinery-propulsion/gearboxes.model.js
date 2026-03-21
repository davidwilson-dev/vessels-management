import mongoose from 'mongoose';
import { EQUIPMENT_STATUS } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const gearboxSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
    },

    mainEngine: {
      type: Schema.Types.ObjectId,
      ref: 'MainEngine'
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

    ratio: {
      type: String,
      trim: true
    },

    oilType: {
      type: String,
      trim: true
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

const Gearbox = model('Gearbox', gearboxSchema);
export default Gearbox;