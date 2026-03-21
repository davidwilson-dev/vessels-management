import mongoose from 'mongoose';
import { PROPULSION_TYPES, EQUIPMENT_STATUS } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const propulsionSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: PROPULSION_TYPES,
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

    drivenByEngine: {
      type: Schema.Types.ObjectId,
      ref: 'MainEngine'
    },

    blades: Number,
    diameterMm: Number,
    material: {
      type: String,
      trim: true,
      lowercase: true
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

const Propulsion = model('Propulsion', propulsionSchema);
export default Propulsion;