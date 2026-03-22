import "#/models/company-core/companies.model.js";
import "#/models/vessel-core/crewMembers.model.js";
import CompanyCrewAssignment from "#/models/company-core/companyCrewAssignment.model.js";

const findCurrentByCrewMemberId = (crewMemberId) => {
  return CompanyCrewAssignment.findOne({ crewMember: crewMemberId, isCurrent: true }).lean();
};

const findCurrentByCompanyId = (companyId) => {
  return CompanyCrewAssignment.find({ company: companyId, isCurrent: true })
    .populate({
      path: "crewMember",
      select: "employeeCode fullName email phone role roles rank status"
    })
    .sort({ startDate: -1, createdAt: -1 })
    .lean();
};

const create = (data) => {
  return CompanyCrewAssignment.create(data);
};

const endCurrentByCrewMemberId = (crewMemberId, endDate = new Date()) => {
  return CompanyCrewAssignment.updateMany(
    { crewMember: crewMemberId, isCurrent: true },
    {
      $set: {
        isCurrent: false,
        endDate
      }
    }
  );
};

const deleteByCrewMemberId = (crewMemberId) => {
  return CompanyCrewAssignment.deleteMany({ crewMember: crewMemberId });
};

const deleteByCompanyId = (companyId) => {
  return CompanyCrewAssignment.deleteMany({ company: companyId });
};

export const companyCrewAssignmentsRepo = {
  findCurrentByCrewMemberId,
  findCurrentByCompanyId,
  create,
  endCurrentByCrewMemberId,
  deleteByCrewMemberId,
  deleteByCompanyId
};
