import mongoose from 'mongoose';
import { EQUIPMENT_STATUS } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const firstAidKitSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
    },

    code: {
      type: String,
      trim: true
    },

    locationOnBoard: {
      type: String,
      trim: true,
      lowercase: true
    },

    quantity: {
      type: Number,
      min: 1,
      default: 1
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

const FirstAidKit = model('FirstAidKit', firstAidKitSchema);
export default FirstAidKit;