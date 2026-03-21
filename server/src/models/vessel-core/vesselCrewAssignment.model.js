import mongoose from 'mongoose';
import { CREW_ROLES } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const vesselCrewAssignmentSchema = new Schema(
  {
    vessel: {
      type: Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
      index: true
    },

    crewMember: {
      type: Schema.Types.ObjectId,
      ref: 'CrewMember',
      required: true,
      index: true
    },

    role: {
      type: String,
      enum: CREW_ROLES,
      required: true,
      index: true
    },

    startDate: {
      type: Date,
      required: true,
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

vesselCrewAssignmentSchema.index(
  { vessel: 1, crewMember: 1, role: 1, startDate: 1 },
  { unique: true }
);

const VesselCrewAssignment = model('VesselCrewAssignment', vesselCrewAssignmentSchema);
export default VesselCrewAssignment;