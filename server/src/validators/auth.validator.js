import Joi from "joi";
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "#/utils/validator.utils.js";

const register = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password",
      "string.empty": "Please confirm your password"
    }),
    name: Joi.string().min(3).max(50).required().trim(),
  }).options({ convert: false })
};

const verifyEmail = {
  query: Joi.object({
    userId: Joi.string().required(),
    verifyToken: Joi.string().required()
  })
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  })
}

export const authValidation = {
  register,
  verifyEmail,
  login
}
