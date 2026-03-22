import "#/models/company-core/companies.model.js";
import "#/models/vessel-core/vessels.model.js";
import CompanyVesselAssignment from "#/models/company-core/companyVesselAssignment.model.js";

const findCurrentByVesselId = (vesselId) => {
  return CompanyVesselAssignment.findOne({ vessel: vesselId, isCurrent: true }).lean();
};

const findCurrentByCompanyId = (companyId) => {
  return CompanyVesselAssignment.find({ company: companyId, isCurrent: true })
    .populate({
      path: "vessel",
      select: "vesselCode name officialNumber imoNumber amsaUvi vesselType status"
    })
    .sort({ startDate: -1, createdAt: -1 })
    .lean();
};

const create = (data) => {
  return CompanyVesselAssignment.create(data);
};

const endCurrentByVesselId = (vesselId, endDate = new Date()) => {
  return CompanyVesselAssignment.updateMany(
    { vessel: vesselId, isCurrent: true },
    {
      $set: {
        isCurrent: false,
        endDate
      }
    }
  );
};

const deleteByVesselId = (vesselId) => {
  return CompanyVesselAssignment.deleteMany({ vessel: vesselId });
};

const deleteByCompanyId = (companyId) => {
  return CompanyVesselAssignment.deleteMany({ company: companyId });
};

export const companyVesselAssignmentsRepo = {
  findCurrentByVesselId,
  findCurrentByCompanyId,
  create,
  endCurrentByVesselId,
  deleteByVesselId,
  deleteByCompanyId
};
