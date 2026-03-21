import mongoose from 'mongoose';
import { EQUIPMENT_STATUS, PYROTECHNIC_TYPES } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const pyrotechnicSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: PYROTECHNIC_TYPES,
      required: true
    },

    quantity: {
      type: Number,
      min: 1,
      required: true
    },

    batchNumber: {
      type: String,
      trim: true
    },

    manufactureDate: Date,
    expiryDate: {
      type: Date,
      index: true
    },

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

const Pyrotechnic = model('Pyrotechnic', pyrotechnicSchema);
export default Pyrotechnic;