import mongoose from 'mongoose';
import { CREW_ROLES, CREW_STATUS } from '#/constants/enums.constants.js';
import {
  baseSchemaOptions,
  certificateSubSchema,
  emergencyContactSubSchema
} from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const crewMemberSchema = new Schema(
  {
    employeeCode: {
      type: String,
      trim: true,
      index: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    dateOfBirth: Date,

    nationality: {
      type: String,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    roles: [
      {
        type: String,
        enum: CREW_ROLES,
        index: true
      }
    ],

    rank: {
      type: String,
      trim: true,
      lowercase: true
    },

    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      index: true
    },

    assignedVessels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vessel',
        index: true
      }
    ],

    certificates: [certificateSubSchema],

    medicalExpiryDate: Date,
    contractStartDate: Date,
    contractEndDate: Date,

    emergencyContact: emergencyContactSubSchema,

    status: {
      type: String,
      enum: CREW_STATUS,
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

crewMemberSchema.index({ company: 1, fullName: 1 });
crewMemberSchema.index({ email: 1 }, { unique: true, sparse: true });

const CrewMember = model('CrewMember', crewMemberSchema);
export default CrewMember;