import mongoose from 'mongoose';
import {
  EQUIPMENT_STATUS,
  LIFERAFT_PACK_TYPES,
  LIFERAFT_LAUNCH_TYPES
} from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const liferaftSchema = new Schema(
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

    capacity: {
      type: Number,
      min: 1,
      required: true
    },

    packType: {
      type: String,
      enum: LIFERAFT_PACK_TYPES,
      default: 'other'
    },

    launchType: {
      type: String,
      enum: LIFERAFT_LAUNCH_TYPES,
      default: 'throw_overboard'
    },

    locationOnBoard: {
      type: String,
      trim: true,
      lowercase: true
    },

    manufactureDate: Date,
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

const Liferaft = model('Liferaft', liferaftSchema);
export default Liferaft;