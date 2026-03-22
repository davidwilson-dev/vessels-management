import Joi from "joi";

import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from "#/utils/validator.utils.js";
import {
  CREW_ROLES,
  CREW_STATUS
} from "#/constants/enums.constants.js";

const objectIdField = Joi.string().pattern(OBJECT_ID_RULE).messages({
  "string.pattern.base": OBJECT_ID_RULE_MESSAGE
});

const nullableObjectIdField = objectIdField.allow(null);
const nullableDateField = Joi.string().isoDate().allow(null);

const certificateSchema = Joi.object({
  name: Joi.string().allow(""),
  number: Joi.string().allow(""),
  issuedBy: Joi.string().allow(""),
  issueDate: nullableDateField,
  expiryDate: nullableDateField
});

const emergencyContactSchema = Joi.object({
  name: Joi.string().allow(""),
  phone: Joi.string().allow(""),
  relationship: Joi.string().allow("")
});

const crewMemberBodySchema = {
  employeeCode: Joi.string().allow(""),
  fullName: Joi.string().required(),
  dateOfBirth: nullableDateField,
  nationality: Joi.string().allow(""),
  phone: Joi.string().allow(""),
  email: Joi.string().email().allow(""),
  role: Joi.string().valid(...CREW_ROLES).allow(""),
  rank: Joi.string().allow(""),
  company: nullableObjectIdField,
  assignedVessels: Joi.array().items(objectIdField).default([]),
  certificates: Joi.array().items(certificateSchema),
  medicalExpiryDate: nullableDateField,
  contractStartDate: nullableDateField,
  contractEndDate: nullableDateField,
  emergencyContact: emergencyContactSchema.allow(null),
  status: Joi.string().valid(...CREW_STATUS),
  notes: Joi.string().allow("")
};

const createCrewMember = {
  body: Joi.object(crewMemberBodySchema).options({ convert: false })
};

const getCrewMembers = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};

const getCrewMemberDetail = {
  params: Joi.object({
    id: objectIdField.required()
  })
};

const updateCrewMember = {
  params: Joi.object({
    id: objectIdField.required()
  }),
  body: Joi.object({
    ...crewMemberBodySchema,
    fullName: Joi.string()
  }).min(1).options({ convert: false })
};

const deleteCrewMember = {
  params: Joi.object({
    id: objectIdField.required()
  })
};

export const crewMembersValidation = {
  getCrewMembers,
  createCrewMember,
  getCrewMemberDetail,
  updateCrewMember,
  deleteCrewMember
};
