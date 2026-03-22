import "#/models/vessel-core/vessels.model.js";
import "#/models/vessel-core/crewMembers.model.js";
import VesselCrewAssignment from "#/models/vessel-core/vesselCrewAssignment.model.js";

const leadershipPopulate = {
  path: "crewMember",
  select: "employeeCode fullName email phone role roles rank status"
};

const findCurrentByCrewMemberId = (crewMemberId) => {
  return VesselCrewAssignment.find({ crewMember: crewMemberId, isCurrent: true }).lean();
};

const findCurrentLeadershipByVesselIds = (vesselIds) => {
  if (!vesselIds?.length) return Promise.resolve([]);

  return VesselCrewAssignment.find({
    vessel: { $in: vesselIds },
    isCurrent: true,
    role: { $in: ["captain", "line_manager"] }
  })
    .populate(leadershipPopulate)
    .sort({ startDate: -1, createdAt: -1 })
    .lean();
};

const findByVesselId = (vesselId) => {
  return VesselCrewAssignment.find({ vessel: vesselId })
    .populate(leadershipPopulate)
    .sort({ isCurrent: -1, startDate: -1, createdAt: -1 })
    .lean();
};

const findByCrewMemberId = (crewMemberId) => {
  return VesselCrewAssignment.find({ crewMember: crewMemberId })
    .populate({
      path: "vessel",
      select: "vesselCode name officialNumber imoNumber amsaUvi vesselType status"
    })
    .sort({ isCurrent: -1, startDate: -1, createdAt: -1 })
    .lean();
};

const create = (data) => {
  return VesselCrewAssignment.create(data);
};

const endCurrentByIds = (ids, endDate = new Date()) => {
  if (!ids?.length) return Promise.resolve({ matchedCount: 0, modifiedCount: 0 });

  return VesselCrewAssignment.updateMany(
    { _id: { $in: ids }, isCurrent: true },
    {
      $set: {
        isCurrent: false,
        endDate
      }
    }
  );
};

const deleteByVesselId = (vesselId) => {
  return VesselCrewAssignment.deleteMany({ vessel: vesselId });
};

const deleteByCrewMemberId = (crewMemberId) => {
  return VesselCrewAssignment.deleteMany({ crewMember: crewMemberId });
};

export const vesselCrewAssignmentsRepo = {
  findCurrentByCrewMemberId,
  findCurrentLeadershipByVesselIds,
  findByVesselId,
  findByCrewMemberId,
  create,
  endCurrentByIds,
  deleteByVesselId,
  deleteByCrewMemberId
};
