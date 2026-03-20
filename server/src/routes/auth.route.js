import express from "express";

import { authController } from "#/controllers/auth.controller.js";
import { authValidation } from "#/validators/auth.validator.js";
import validate from "#/middlewares/validate.middleware.js";
import asyncHandler from "#/middlewares/asyncHandler.middleware.js";

const router = express.Router();

router.post("/register", validate(authValidation.register), asyncHandler(authController.register));

router.get("/verify-email", validate(authValidation.verifyEmail), asyncHandler(authController.verifyEmail));

router.post("/login", validate(authValidation.login), asyncHandler(authController.login));

router.delete("/logout", asyncHandler(authController.logout));

router.post("/refresh-token", asyncHandler(authController.refreshToken));

export const authRoute = router;
