import mongoose from 'mongoose';
import { VESSEL_STATUS, VESSEL_TYPES } from '#/constants/enums.constants.js';
import { baseSchemaOptions } from '#/schemas/common.schema.js';

const { Schema, model } = mongoose;

const currentYear = new Date().getFullYear();

const vesselSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    officialNumber: {
      type: String,
      trim: true,
      index: true
    },

    imoNumber: {
      type: String,
      trim: true,
      index: true
    },

    amsaUvi: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    },

    trailerRegNo: {
      type: String,
      trim: true,
      lowercase: true
    },

    homePort: {
      type: String,
      trim: true,
      lowercase: true
    },

    builder: {
      type: String,
      trim: true,
      lowercase: true
    },

    buildYear: {
      type: Number,
      min: 1900,
      max: currentYear
    },

    buildersPlateNo: {
      type: String,
      trim: true,
      lowercase: true
    },

    surveyClass: {
      type: String,
      trim: true,
      lowercase: true
    },

    surveyAuthority: {
      type: String,
      trim: true,
      lowercase: true
    },

    vesselType: {
      type: String,
      enum: VESSEL_TYPES,
      default: 'other'
    },

    flagState: {
      type: String,
      trim: true,
      lowercase: true
    },

    lengthOverall: Number,
    beam: Number,
    draft: Number,
    grossTonnage: Number,
    netTonnage: Number,

    hullMaterial: {
      type: String,
      trim: true,
      lowercase: true
    },

    noOfCrew: {
      type: Number,
      min: 0,
      default: 0
    },

    noOfPax: {
      type: Number,
      min: 0,
      default: 0
    },

    noOfBerthed: {
      type: Number,
      min: 0,
      default: 0
    },

    noOfUnberthedPax: {
      type: Number,
      min: 0,
      default: 0
    },

    cosExpiryDate: Date,
    surveyAnniversaryDate: Date,
    classCertExpiryDate: Date,
    cooExpiryDate: Date,
    trailerRegExpiryDate: Date,
    rcdTestExpiryDate: Date,
    meggerTestExpiryDate: Date,
    ecocExpiryDate: Date,
    gasCocExpiryDate: Date,

    workOrderNo: {
      type: String,
      trim: true
    },

    captain: {
      type: Schema.Types.ObjectId,
      ref: 'CrewMember',
      index: true
    },

    lineManager: {
      type: Schema.Types.ObjectId,
      ref: 'CrewMember',
      index: true
    },

    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      index: true
    },

    status: {
      type: String,
      enum: VESSEL_STATUS,
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

vesselSchema.index({ company: 1, name: 1 }, { unique: true });
vesselSchema.index({ amsaUvi: 1 }, { unique: true, sparse: true });
vesselSchema.index({ imoNumber: 1 }, { unique: true, sparse: true });

const Vessel = model('Vessel', vesselSchema);
export default Vessel;