import {
  VESSEL_DEVICE_CONFIG_BY_KEY,
  VESSEL_DEVICE_KEYS
} from "#/constants/vesselDevices.constants.js";

const getModel = (deviceKey) => {
  const model = VESSEL_DEVICE_CONFIG_BY_KEY[deviceKey]?.model;

  if (!model) {
    throw new Error(`Unknown vessel device key: ${deviceKey}`);
  }

  return model;
};

const findManyByVessel = (deviceKey, vesselId) => {
  return getModel(deviceKey)
    .find({ vessel: vesselId })
    .sort({ createdAt: 1, _id: 1 })
    .lean();
};

const create = (deviceKey, data) => {
  return getModel(deviceKey).create(data);
};

const updateById = (deviceKey, id, update) => {
  return getModel(deviceKey).findOneAndUpdate(
    { _id: id },
    update,
    {
      returnDocument: "after",
      runValidators: true,
      lean: true
    }
  );
};

const deleteByIds = (deviceKey, ids) => {
  if (!ids || ids.length === 0) {
    return Promise.resolve({ acknowledged: true, deletedCount: 0 });
  }

  return getModel(deviceKey).deleteMany({ _id: { $in: ids } });
};

const deleteByVesselId = (deviceKey, vesselId) => {
  return getModel(deviceKey).deleteMany({ vessel: vesselId });
};

const updateMany = (deviceKey, filter, update) => {
  return getModel(deviceKey).updateMany(filter, update);
};

const deleteAllByVesselId = (vesselId) => {
  return Promise.all(
    VESSEL_DEVICE_KEYS.map((deviceKey) => deleteByVesselId(deviceKey, vesselId))
  );
};

export const vesselDevicesRepo = {
  findManyByVessel,
  create,
  updateById,
  deleteByIds,
  deleteByVesselId,
  updateMany,
  deleteAllByVesselId
};
