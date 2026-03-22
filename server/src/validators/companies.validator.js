import Joi from "joi";

import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from "#/utils/validator.utils.js";
import {
  COMPANY_STATUS
} from "#/constants/enums.constants.js";

const objectIdField = Joi.string().pattern(OBJECT_ID_RULE).messages({
  "string.pattern.base": OBJECT_ID_RULE_MESSAGE
});

const companyCodeField = Joi.string().trim().pattern(/^[A-Za-z0-9-]+$/).messages({
  "string.pattern.base": "companyCode may only contain letters, numbers, and hyphens"
});

const companyBodySchema = {
  companyCode: companyCodeField.required(),
  name: Joi.string().required(),
  email: Joi.string().email().allow(""),
  phone: Joi.string().allow(""),
  address: Joi.string().allow(""),
  status: Joi.string().valid(...COMPANY_STATUS),
  notes: Joi.string().allow("")
};

const createCompany = {
  body: Joi.object(companyBodySchema).options({ convert: false })
};

const getCompanies = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};

const getCompanyDetail = {
  params: Joi.object({
    id: objectIdField.required()
  })
};

const updateCompany = {
  params: Joi.object({
    id: objectIdField.required()
  }),
  body: Joi.object({
    ...companyBodySchema,
    companyCode: companyCodeField,
    name: Joi.string()
  }).min(1).options({ convert: false })
};

const deleteCompany = {
  params: Joi.object({
    id: objectIdField.required()
  })
};

export const companiesValidation = {
  getCompanies,
  createCompany,
  getCompanyDetail,
  updateCompany,
  deleteCompany
};
