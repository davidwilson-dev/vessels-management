import mongoose from "mongoose";

import { baseSchemaOptions } from "#/schemas/common.schema.js";

const { Schema, model } = mongoose;

const companyCrewAssignmentSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    crewMember: {
      type: Schema.Types.ObjectId,
      ref: "CrewMember",
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

companyCrewAssignmentSchema.index(
  { company: 1, crewMember: 1, startDate: 1 },
  { unique: true }
);

const CompanyCrewAssignment = model("CompanyCrewAssignment", companyCrewAssignmentSchema);
export default CompanyCrewAssignment;
