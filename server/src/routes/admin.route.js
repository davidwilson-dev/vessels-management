import express from "express";
import env from "#/config/environment.config.js";

import authenticateMiddleware from "#/middlewares/authenticate.middleware.js";
import authorizeMiddleware from "#/middlewares/authorize.middleware.js";
import validate from "#/middlewares/validate.middleware.js";
import asyncHandler from "#/middlewares/asyncHandler.middleware.js";

import { usersController } from "#/controllers/users.controller.js";
import { usersValidation } from "#/validators/users.validator.js";

const router = express.Router();

router.get("/dashboard", authenticateMiddleware, authorizeMiddleware(["admin", "staff"]), (req, res) => {
  res.redirect(`${env.ADMIN_URL}/dashboard`);
});

router.get(
  "/users",
  authenticateMiddleware,
  authorizeMiddleware(["admin", "staff"]),
  asyncHandler(usersController.getUsers)
);

router.post(
  "/users",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(usersValidation.createUser),
  asyncHandler(usersController.createUser)
);

router.patch(
  "/users/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(usersValidation.updateUser),
  asyncHandler(usersController.updateUser)
);

router.delete(
  "/users/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(usersValidation.deleteUser),
  asyncHandler(usersController.deleteUser)
);

router.patch(
  "/users/:id/lock",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(usersValidation.lockUser),
  asyncHandler(usersController.lockUser)
);

export const adminRoute = router;
