import mongoose from 'mongoose';
import { EQUIPMENT_STATUS, LIFE_JACKET_TYPES } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const lifeJacketSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: LIFE_JACKET_TYPES,
      default: 'adult'
    },

    quantity: {
      type: Number,
      min: 1,
      required: true
    },

    locationOnBoard: {
      type: String,
      trim: true,
      lowercase: true
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

const LifeJacket = model('LifeJacket', lifeJacketSchema);
export default LifeJacket;