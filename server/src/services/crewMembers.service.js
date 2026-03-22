import { isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";

import { crewMembersRepo } from "#/repositories/crewMembers.repo.js";
import { vesselsRepo } from "#/repositories/vessels.repo.js";
import { vesselCrewAssignmentsRepo } from "#/repositories/vesselCrewAssignments.repo.js";
import { companyRelationsService } from "#/services/companyRelations.service.js";

import ApiError from "#/errors/ApiError.js";

const CREW_DATE_FIELDS = [
  "dateOfBirth",
  "medicalExpiryDate",
  "contractStartDate",
  "contractEndDate"
];

const normalizeRequiredString = (value, fieldName) => {
  const normalizedValue = typeof value === "string" ? value.trim() : value;

  if (!normalizedValue) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `${fieldName} is required`);
  }

  return normalizedValue;
};

const normalizeOptionalString = (value, { lowercase = false, emptyAsNull = false } = {}) => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const normalizedValue = typeof value === "string" ? value.trim() : value;
  if (normalizedValue === "" && emptyAsNull) return null;

  return lowercase && typeof normalizedValue === "string"
    ? normalizedValue.toLowerCase()
    : normalizedValue;
};

const normalizeOptionalObjectId = (value, fieldName) => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  if (!isValidObjectId(value)) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `Invalid ${fieldName}`);
  }

  return value;
};

const parseOptionalDate = (value, fieldName) => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `Invalid ${fieldName}`);
  }

  return parsedDate;
};

const parseCertificates = (certificates = []) => {
  return certificates.map((certificate, index) => ({
    name: certificate.name,
    number: certificate.number,
    issuedBy: certificate.issuedBy,
    issueDate: parseOptionalDate(certificate.issueDate, `certificates[${index}].issueDate`),
    expiryDate: parseOptionalDate(certificate.expiryDate, `certificates[${index}].expiryDate`)
  }));
};

const normalizeAssignedVessels = (assignedVessels = []) => {
  return [...new Set(assignedVessels)];
};

const ensureAssignedVesselsExist = async (assignedVessels) => {
  if (!assignedVessels || assignedVessels.length === 0) return;

  const vessels = await vesselsRepo.findByIds(assignedVessels);
  const existingVesselIds = new Set(vessels.map((vessel) => vessel._id.toString()));
  const missingVesselIds = assignedVessels.filter((vesselId) => !existingVesselIds.has(vesselId));

  if (missingVesselIds.length > 0) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Assigned vessel not found: ${missingVesselIds.join(", ")}`
    );
  }
};

const ensureEmailUnique = async (email, currentCrewMemberId = null) => {
  if (!email) return;

  const existedCrewMember = await crewMembersRepo.findByEmail(email);
  if (existedCrewMember && existedCrewMember._id.toString() !== currentCrewMemberId) {
    throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
  }
};

const handleCrewMemberWriteError = (error) => {
  if (error?.code === 11000) {
    if (error?.keyPattern?.email) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
    }

    throw new ApiError(StatusCodes.CONFLICT, "Crew member already exists");
  }

  throw error;
};

const validateContractDates = (contractStartDate, contractEndDate) => {
  if (contractStartDate && contractEndDate && contractEndDate < contractStartDate) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "contractEndDate must be greater than or equal to contractStartDate"
    );
  }
};

const resolveCrewRole = (crewMember) => {
  if (!crewMember) return null;
  if (crewMember.role) return crewMember.role;
  if (Array.isArray(crewMember.roles) && crewMember.roles.length > 0) {
    return crewMember.roles[0];
  }
  return null;
};

const resolveLeadershipVesselIds = async (assignedVessels, companyId) => {
  if (!companyId || !assignedVessels?.length) {
    return [];
  }

  const vessels = await vesselsRepo.findByIdsWithCompany(assignedVessels);

  return vessels
    .filter((vessel) => vessel.company?.toString() === companyId)
    .map((vessel) => vessel._id.toString());
};

const syncCrewLeadershipAssignments = async ({
  crewMemberId,
  role,
  companyId,
  assignedVessels
}) => {
  const normalizedRole = role === "captain" || role === "line_manager" ? role : null;
  const targetVesselIds = normalizedRole
    ? await resolveLeadershipVesselIds(assignedVessels, companyId)
    : [];

  await Promise.all([
    vesselsRepo.unsetCaptainByCrewMemberId(crewMemberId),
    vesselsRepo.unsetLineManagerByCrewMemberId(crewMemberId)
  ]);

  if (!normalizedRole || targetVesselIds.length === 0) {
    return;
  }

  if (normalizedRole === "captain") {
    await vesselsRepo.setCaptainByIds(targetVesselIds, crewMemberId);
    return;
  }

  await vesselsRepo.setLineManagerByIds(targetVesselIds, crewMemberId);
};

const syncCrewVesselAssignments = async ({
  crewMemberId,
  role,
  assignedVessels
}) => {
  const currentAssignments = await vesselCrewAssignmentsRepo.findCurrentByCrewMemberId(crewMemberId);
  const normalizedRole = role || null;
  const targetVesselIds = normalizedRole
    ? normalizeAssignedVessels(assignedVessels || [])
    : [];
  const targetKeys = new Set(targetVesselIds.map((vesselId) => `${vesselId}:${normalizedRole}`));
  const currentAssignmentKeyMap = new Map(
    currentAssignments.map((assignment) => [
      `${assignment.vessel?.toString()}:${assignment.role}`,
      assignment
    ])
  );
  const assignmentIdsToEnd = currentAssignments
    .filter((assignment) => !targetKeys.has(`${assignment.vessel?.toString()}:${assignment.role}`))
    .map((assignment) => assignment._id);
  const assignmentsToCreate = targetVesselIds
    .filter((vesselId) => !currentAssignmentKeyMap.has(`${vesselId}:${normalizedRole}`))
    .map((vesselId) => ({
      vessel: vesselId,
      crewMember: crewMemberId,
      role: normalizedRole,
      startDate: new Date(),
      isCurrent: true
    }));

  await Promise.all([
    vesselCrewAssignmentsRepo.endCurrentByIds(assignmentIdsToEnd),
    Promise.all(assignmentsToCreate.map((assignment) => vesselCrewAssignmentsRepo.create(assignment)))
  ]);
};

const buildCreatePayload = (data) => {
  const payload = {
    employeeCode: data.employeeCode,
    fullName: normalizeRequiredString(data.fullName, "fullName"),
    nationality: data.nationality,
    phone: data.phone,
    email: normalizeOptionalString(data.email, { lowercase: true, emptyAsNull: true }),
    role: normalizeOptionalString(data.role, { emptyAsNull: true }),
    rank: data.rank,
    company: normalizeOptionalObjectId(data.company, "company"),
    assignedVessels: normalizeAssignedVessels(data.assignedVessels || []),
    certificates: data.certificates ? parseCertificates(data.certificates) : undefined,
    emergencyContact: data.emergencyContact,
    status: data.status,
    notes: data.notes
  };

  CREW_DATE_FIELDS.forEach((field) => {
    const parsedValue = parseOptionalDate(data[field], field);
    if (parsedValue !== undefined) payload[field] = parsedValue;
  });

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined || payload[key] === null) {
      delete payload[key];
    }
  });

  return payload;
};

const buildUpdatePayload = (data) => {
  const setPayload = {};
  const unsetPayload = {};

  if (data.employeeCode !== undefined) setPayload.employeeCode = data.employeeCode;
  if (data.fullName !== undefined) setPayload.fullName = normalizeRequiredString(data.fullName, "fullName");
  if (data.nationality !== undefined) setPayload.nationality = data.nationality;
  if (data.phone !== undefined) setPayload.phone = data.phone;

  if (data.email !== undefined) {
    const normalizedEmail = normalizeOptionalString(data.email, { lowercase: true, emptyAsNull: true });
    if (normalizedEmail === null) {
      unsetPayload.email = "";
    } else {
      setPayload.email = normalizedEmail;
    }
  }

  if (data.role !== undefined) {
    const normalizedRole = normalizeOptionalString(data.role, { emptyAsNull: true });
    if (normalizedRole === null) {
      unsetPayload.role = "";
    } else {
      setPayload.role = normalizedRole;
    }

    unsetPayload.roles = "";
  }
  if (data.rank !== undefined) setPayload.rank = data.rank;
  if (data.company !== undefined) setPayload.company = normalizeOptionalObjectId(data.company, "company");
  if (data.assignedVessels !== undefined) {
    setPayload.assignedVessels = normalizeAssignedVessels(data.assignedVessels);
  }
  if (data.certificates !== undefined) setPayload.certificates = parseCertificates(data.certificates);
  if (data.emergencyContact !== undefined) setPayload.emergencyContact = data.emergencyContact;
  if (data.status !== undefined) setPayload.status = data.status;
  if (data.notes !== undefined) setPayload.notes = data.notes;

  CREW_DATE_FIELDS.forEach((field) => {
    if (data[field] !== undefined) {
      setPayload[field] = parseOptionalDate(data[field], field);
    }
  });

  return {
    $set: setPayload,
    $unset: unsetPayload
  };
};

const toVesselSummary = (vessel) => {
  if (!vessel) return null;

  return {
    id: vessel._id,
    vesselCode: vessel.vesselCode,
    name: vessel.name,
    officialNumber: vessel.officialNumber,
    imoNumber: vessel.imoNumber,
    amsaUvi: vessel.amsaUvi,
    vesselType: vessel.vesselType,
    status: vessel.status
  };
};

const toAssignment = (assignment) => ({
  id: assignment._id,
  role: assignment.role,
  startDate: assignment.startDate,
  endDate: assignment.endDate,
  isCurrent: assignment.isCurrent,
  notes: assignment.notes,
  vessel: toVesselSummary(assignment.vessel)
});

const toCrewMemberResponse = (crewMember, assignments) => ({
  id: crewMember._id,
  employeeCode: crewMember.employeeCode,
  fullName: crewMember.fullName,
  dateOfBirth: crewMember.dateOfBirth,
  nationality: crewMember.nationality,
  phone: crewMember.phone,
  email: crewMember.email,
  role: resolveCrewRole(crewMember),
  rank: crewMember.rank,
  company: crewMember.company,
  assignedVessels: (crewMember.assignedVessels || []).map(toVesselSummary),
  certificates: crewMember.certificates || [],
  medicalExpiryDate: crewMember.medicalExpiryDate,
  contractStartDate: crewMember.contractStartDate,
  contractEndDate: crewMember.contractEndDate,
  emergencyContact: crewMember.emergencyContact || null,
  status: crewMember.status,
  notes: crewMember.notes,
  assignments: assignments.map(toAssignment),
  createdAt: crewMember.createdAt,
  updatedAt: crewMember.updatedAt
});

const toCrewMemberListItem = (crewMember) => ({
  id: crewMember._id,
  employeeCode: crewMember.employeeCode,
  fullName: crewMember.fullName,
  nationality: crewMember.nationality,
  phone: crewMember.phone,
  email: crewMember.email,
  role: resolveCrewRole(crewMember),
  rank: crewMember.rank,
  assignedVessels: (crewMember.assignedVessels || []).map(toVesselSummary),
  status: crewMember.status,
  createdAt: crewMember.createdAt,
  updatedAt: crewMember.updatedAt
});

const getCrewMembers = async (data) => {
  const page = Math.max(Number(data.page) || 1, 1);
  const limit = Math.min(Math.max(Number(data.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [crewMembers, totalCrewMembers] = await Promise.all([
    crewMembersRepo.findMany(limit, skip),
    crewMembersRepo.countAll()
  ]);

  const totalPages = Math.ceil(totalCrewMembers / limit);

  return {
    crewMembers: crewMembers.map(toCrewMemberListItem),
    pagination: {
      page,
      limit,
      skip,
      totalCrewMembers,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    }
  };
};

const getCrewMemberById = async (crewMemberId) => {
  const crewMember = await crewMembersRepo.findDetailById(crewMemberId);
  if (!crewMember) throw new ApiError(StatusCodes.NOT_FOUND, "Crew member not found");

  const assignments = await vesselCrewAssignmentsRepo.findByCrewMemberId(crewMemberId);
  return toCrewMemberResponse(crewMember, assignments);
};

const createCrewMember = async (data) => {
  const payload = buildCreatePayload(data);

  await Promise.all([
    ensureAssignedVesselsExist(payload.assignedVessels),
    companyRelationsService.ensureCompanyExists(payload.company),
    ensureEmailUnique(payload.email)
  ]);

  validateContractDates(payload.contractStartDate, payload.contractEndDate);

  let crewMember;

  try {
    crewMember = await crewMembersRepo.create(payload);
    await Promise.all([
      companyRelationsService.syncCompanyCrewRelation(crewMember._id, payload.company ?? null),
      syncCrewVesselAssignments({
        crewMemberId: crewMember._id.toString(),
        role: payload.role ?? null,
        assignedVessels: payload.assignedVessels || []
      }),
      syncCrewLeadershipAssignments({
        crewMemberId: crewMember._id.toString(),
        role: payload.role ?? null,
        companyId: payload.company?.toString() ?? null,
        assignedVessels: payload.assignedVessels || []
      })
    ]);
  } catch (error) {
    if (crewMember?._id) {
      await Promise.allSettled([
        companyRelationsService.deleteCompanyCrewRelations(crewMember._id),
        vesselCrewAssignmentsRepo.deleteByCrewMemberId(crewMember._id),
        vesselsRepo.unsetCaptainByCrewMemberId(crewMember._id),
        vesselsRepo.unsetLineManagerByCrewMemberId(crewMember._id),
        crewMembersRepo.deleteById(crewMember._id)
      ]);
    }

    handleCrewMemberWriteError(error);
  }

  return {
    crewMember: await getCrewMemberById(crewMember._id)
  };
};

const getCrewMemberDetail = async (crewMemberId) => {
  return {
    crewMember: await getCrewMemberById(crewMemberId)
  };
};

const updateCrewMember = async (crewMemberId, data) => {
  const currentCrewMember = await crewMembersRepo.findById(crewMemberId);
  if (!currentCrewMember) throw new ApiError(StatusCodes.NOT_FOUND, "Crew member not found");

  const update = buildUpdatePayload(data);
  if (update.$set.role === undefined && update.$unset.role === undefined) {
    const legacyRole = resolveCrewRole(currentCrewMember);
    if (legacyRole && currentCrewMember.role === undefined) {
      update.$set.role = legacyRole;
      update.$unset.roles = "";
    }
  }
  const nextContractStartDate = update.$set.contractStartDate !== undefined
    ? update.$set.contractStartDate
    : currentCrewMember.contractStartDate;
  const nextContractEndDate = update.$set.contractEndDate !== undefined
    ? update.$set.contractEndDate
    : currentCrewMember.contractEndDate;
  const nextAssignedVessels = update.$set.assignedVessels !== undefined
    ? update.$set.assignedVessels
    : currentCrewMember.assignedVessels?.map((vesselId) => vesselId.toString()) || [];
  const nextEmail = update.$unset.email !== undefined
    ? null
    : (update.$set.email ?? currentCrewMember.email);
  const nextCompany = data.company !== undefined
    ? (update.$set.company ?? null)
    : (currentCrewMember.company?.toString() ?? null);
  const nextRole = data.role !== undefined
    ? (update.$set.role ?? null)
    : resolveCrewRole(currentCrewMember);

  await Promise.all([
    ensureAssignedVesselsExist(nextAssignedVessels),
    companyRelationsService.ensureCompanyExists(nextCompany),
    ensureEmailUnique(nextEmail, crewMemberId)
  ]);

  validateContractDates(nextContractStartDate, nextContractEndDate);

  const updateCommand = {};
  if (Object.keys(update.$set).length > 0) updateCommand.$set = update.$set;
  if (Object.keys(update.$unset).length > 0) updateCommand.$unset = update.$unset;

  try {
    await crewMembersRepo.updateById(crewMemberId, updateCommand);
    await Promise.all([
      companyRelationsService.syncCompanyCrewRelation(crewMemberId, nextCompany),
      syncCrewVesselAssignments({
        crewMemberId,
        role: nextRole,
        assignedVessels: nextAssignedVessels
      }),
      syncCrewLeadershipAssignments({
        crewMemberId,
        role: nextRole,
        companyId: nextCompany,
        assignedVessels: nextAssignedVessels
      })
    ]);
  } catch (error) {
    handleCrewMemberWriteError(error);
  }

  return {
    crewMember: await getCrewMemberById(crewMemberId)
  };
};

const deleteCrewMember = async (crewMemberId) => {
  const crewMember = await crewMembersRepo.findById(crewMemberId);
  if (!crewMember) throw new ApiError(StatusCodes.NOT_FOUND, "Crew member not found");

  await Promise.all([
    vesselsRepo.unsetCaptainByCrewMemberId(crewMemberId),
    vesselsRepo.unsetLineManagerByCrewMemberId(crewMemberId),
    vesselCrewAssignmentsRepo.deleteByCrewMemberId(crewMemberId),
    companyRelationsService.deleteCompanyCrewRelations(crewMemberId),
    crewMembersRepo.deleteById(crewMemberId)
  ]);

  return { message: "Crew member deleted" };
};

export const crewMembersService = {
  getCrewMembers,
  createCrewMember,
  getCrewMemberDetail,
  updateCrewMember,
  deleteCrewMember
};
