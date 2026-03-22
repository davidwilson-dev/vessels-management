import { isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";

import { vesselsRepo } from "#/repositories/vessels.repo.js";
import { crewMembersRepo } from "#/repositories/crewMembers.repo.js";
import { vesselCrewAssignmentsRepo } from "#/repositories/vesselCrewAssignments.repo.js";
import { vesselDevicesService } from "#/services/vesselDevices.service.js";
import { companyRelationsService } from "#/services/companyRelations.service.js";

import ApiError from "#/errors/ApiError.js";

const VESSEL_DATE_FIELDS = [
  "cosExpiryDate",
  "surveyAnniversaryDate",
  "classCertExpiryDate",
  "cooExpiryDate",
  "trailerRegExpiryDate",
  "rcdTestExpiryDate",
  "meggerTestExpiryDate",
  "ecocExpiryDate",
  "gasCocExpiryDate"
];

const normalizeRequiredString = (value, fieldName) => {
  const normalizedValue = typeof value === "string" ? value.trim() : value;

  if (!normalizedValue) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `${fieldName} is required`);
  }

  return normalizedValue;
};

const normalizeOptionalSparseString = (value, { lowercase = false } = {}) => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const normalizedValue = typeof value === "string" ? value.trim() : value;
  if (normalizedValue === "") return null;

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

const buildCreatePayload = (data) => {
  const payload = {
    vesselCode: normalizeRequiredString(data.vesselCode, "vesselCode").toUpperCase(),
    name: normalizeRequiredString(data.name, "name"),
    officialNumber: data.officialNumber,
    imoNumber: normalizeOptionalSparseString(data.imoNumber),
    amsaUvi: normalizeOptionalSparseString(data.amsaUvi, { lowercase: true }),
    trailerRegNo: data.trailerRegNo,
    homePort: data.homePort,
    builder: data.builder,
    buildYear: data.buildYear,
    buildersPlateNo: data.buildersPlateNo,
    surveyClass: data.surveyClass,
    surveyAuthority: data.surveyAuthority,
    vesselType: data.vesselType,
    flagState: data.flagState,
    lengthOverall: data.lengthOverall,
    beam: data.beam,
    draft: data.draft,
    grossTonnage: data.grossTonnage,
    netTonnage: data.netTonnage,
    hullMaterial: data.hullMaterial,
    noOfCrew: data.noOfCrew,
    noOfPax: data.noOfPax,
    noOfBerthed: data.noOfBerthed,
    noOfUnberthedPax: data.noOfUnberthedPax,
    workOrderNo: data.workOrderNo,
    captain: normalizeOptionalObjectId(data.captain, "captain"),
    lineManager: normalizeOptionalObjectId(data.lineManager, "lineManager"),
    company: normalizeOptionalObjectId(data.company, "company"),
    status: data.status,
    notes: data.notes
  };

  VESSEL_DATE_FIELDS.forEach((field) => {
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

  if (data.vesselCode !== undefined) {
    setPayload.vesselCode = normalizeRequiredString(data.vesselCode, "vesselCode").toUpperCase();
  }

  if (data.name !== undefined) {
    setPayload.name = normalizeRequiredString(data.name, "name");
  }

  if (data.officialNumber !== undefined) setPayload.officialNumber = data.officialNumber;
  if (data.imoNumber !== undefined) {
    const normalizedImoNumber = normalizeOptionalSparseString(data.imoNumber);
    if (normalizedImoNumber === null) {
      unsetPayload.imoNumber = "";
    } else {
      setPayload.imoNumber = normalizedImoNumber;
    }
  }

  if (data.amsaUvi !== undefined) {
    const normalizedAmsaUvi = normalizeOptionalSparseString(data.amsaUvi, { lowercase: true });
    if (normalizedAmsaUvi === null) {
      unsetPayload.amsaUvi = "";
    } else {
      setPayload.amsaUvi = normalizedAmsaUvi;
    }
  }

  if (data.trailerRegNo !== undefined) setPayload.trailerRegNo = data.trailerRegNo;
  if (data.homePort !== undefined) setPayload.homePort = data.homePort;
  if (data.builder !== undefined) setPayload.builder = data.builder;
  if (data.buildYear !== undefined) setPayload.buildYear = data.buildYear;
  if (data.buildersPlateNo !== undefined) setPayload.buildersPlateNo = data.buildersPlateNo;
  if (data.surveyClass !== undefined) setPayload.surveyClass = data.surveyClass;
  if (data.surveyAuthority !== undefined) setPayload.surveyAuthority = data.surveyAuthority;
  if (data.vesselType !== undefined) setPayload.vesselType = data.vesselType;
  if (data.flagState !== undefined) setPayload.flagState = data.flagState;
  if (data.lengthOverall !== undefined) setPayload.lengthOverall = data.lengthOverall;
  if (data.beam !== undefined) setPayload.beam = data.beam;
  if (data.draft !== undefined) setPayload.draft = data.draft;
  if (data.grossTonnage !== undefined) setPayload.grossTonnage = data.grossTonnage;
  if (data.netTonnage !== undefined) setPayload.netTonnage = data.netTonnage;
  if (data.hullMaterial !== undefined) setPayload.hullMaterial = data.hullMaterial;
  if (data.noOfCrew !== undefined) setPayload.noOfCrew = data.noOfCrew;
  if (data.noOfPax !== undefined) setPayload.noOfPax = data.noOfPax;
  if (data.noOfBerthed !== undefined) setPayload.noOfBerthed = data.noOfBerthed;
  if (data.noOfUnberthedPax !== undefined) setPayload.noOfUnberthedPax = data.noOfUnberthedPax;
  if (data.workOrderNo !== undefined) setPayload.workOrderNo = data.workOrderNo;

  if (data.captain !== undefined) {
    setPayload.captain = normalizeOptionalObjectId(data.captain, "captain");
  }

  if (data.lineManager !== undefined) {
    setPayload.lineManager = normalizeOptionalObjectId(data.lineManager, "lineManager");
  }

  if (data.company !== undefined) {
    setPayload.company = normalizeOptionalObjectId(data.company, "company");
  }

  if (data.status !== undefined) setPayload.status = data.status;
  if (data.notes !== undefined) setPayload.notes = data.notes;

  VESSEL_DATE_FIELDS.forEach((field) => {
    if (data[field] !== undefined) {
      setPayload[field] = parseOptionalDate(data[field], field);
    }
  });

  return {
    $set: setPayload,
    $unset: unsetPayload
  };
};

const ensureCrewMemberExists = async (crewMemberId, fieldName) => {
  if (!crewMemberId) return;

  const crewMember = await crewMembersRepo.findById(crewMemberId);
  if (!crewMember) {
    throw new ApiError(StatusCodes.NOT_FOUND, `${fieldName} not found`);
  }
};

const ensureUniqueValues = async (payload, currentVesselId = null) => {
  if (payload.vesselCode) {
    const existedVessel = await vesselsRepo.findByVesselCode(payload.vesselCode);
    if (existedVessel && existedVessel._id.toString() !== currentVesselId) {
      throw new ApiError(StatusCodes.CONFLICT, "Vessel code already exists");
    }
  }

  if (payload.amsaUvi) {
    const existedVessel = await vesselsRepo.findByAmsaUvi(payload.amsaUvi);
    if (existedVessel && existedVessel._id.toString() !== currentVesselId) {
      throw new ApiError(StatusCodes.CONFLICT, "AMSA UVI already exists");
    }
  }

  if (payload.imoNumber) {
    const existedVessel = await vesselsRepo.findByImoNumber(payload.imoNumber);
    if (existedVessel && existedVessel._id.toString() !== currentVesselId) {
      throw new ApiError(StatusCodes.CONFLICT, "IMO number already exists");
    }
  }

};

const handleVesselWriteError = (error) => {
  if (error?.code === 11000) {
    if (error?.keyPattern?.vesselCode) {
      throw new ApiError(StatusCodes.CONFLICT, "Vessel code already exists");
    }

    if (error?.keyPattern?.name && error?.keyPattern?.company) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "A legacy unique index on company and name still exists. Drop index company_1_name_1 and retry."
      );
    }

    if (error?.keyPattern?.amsaUvi) {
      throw new ApiError(StatusCodes.CONFLICT, "AMSA UVI already exists");
    }

    if (error?.keyPattern?.imoNumber) {
      throw new ApiError(StatusCodes.CONFLICT, "IMO number already exists");
    }

    throw new ApiError(StatusCodes.CONFLICT, "Vessel already exists");
  }

  throw error;
};

const toCrewSummary = (crewMember) => {
  if (!crewMember) return null;

  return {
    id: crewMember._id ?? crewMember.id ?? null,
    employeeCode: crewMember.employeeCode,
    fullName: crewMember.fullName,
    email: crewMember.email,
    phone: crewMember.phone,
    role: crewMember.role ?? crewMember.roles?.[0] ?? null,
    rank: crewMember.rank,
    status: crewMember.status
  };
};

const toCompanySummary = (company) => {
  if (!company) return null;

  return {
    id: company._id ?? company.id ?? null,
    companyCode: company.companyCode ?? null,
    name: company.name ?? null,
    status: company.status ?? null
  };
};

const toAssignment = (assignment) => ({
  id: assignment._id,
  role: assignment.role,
  startDate: assignment.startDate,
  endDate: assignment.endDate,
  isCurrent: assignment.isCurrent,
  notes: assignment.notes,
  crewMember: toCrewSummary(assignment.crewMember)
});

const resolveLeadershipCrewMember = (assignments, role, fallbackCrewMember = null) => {
  const currentAssignment = assignments.find(
    (assignment) => assignment.isCurrent && assignment.role === role
  );

  return currentAssignment?.crewMember ?? fallbackCrewMember;
};

const toVesselResponse = (vessel, assignments, devices) => ({
  id: vessel._id,
  vesselCode: vessel.vesselCode,
  name: vessel.name,
  officialNumber: vessel.officialNumber,
  imoNumber: vessel.imoNumber,
  amsaUvi: vessel.amsaUvi,
  trailerRegNo: vessel.trailerRegNo,
  homePort: vessel.homePort,
  builder: vessel.builder,
  buildYear: vessel.buildYear,
  buildersPlateNo: vessel.buildersPlateNo,
  surveyClass: vessel.surveyClass,
  surveyAuthority: vessel.surveyAuthority,
  vesselType: vessel.vesselType,
  flagState: vessel.flagState,
  lengthOverall: vessel.lengthOverall,
  beam: vessel.beam,
  draft: vessel.draft,
  grossTonnage: vessel.grossTonnage,
  netTonnage: vessel.netTonnage,
  hullMaterial: vessel.hullMaterial,
  noOfCrew: vessel.noOfCrew,
  noOfPax: vessel.noOfPax,
  noOfBerthed: vessel.noOfBerthed,
  noOfUnberthedPax: vessel.noOfUnberthedPax,
  cosExpiryDate: vessel.cosExpiryDate,
  surveyAnniversaryDate: vessel.surveyAnniversaryDate,
  classCertExpiryDate: vessel.classCertExpiryDate,
  cooExpiryDate: vessel.cooExpiryDate,
  trailerRegExpiryDate: vessel.trailerRegExpiryDate,
  rcdTestExpiryDate: vessel.rcdTestExpiryDate,
  meggerTestExpiryDate: vessel.meggerTestExpiryDate,
  ecocExpiryDate: vessel.ecocExpiryDate,
  gasCocExpiryDate: vessel.gasCocExpiryDate,
  workOrderNo: vessel.workOrderNo,
  captain: toCrewSummary(resolveLeadershipCrewMember(assignments, "captain", vessel.captain)),
  lineManager: toCrewSummary(resolveLeadershipCrewMember(assignments, "line_manager", vessel.lineManager)),
  company: toCompanySummary(vessel.company),
  status: vessel.status,
  notes: vessel.notes,
  crewAssignments: assignments.map(toAssignment),
  ...devices,
  createdAt: vessel.createdAt,
  updatedAt: vessel.updatedAt
});

const buildLeadershipMap = (assignments) => {
  const leadershipMap = new Map();

  assignments.forEach((assignment) => {
    const key = `${assignment.vessel?.toString?.() ?? assignment.vessel}:${assignment.role}`;

    if (!leadershipMap.has(key)) {
      leadershipMap.set(key, assignment);
    }
  });

  return leadershipMap;
};

const toVesselListItem = (vessel, leadershipMap) => ({
  id: vessel._id,
  vesselCode: vessel.vesselCode,
  name: vessel.name,
  amsaUvi: vessel.amsaUvi,
  vesselType: vessel.vesselType,
  captain: toCrewSummary(leadershipMap.get(`${vessel._id.toString()}:captain`)?.crewMember),
  lineManager: toCrewSummary(leadershipMap.get(`${vessel._id.toString()}:line_manager`)?.crewMember),
  company: toCompanySummary(vessel.company),
  status: vessel.status,
  updatedAt: vessel.updatedAt
});

const getVessels = async (data) => {
  const page = Math.max(Number(data.page) || 1, 1);
  const limit = Math.min(Math.max(Number(data.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [vessels, totalVessels] = await Promise.all([
    vesselsRepo.findMany(limit, skip),
    vesselsRepo.countAll()
  ]);
  const leadershipAssignments = await vesselCrewAssignmentsRepo.findCurrentLeadershipByVesselIds(
    vessels.map((vessel) => vessel._id)
  );
  const leadershipMap = buildLeadershipMap(leadershipAssignments);

  const totalPages = Math.ceil(totalVessels / limit);

  return {
    vessels: vessels.map((vessel) => toVesselListItem(vessel, leadershipMap)),
    pagination: {
      page,
      limit,
      skip,
      totalVessels,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    }
  };
};

const getVesselById = async (vesselId) => {
  const vessel = await vesselsRepo.findDetailById(vesselId);
  if (!vessel) throw new ApiError(StatusCodes.NOT_FOUND, "Vessel not found");

  const [assignments, devices] = await Promise.all([
    vesselCrewAssignmentsRepo.findByVesselId(vesselId),
    vesselDevicesService.getVesselDevices(vesselId)
  ]);

  return toVesselResponse(vessel, assignments, devices);
};

const createVessel = async (data) => {
  const normalizedData = vesselDevicesService.normalizeDevicePayloadKeys(data);
  const payload = buildCreatePayload(normalizedData);

  await Promise.all([
    ensureCrewMemberExists(payload.captain, "Captain"),
    ensureCrewMemberExists(payload.lineManager, "Line manager"),
    companyRelationsService.ensureCompanyExists(payload.company),
    ensureUniqueValues(payload)
  ]);

  let vessel;

  try {
    vessel = await vesselsRepo.create(payload);
    await Promise.all([
      vesselDevicesService.syncVesselDevices(vessel._id, normalizedData),
      companyRelationsService.syncCompanyVesselRelation(vessel._id, payload.company ?? null)
    ]);
  } catch (error) {
    if (vessel?._id) {
      await Promise.allSettled([
        vesselDevicesService.deleteVesselDevices(vessel._id),
        companyRelationsService.deleteCompanyVesselRelations(vessel._id),
        vesselsRepo.deleteById(vessel._id)
      ]);
    }

    handleVesselWriteError(error);
  }

  return {
    vessel: await getVesselById(vessel._id)
  };
};

const getVesselDetail = async (vesselId) => {
  return {
    vessel: await getVesselById(vesselId)
  };
};

const updateVessel = async (vesselId, data) => {
  const currentVessel = await vesselsRepo.findById(vesselId);
  if (!currentVessel) throw new ApiError(StatusCodes.NOT_FOUND, "Vessel not found");

  const normalizedData = vesselDevicesService.normalizeDevicePayloadKeys(data);
  const update = buildUpdatePayload(normalizedData);
  const nextUniquePayload = {
    vesselCode: update.$set.vesselCode ?? currentVessel.vesselCode,
    amsaUvi: update.$unset.amsaUvi !== undefined ? null : (update.$set.amsaUvi ?? currentVessel.amsaUvi),
    imoNumber: update.$unset.imoNumber !== undefined ? null : (update.$set.imoNumber ?? currentVessel.imoNumber)
  };
  const nextCompany = data.company !== undefined
    ? (update.$set.company ?? null)
    : (currentVessel.company?.toString() ?? null);

  await Promise.all([
    ensureCrewMemberExists(update.$set.captain, "Captain"),
    ensureCrewMemberExists(update.$set.lineManager, "Line manager"),
    companyRelationsService.ensureCompanyExists(nextCompany),
    ensureUniqueValues(nextUniquePayload, vesselId)
  ]);

  const updateCommand = {};
  if (Object.keys(update.$set).length > 0) updateCommand.$set = update.$set;
  if (Object.keys(update.$unset).length > 0) updateCommand.$unset = update.$unset;

  try {
    if (Object.keys(updateCommand).length > 0) {
      await vesselsRepo.updateById(vesselId, updateCommand);
    }

    await companyRelationsService.syncCompanyVesselRelation(vesselId, nextCompany);
    await vesselDevicesService.syncVesselDevices(vesselId, normalizedData);
  } catch (error) {
    handleVesselWriteError(error);
  }

  return {
    vessel: await getVesselById(vesselId)
  };
};

const deleteVessel = async (vesselId) => {
  const vessel = await vesselsRepo.findById(vesselId);
  if (!vessel) throw new ApiError(StatusCodes.NOT_FOUND, "Vessel not found");

  await Promise.all([
    crewMembersRepo.pullAssignedVessel(vesselId),
    vesselCrewAssignmentsRepo.deleteByVesselId(vesselId),
    vesselDevicesService.deleteVesselDevices(vesselId),
    companyRelationsService.deleteCompanyVesselRelations(vesselId),
    vesselsRepo.deleteById(vesselId)
  ]);

  return { message: "Vessel deleted" };
};

export const vesselsService = {
  getVessels,
  createVessel,
  getVesselDetail,
  updateVessel,
  deleteVessel
};
