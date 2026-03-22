import { StatusCodes } from "http-status-codes";

import { companiesRepo } from "#/repositories/companies.repo.js";
import { companyVesselAssignmentsRepo } from "#/repositories/companyVesselAssignments.repo.js";
import { companyCrewAssignmentsRepo } from "#/repositories/companyCrewAssignments.repo.js";

import ApiError from "#/errors/ApiError.js";

const ensureCompanyExists = async (companyId) => {
  if (!companyId) return null;

  const company = await companiesRepo.findById(companyId);
  if (!company) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Company not found");
  }

  return company;
};

const syncCompanyVesselRelation = async (vesselId, companyId) => {
  const currentAssignment = await companyVesselAssignmentsRepo.findCurrentByVesselId(vesselId);

  if (!companyId) {
    if (currentAssignment) {
      await companyVesselAssignmentsRepo.endCurrentByVesselId(vesselId);
    }

    return null;
  }

  await ensureCompanyExists(companyId);

  if (currentAssignment?.company?.toString() === companyId) {
    return currentAssignment;
  }

  if (currentAssignment) {
    await companyVesselAssignmentsRepo.endCurrentByVesselId(vesselId);
  }

  return companyVesselAssignmentsRepo.create({
    company: companyId,
    vessel: vesselId,
    startDate: new Date(),
    isCurrent: true
  });
};

const syncCompanyCrewRelation = async (crewMemberId, companyId) => {
  const currentAssignment = await companyCrewAssignmentsRepo.findCurrentByCrewMemberId(crewMemberId);

  if (!companyId) {
    if (currentAssignment) {
      await companyCrewAssignmentsRepo.endCurrentByCrewMemberId(crewMemberId);
    }

    return null;
  }

  await ensureCompanyExists(companyId);

  if (currentAssignment?.company?.toString() === companyId) {
    return currentAssignment;
  }

  if (currentAssignment) {
    await companyCrewAssignmentsRepo.endCurrentByCrewMemberId(crewMemberId);
  }

  return companyCrewAssignmentsRepo.create({
    company: companyId,
    crewMember: crewMemberId,
    startDate: new Date(),
    isCurrent: true
  });
};

const deleteCompanyVesselRelations = async (vesselId) => {
  await companyVesselAssignmentsRepo.deleteByVesselId(vesselId);
};

const deleteCompanyCrewRelations = async (crewMemberId) => {
  await companyCrewAssignmentsRepo.deleteByCrewMemberId(crewMemberId);
};

export const companyRelationsService = {
  ensureCompanyExists,
  syncCompanyVesselRelation,
  syncCompanyCrewRelation,
  deleteCompanyVesselRelations,
  deleteCompanyCrewRelations
};
