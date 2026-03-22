import mongoose from "mongoose";

import { COMPANY_STATUS } from "#/constants/enums.constants.js";
import { baseSchemaOptions } from "#/schemas/common.schema.js";

const { Schema, model } = mongoose;

const companySchema = new Schema(
  {
    companyCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true
    },

    address: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: COMPANY_STATUS,
      default: "active",
      index: true
    },

    notes: {
      type: String,
      trim: true
    }
  },
  baseSchemaOptions
);

companySchema.index({ companyCode: 1 }, { unique: true });

const Company = model("Company", companySchema);
export default Company;
