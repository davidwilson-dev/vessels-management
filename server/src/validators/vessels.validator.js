import Joi from "joi";

import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from "#/utils/validator.utils.js";
import {
  VESSEL_STATUS,
  VESSEL_TYPES
} from "#/constants/enums.constants.js";
import {
  VESSEL_DEVICE_CONFIGS
} from "#/constants/vesselDevices.constants.js";

const objectIdField = Joi.string().pattern(OBJECT_ID_RULE).messages({
  "string.pattern.base": OBJECT_ID_RULE_MESSAGE
});

const nullableObjectIdField = objectIdField.allow(null);
const nullableDateField = Joi.string().isoDate().allow(null);
const nullableStringField = Joi.string().allow("", null);
const vesselCodeField = Joi.string().trim().pattern(/^[A-Za-z0-9-]+$/).messages({
  "string.pattern.base": "vesselCode may only contain letters, numbers, and hyphens"
});

const buildDeviceItemSchema = (config) => {
  const schema = {
    id: objectIdField
  };

  (config.stringFields || []).forEach((fieldName) => {
    schema[fieldName] = (config.requiredStringFields || []).includes(fieldName)
      ? Joi.string().required()
      : nullableStringField;
  });

  (config.numberFields || []).forEach((fieldName) => {
    let fieldSchema = Joi.number();

    if ((config.integerFields || []).includes(fieldName)) {
      fieldSchema = fieldSchema.integer();
    }

    if (config.minFields?.[fieldName] !== undefined) {
      fieldSchema = fieldSchema.min(config.minFields[fieldName]);
    }

    if (config.maxFields?.[fieldName] !== undefined) {
      fieldSchema = fieldSchema.max(config.maxFields[fieldName]);
    }

    schema[fieldName] = (config.requiredNumberFields || []).includes(fieldName)
      ? fieldSchema.required()
      : fieldSchema.allow(null);
  });

  (config.booleanFields || []).forEach((fieldName) => {
    schema[fieldName] = Joi.boolean().allow(null);
  });

  (config.objectIdFields || []).forEach((fieldName) => {
    schema[fieldName] = nullableObjectIdField;
  });

  (config.dateFields || []).forEach((fieldName) => {
    schema[fieldName] = nullableDateField;
  });

  Object.entries(config.enumFields || {}).forEach(([fieldName, allowedValues]) => {
    let fieldSchema = Joi.string().valid(...allowedValues);

    schema[fieldName] = (config.requiredEnumFields || []).includes(fieldName)
      ? fieldSchema.required()
      : fieldSchema.allow(null);
  });

  return Joi.object(schema);
};

const vesselDeviceBodySchema = Object.fromEntries(
  VESSEL_DEVICE_CONFIGS.flatMap((config) => {
    const deviceArraySchema = Joi.array().items(buildDeviceItemSchema(config));
    const keys = [config.key, ...(config.aliases || [])];

    return keys.map((key) => [key, deviceArraySchema]);
  })
);

const vesselBodySchema = {
  vesselCode: vesselCodeField.required(),
  name: Joi.string().required(),
  officialNumber: Joi.string().allow(""),
  imoNumber: Joi.string().allow(""),
  amsaUvi: Joi.string().allow(""),
  trailerRegNo: Joi.string().allow(""),
  homePort: Joi.string().allow(""),
  builder: Joi.string().allow(""),
  buildYear: Joi.number().integer().min(1900).max(new Date().getFullYear()),
  buildersPlateNo: Joi.string().allow(""),
  surveyClass: Joi.string().allow(""),
  surveyAuthority: Joi.string().allow(""),
  vesselType: Joi.string().valid(...VESSEL_TYPES),
  flagState: Joi.string().allow(""),
  lengthOverall: Joi.number().min(0),
  beam: Joi.number().min(0),
  draft: Joi.number().min(0),
  grossTonnage: Joi.number().min(0),
  netTonnage: Joi.number().min(0),
  hullMaterial: Joi.string().allow(""),
  noOfCrew: Joi.number().integer().min(0),
  noOfPax: Joi.number().integer().min(0),
  noOfBerthed: Joi.number().integer().min(0),
  noOfUnberthedPax: Joi.number().integer().min(0),
  cosExpiryDate: nullableDateField,
  surveyAnniversaryDate: nullableDateField,
  classCertExpiryDate: nullableDateField,
  cooExpiryDate: nullableDateField,
  trailerRegExpiryDate: nullableDateField,
  rcdTestExpiryDate: nullableDateField,
  meggerTestExpiryDate: nullableDateField,
  ecocExpiryDate: nullableDateField,
  gasCocExpiryDate: nullableDateField,
  workOrderNo: Joi.string().allow(""),
  captain: nullableObjectIdField,
  lineManager: nullableObjectIdField,
  company: nullableObjectIdField,
  status: Joi.string().valid(...VESSEL_STATUS),
  notes: Joi.string().allow(""),
  ...vesselDeviceBodySchema
};

const createVessel = {
  body: Joi.object(vesselBodySchema).options({ convert: false })
};

const getVessels = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};

const getVesselDetail = {
  params: Joi.object({
    id: objectIdField.required()
  })
};

const updateVessel = {
  params: Joi.object({
    id: objectIdField.required()
  }),
  body: Joi.object({
    ...vesselBodySchema,
    vesselCode: vesselCodeField,
    name: Joi.string()
  }).min(1).options({ convert: false })
};

const deleteVessel = {
  params: Joi.object({
    id: objectIdField.required()
  })
};

export const vesselsValidation = {
  getVessels,
  createVessel,
  getVesselDetail,
  updateVessel,
  deleteVessel
};
