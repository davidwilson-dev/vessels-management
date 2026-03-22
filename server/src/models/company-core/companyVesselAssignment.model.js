import mongoose from "mongoose";

import { baseSchemaOptions } from "#/schemas/common.schema.js";

const { Schema, model } = mongoose;

const companyVesselAssignmentSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    vessel: {
      type: Schema.Types.ObjectId,
      ref: "Vessel",
      required: true,
      index: true
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },

    endDate: Date,

    isCurrent: {
      type: Boolean,
      default: true,
      index: true
    },

    notes: {
      type: String,
      trim: true
    }
  },
  baseSchemaOptions
);

companyVesselAssignmentSchema.index(
  { company: 1, vessel: 1, startDate: 1 },
  { unique: true }
);

const CompanyVesselAssignment = model("CompanyVesselAssignment", companyVesselAssignmentSchema);
export default CompanyVesselAssignment;
