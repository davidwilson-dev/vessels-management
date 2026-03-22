import "#/models/vessel-core/vessels.model.js";
import CrewMember from "#/models/vessel-core/crewMembers.model.js";

const detailPopulate = [
  {
    path: "assignedVessels",
    select: "vesselCode name officialNumber imoNumber amsaUvi vesselType status"
  }
];

const findById = (id) => {
  return CrewMember.findById(id).lean();
};

const findMany = (limit, skip) => {
  return CrewMember.find()
    .populate(detailPopulate)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const countAll = () => {
  return CrewMember.countDocuments();
};

const findDetailById = (id) => {
  return CrewMember.findById(id)
    .populate(detailPopulate)
    .lean();
};

const findByIds = (ids) => {
  return CrewMember.find({ _id: { $in: ids } })
    .select("_id")
    .lean();
};

const findByEmail = (email) => {
  return CrewMember.findOne({ email }).lean();
};

const create = (data) => {
  return CrewMember.create(data);
};

const updateById = (id, update) => {
  return CrewMember.findOneAndUpdate(
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
  return CrewMember.deleteOne({ _id: id });
};

const pullAssignedVessel = (vesselId) => {
  return CrewMember.updateMany(
    { assignedVessels: vesselId },
    { $pull: { assignedVessels: vesselId } }
  );
};

const unsetCompanyByCompanyId = (companyId) => {
  return CrewMember.updateMany(
    { company: companyId },
    { $unset: { company: "" } }
  );
};

export const crewMembersRepo = {
  findById,
  findMany,
  countAll,
  findDetailById,
  findByIds,
  findByEmail,
  create,
  updateById,
  deleteById,
  pullAssignedVessel,
  unsetCompanyByCompanyId
};
