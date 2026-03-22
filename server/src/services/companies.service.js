import { StatusCodes } from "http-status-codes";

import { companiesRepo } from "#/repositories/companies.repo.js";
import { vesselsRepo } from "#/repositories/vessels.repo.js";
import { crewMembersRepo } from "#/repositories/crewMembers.repo.js";
import { companyVesselAssignmentsRepo } from "#/repositories/companyVesselAssignments.repo.js";
import { companyCrewAssignmentsRepo } from "#/repositories/companyCrewAssignments.repo.js";

import ApiError from "#/errors/ApiError.js";

const normalizeRequiredString = (value, fieldName) => {
  const normalizedValue = typeof value === "string" ? value.trim() : value;

  if (!normalizedValue) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `${fieldName} is required`);
  }

  return normalizedValue;
};

const normalizeOptionalString = (value, { lowercase = false } = {}) => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const normalizedValue = typeof value === "string" ? value.trim() : value;
  if (normalizedValue === "") return null;

  return lowercase && typeof normalizedValue === "string"
    ? normalizedValue.toLowerCase()
    : normalizedValue;
};

const buildCreatePayload = (data) => {
  const payload = {
    companyCode: normalizeRequiredString(data.companyCode, "companyCode").toUpperCase(),
    name: normalizeRequiredString(data.name, "name"),
    email: normalizeOptionalString(data.email, { lowercase: true }),
    phone: normalizeOptionalString(data.phone),
    address: normalizeOptionalString(data.address),
    status: data.status,
    notes: data.notes
  };

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

  if (data.companyCode !== undefined) {
    setPayload.companyCode = normalizeRequiredString(data.companyCode, "companyCode").toUpperCase();
  }

  if (data.name !== undefined) {
    setPayload.name = normalizeRequiredString(data.name, "name");
  }

  if (data.email !== undefined) {
    const normalizedEmail = normalizeOptionalString(data.email, { lowercase: true });
    if (normalizedEmail === null) {
      unsetPayload.email = "";
    } else {
      setPayload.email = normalizedEmail;
    }
  }

  if (data.phone !== undefined) {
    const normalizedPhone = normalizeOptionalString(data.phone);
    if (normalizedPhone === null) {
      unsetPayload.phone = "";
    } else {
      setPayload.phone = normalizedPhone;
    }
  }

  if (data.address !== undefined) {
    const normalizedAddress = normalizeOptionalString(data.address);
    if (normalizedAddress === null) {
      unsetPayload.address = "";
    } else {
      setPayload.address = normalizedAddress;
    }
  }

  if (data.status !== undefined) setPayload.status = data.status;
  if (data.notes !== undefined) setPayload.notes = data.notes;

  return {
    $set: setPayload,
    $unset: unsetPayload
  };
};

const ensureCompanyCodeUnique = async (companyCode, currentCompanyId = null) => {
  if (!companyCode) return;

  const existedCompany = await companiesRepo.findByCompanyCode(companyCode);
  if (existedCompany && existedCompany._id.toString() !== currentCompanyId) {
    throw new ApiError(StatusCodes.CONFLICT, "Company code already exists");
  }
};

const handleCompanyWriteError = (error) => {
  if (error?.code === 11000) {
    if (error?.keyPattern?.companyCode) {
      throw new ApiError(StatusCodes.CONFLICT, "Company code already exists");
    }

    throw new ApiError(StatusCodes.CONFLICT, "Company already exists");
  }

  throw error;
};

const toVesselSummary = (assignment) => ({
  id: assignment.vessel?._id,
  vesselCode: assignment.vessel?.vesselCode,
  name: assignment.vessel?.name,
  officialNumber: assignment.vessel?.officialNumber,
  imoNumber: assignment.vessel?.imoNumber,
  amsaUvi: assignment.vessel?.amsaUvi,
  vesselType: assignment.vessel?.vesselType,
  status: assignment.vessel?.status,
  startDate: assignment.startDate,
  endDate: assignment.endDate,
  isCurrent: assignment.isCurrent
});

const toCrewSummary = (assignment) => ({
  id: assignment.crewMember?._id,
  employeeCode: assignment.crewMember?.employeeCode,
  fullName: assignment.crewMember?.fullName,
  email: assignment.crewMember?.email,
  phone: assignment.crewMember?.phone,
  role: assignment.crewMember?.role ?? assignment.crewMember?.roles?.[0] ?? null,
  rank: assignment.crewMember?.rank,
  status: assignment.crewMember?.status,
  startDate: assignment.startDate,
  endDate: assignment.endDate,
  isCurrent: assignment.isCurrent
});

const toCompanyResponse = (company, vesselAssignments, crewAssignments) => ({
  id: company._id,
  companyCode: company.companyCode,
  name: company.name,
  email: company.email,
  phone: company.phone,
  address: company.address,
  status: company.status,
  notes: company.notes,
  linkedVessels: vesselAssignments.map(toVesselSummary),
  linkedCrewMembers: crewAssignments.map(toCrewSummary),
  createdAt: company.createdAt,
  updatedAt: company.updatedAt
});

const toCompanyListItem = (company) => ({
  id: company._id,
  companyCode: company.companyCode,
  name: company.name,
  email: company.email,
  phone: company.phone,
  status: company.status,
  createdAt: company.createdAt,
  updatedAt: company.updatedAt
});

const getCompanyById = async (companyId) => {
  const company = await companiesRepo.findById(companyId);
  if (!company) throw new ApiError(StatusCodes.NOT_FOUND, "Company not found");

  const [vesselAssignments, crewAssignments] = await Promise.all([
    companyVesselAssignmentsRepo.findCurrentByCompanyId(companyId),
    companyCrewAssignmentsRepo.findCurrentByCompanyId(companyId)
  ]);

  return toCompanyResponse(company, vesselAssignments, crewAssignments);
};

const getCompanies = async (data) => {
  const page = Math.max(Number(data.page) || 1, 1);
  const limit = Math.min(Math.max(Number(data.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [companies, totalCompanies] = await Promise.all([
    companiesRepo.findMany(limit, skip),
    companiesRepo.countAll()
  ]);

  const totalPages = Math.ceil(totalCompanies / limit);

  return {
    companies: companies.map(toCompanyListItem),
    pagination: {
      page,
      limit,
      skip,
      totalCompanies,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    }
  };
};

const createCompany = async (data) => {
  const payload = buildCreatePayload(data);

  await ensureCompanyCodeUnique(payload.companyCode);

  let company;

  try {
    company = await companiesRepo.create(payload);
  } catch (error) {
    handleCompanyWriteError(error);
  }

  return {
    company: await getCompanyById(company._id)
  };
};

const getCompanyDetail = async (companyId) => {
  return {
    company: await getCompanyById(companyId)
  };
};

const updateCompany = async (companyId, data) => {
  const currentCompany = await companiesRepo.findById(companyId);
  if (!currentCompany) throw new ApiError(StatusCodes.NOT_FOUND, "Company not found");

  const update = buildUpdatePayload(data);
  const nextCompanyCode = update.$set.companyCode ?? currentCompany.companyCode;

  await ensureCompanyCodeUnique(nextCompanyCode, companyId);

  const updateCommand = {};
  if (Object.keys(update.$set).length > 0) updateCommand.$set = update.$set;
  if (Object.keys(update.$unset).length > 0) updateCommand.$unset = update.$unset;

  try {
    if (Object.keys(updateCommand).length > 0) {
      await companiesRepo.updateById(companyId, updateCommand);
    }
  } catch (error) {
    handleCompanyWriteError(error);
  }

  return {
    company: await getCompanyById(companyId)
  };
};

const deleteCompany = async (companyId) => {
  const company = await companiesRepo.findById(companyId);
  if (!company) throw new ApiError(StatusCodes.NOT_FOUND, "Company not found");

  await Promise.all([
    vesselsRepo.unsetCompanyByCompanyId(companyId),
    crewMembersRepo.unsetCompanyByCompanyId(companyId),
    companyVesselAssignmentsRepo.deleteByCompanyId(companyId),
    companyCrewAssignmentsRepo.deleteByCompanyId(companyId),
    companiesRepo.deleteById(companyId)
  ]);

  return { message: "Company deleted" };
};

export const companiesService = {
  getCompanies,
  createCompany,
  getCompanyDetail,
  updateCompany,
  deleteCompany
};
