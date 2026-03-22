import express from "express";
import env from "#/config/environment.config.js";

import authenticateMiddleware from "#/middlewares/authenticate.middleware.js";
import authorizeMiddleware from "#/middlewares/authorize.middleware.js";
import validate from "#/middlewares/validate.middleware.js";
import asyncHandler from "#/middlewares/asyncHandler.middleware.js";

import { usersController } from "#/controllers/users.controller.js";
import { companiesController } from "#/controllers/companies.controller.js";
import { vesselsController } from "#/controllers/vessels.controller.js";
import { crewMembersController } from "#/controllers/crewMembers.controller.js";
import { usersValidation } from "#/validators/users.validator.js";
import { companiesValidation } from "#/validators/companies.validator.js";
import { vesselsValidation } from "#/validators/vessels.validator.js";
import { crewMembersValidation } from "#/validators/crewMembers.validator.js";

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

router.post(
  "/companies",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(companiesValidation.createCompany),
  asyncHandler(companiesController.createCompany)
);

router.get(
  "/companies",
  authenticateMiddleware,
  authorizeMiddleware(["admin", "staff"]),
  validate(companiesValidation.getCompanies),
  asyncHandler(companiesController.getCompanies)
);

router.get(
  "/companies/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin", "staff"]),
  validate(companiesValidation.getCompanyDetail),
  asyncHandler(companiesController.getCompanyDetail)
);

router.patch(
  "/companies/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(companiesValidation.updateCompany),
  asyncHandler(companiesController.updateCompany)
);

router.delete(
  "/companies/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(companiesValidation.deleteCompany),
  asyncHandler(companiesController.deleteCompany)
);

router.post(
  "/vessels",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(vesselsValidation.createVessel),
  asyncHandler(vesselsController.createVessel)
);

router.get(
  "/vessels",
  authenticateMiddleware,
  authorizeMiddleware(["admin", "staff"]),
  validate(vesselsValidation.getVessels),
  asyncHandler(vesselsController.getVessels)
);

router.get(
  "/vessels/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin", "staff"]),
  validate(vesselsValidation.getVesselDetail),
  asyncHandler(vesselsController.getVesselDetail)
);

router.patch(
  "/vessels/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(vesselsValidation.updateVessel),
  asyncHandler(vesselsController.updateVessel)
);

router.delete(
  "/vessels/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(vesselsValidation.deleteVessel),
  asyncHandler(vesselsController.deleteVessel)
);

router.post(
  "/crew-members",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(crewMembersValidation.createCrewMember),
  asyncHandler(crewMembersController.createCrewMember)
);

router.get(
  "/crew-members",
  authenticateMiddleware,
  authorizeMiddleware(["admin", "staff"]),
  validate(crewMembersValidation.getCrewMembers),
  asyncHandler(crewMembersController.getCrewMembers)
);

router.get(
  "/crew-members/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin", "staff"]),
  validate(crewMembersValidation.getCrewMemberDetail),
  asyncHandler(crewMembersController.getCrewMemberDetail)
);

router.patch(
  "/crew-members/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(crewMembersValidation.updateCrewMember),
  asyncHandler(crewMembersController.updateCrewMember)
);

router.delete(
  "/crew-members/:id",
  authenticateMiddleware,
  authorizeMiddleware(["admin"]),
  validate(crewMembersValidation.deleteCrewMember),
  asyncHandler(crewMembersController.deleteCrewMember)
);

export const adminRoute = router;
