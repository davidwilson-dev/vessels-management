import "#/models/vessel-core/crewMembers.model.js";
import "#/models/company-core/companies.model.js";
import Vessel from "#/models/vessel-core/vessels.model.js";

const companyPopulate = {
  path: "company",
  select: "companyCode name status"
};

const detailPopulate = [
  {
    path: "captain",
    select: "employeeCode fullName email phone role roles rank status"
  },
  {
    path: "lineManager",
    select: "employeeCode fullName email phone role roles rank status"
  },
  companyPopulate
];

const findById = (id) => {
  return Vessel.findById(id).lean();
};

const findMany = (limit, skip) => {
  return Vessel.find()
    .select("_id vesselCode name amsaUvi vesselType status updatedAt company")
    .populate(companyPopulate)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const countAll = () => {
  return Vessel.countDocuments();
};

const findDetailById = (id) => {
  return Vessel.findById(id)
    .populate(detailPopulate)
    .lean();
};

const findByIds = (ids) => {
  return Vessel.find({ _id: { $in: ids } })
    .select("_id")
    .lean();
};

const findByIdsWithCompany = (ids) => {
  return Vessel.find({ _id: { $in: ids } })
    .select("_id company")
    .lean();
};

const findByAmsaUvi = (amsaUvi) => {
  return Vessel.findOne({ amsaUvi }).lean();
};

const findByImoNumber = (imoNumber) => {
  return Vessel.findOne({ imoNumber }).lean();
};

const findByVesselCode = (vesselCode) => {
  return Vessel.findOne({ vesselCode }).lean();
};

const create = (data) => {
  return Vessel.create(data);
};

const updateById = (id, update) => {
  return Vessel.findOneAndUpdate(
    { _id: id },
    update,
    {
      returnDocument: "after",
      runValidators: true,
      lean: true
    }
  );
};

const deleteById = (id) => {
  return Vessel.deleteOne({ _id: id });
};

const unsetCaptainByCrewMemberId = (crewMemberId) => {
  return Vessel.updateMany(
    { captain: crewMemberId },
    { $unset: { captain: "" } }
  );
};

const unsetLineManagerByCrewMemberId = (crewMemberId) => {
  return Vessel.updateMany(
    { lineManager: crewMemberId },
    { $unset: { lineManager: "" } }
  );
};

const setCaptainByIds = (ids, crewMemberId) => {
  if (!ids?.length) return Promise.resolve({ matchedCount: 0, modifiedCount: 0 });

  return Vessel.updateMany(
    { _id: { $in: ids } },
    { $set: { captain: crewMemberId } }
  );
};

const setLineManagerByIds = (ids, crewMemberId) => {
  if (!ids?.length) return Promise.resolve({ matchedCount: 0, modifiedCount: 0 });

  return Vessel.updateMany(
    { _id: { $in: ids } },
    { $set: { lineManager: crewMemberId } }
  );
};

const unsetCompanyByCompanyId = (companyId) => {
  return Vessel.updateMany(
    { company: companyId },
    { $unset: { company: "" } }
  );
};

export const vesselsRepo = {
  findById,
  findMany,
  countAll,
  findDetailById,
  findByIds,
  findByIdsWithCompany,
  findByAmsaUvi,
  findByImoNumber,
  findByVesselCode,
  create,
  updateById,
  deleteById,
  unsetCaptainByCrewMemberId,
  unsetLineManagerByCrewMemberId,
  setCaptainByIds,
  setLineManagerByIds,
  unsetCompanyByCompanyId
};
