import Joi from "joi";
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "#/utils/validator.utils.js";

const createUser = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    name: Joi.string().min(3).max(50).required().trim(),
    dateOfBirth: Joi.string().isoDate().required(),
    address: Joi.string().allow("").trim(),
    idCardNumber: Joi.string().allow("").trim(),
    phoneNumber: Joi.string().allow("").trim(),
    gender: Joi.string().valid("Male", "Female", "Other"),
    position: Joi.string().allow("").trim(),
    avatarUrl: Joi.string().allow("").trim(),
    bio: Joi.string().allow("").trim()
  }).options({ convert: false })
};

const updateUser = {
  params: Joi.object({
    id: Joi.string().required()
  }),
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8).pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    name: Joi.string().min(3).max(50).trim(),
    dateOfBirth: Joi.string().isoDate(),
    address: Joi.string().allow("").trim(),
    idCardNumber: Joi.string().allow("").trim(),
    phoneNumber: Joi.string().allow("").trim(),
    gender: Joi.string().valid("Male", "Female", "Other"),
    position: Joi.string().allow("").trim(),
    avatarUrl: Joi.string().allow("").trim(),
    bio: Joi.string().allow("").trim(),
    isActive: Joi.boolean(),
    emailVerified: Joi.boolean()
  }).min(1).options({ convert: false })
};

const deleteUser = {
  params: Joi.object({
    id: Joi.string().required()
  })
};

const lockUser = {
  params: Joi.object({
    id: Joi.string().required()
  })
};

export const usersValidation = {
  createUser,
  updateUser,
  deleteUser,
  lockUser
}
