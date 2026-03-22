import { isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";

import {
  VESSEL_DEVICE_ALIAS_TO_KEY,
  VESSEL_DEVICE_CONFIGS
} from "#/constants/vesselDevices.constants.js";
import { vesselDevicesRepo } from "#/repositories/vesselDevices.repo.js";

import ApiError from "#/errors/ApiError.js";

const getKnownFields = (config) => ([
  ...(config.stringFields || []),
  ...(config.numberFields || []),
  ...(config.booleanFields || []),
  ...(config.objectIdFields || []),
  ...(config.dateFields || []),
  ...Object.keys(config.enumFields || {})
]);

const hasMeaningfulValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
};

const normalizeOptionalString = (value, { lowercase = false } = {}) => {
  if (value === undefined || value === null) return null;

  const normalizedValue = typeof value === "string" ? value.trim() : value;
  if (normalizedValue === "") return null;

  return lowercase && typeof normalizedValue === "string"
    ? normalizedValue.toLowerCase()
    : normalizedValue;
};

const normalizeOptionalNumber = (value, fieldPath, fieldName, config) => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `Invalid ${fieldPath}`);
  }

  const isIntegerField = (config.integerFields || []).includes(fieldName);
  if (isIntegerField && !Number.isInteger(value)) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `${fieldPath} must be an integer`);
  }

  const minValue = config.minFields?.[fieldName];
  if (minValue !== undefined && value < minValue) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      `${fieldPath} must be greater than or equal to ${minValue}`
    );
  }

  const maxValue = config.maxFields?.[fieldName];
  if (maxValue !== undefined && value > maxValue) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      `${fieldPath} must be less than or equal to ${maxValue}`
    );
  }

  return value;
};

const normalizeOptionalBoolean = (value, fieldName) => {
  if (value === undefined || value === null) return null;
  if (typeof value !== "boolean") {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `Invalid ${fieldName}`);
  }

  return value;
};

const normalizeOptionalObjectId = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return null;
  if (!isValidObjectId(value)) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `Invalid ${fieldName}`);
  }

  return value;
};

const parseOptionalDate = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return null;

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `Invalid ${fieldName}`);
  }

  return parsedDate;
};

const normalizeOptionalEnum = (value, fieldName, allowedValues) => {
  if (value === undefined || value === null || value === "") return null;
  if (!allowedValues.includes(value)) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `Invalid ${fieldName}`);
  }

  return value;
};

const ensureRequiredFields = (config, rawDevice, itemPrefix) => {
  const requiredFields = [
    ...(config.requiredStringFields || []),
    ...(config.requiredEnumFields || []),
    ...(config.requiredNumberFields || [])
  ];

  requiredFields.forEach((fieldName) => {
    if (!hasMeaningfulValue(rawDevice[fieldName])) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `${itemPrefix}.${fieldName} is required`
      );
    }
  });
};

const normalizeDeviceSnapshot = (config, rawDevice, itemPrefix) => {
  ensureRequiredFields(config, rawDevice, itemPrefix);

  const normalizedDevice = {
    id: normalizeOptionalObjectId(rawDevice.id, `${itemPrefix}.id`)
  };

  getKnownFields(config).forEach((fieldName) => {
    if ((config.stringFields || []).includes(fieldName)) {
      normalizedDevice[fieldName] = normalizeOptionalString(rawDevice[fieldName], {
        lowercase: (config.lowercaseFields || []).includes(fieldName)
      });
      return;
    }

    if ((config.numberFields || []).includes(fieldName)) {
      normalizedDevice[fieldName] = normalizeOptionalNumber(
        rawDevice[fieldName],
        `${itemPrefix}.${fieldName}`,
        fieldName,
        config
      );
      return;
    }

    if ((config.booleanFields || []).includes(fieldName)) {
      normalizedDevice[fieldName] = normalizeOptionalBoolean(rawDevice[fieldName], `${itemPrefix}.${fieldName}`);
      return;
    }

    if ((config.objectIdFields || []).includes(fieldName)) {
      normalizedDevice[fieldName] = normalizeOptionalObjectId(rawDevice[fieldName], `${itemPrefix}.${fieldName}`);
      return;
    }

    if ((config.dateFields || []).includes(fieldName)) {
      normalizedDevice[fieldName] = parseOptionalDate(rawDevice[fieldName], `${itemPrefix}.${fieldName}`);
      return;
    }

    if (config.enumFields?.[fieldName]) {
      normalizedDevice[fieldName] = normalizeOptionalEnum(
        rawDevice[fieldName],
        `${itemPrefix}.${fieldName}`,
        config.enumFields[fieldName]
      );
    }
  });

  return normalizedDevice;
};

const buildCreatePayload = (config, vesselId, normalizedDevice) => {
  const payload = { vessel: vesselId };

  getKnownFields(config).forEach((fieldName) => {
    const fieldValue = normalizedDevice[fieldName];
    if (fieldValue !== null && fieldValue !== undefined) {
      payload[fieldName] = fieldValue;
    }
  });

  return payload;
};

const buildUpdateCommand = (config, normalizedDevice) => {
  const setPayload = {};
  const unsetPayload = {};

  getKnownFields(config).forEach((fieldName) => {
    const fieldValue = normalizedDevice[fieldName];

    if (fieldValue === null || fieldValue === undefined) {
      unsetPayload[fieldName] = "";
    } else {
      setPayload[fieldName] = fieldValue;
    }
  });

  return {
    $set: setPayload,
    $unset: unsetPayload
  };
};

const toDeviceResponse = (config, device) => {
  const response = {
    id: device._id
  };

  getKnownFields(config).forEach((fieldName) => {
    response[fieldName] = device[fieldName] ?? null;
  });

  response.createdAt = device.createdAt;
  response.updatedAt = device.updatedAt;

  return response;
};

const normalizeDevicePayloadKeys = (data = {}) => {
  const normalizedData = { ...data };

  Object.entries(VESSEL_DEVICE_ALIAS_TO_KEY).forEach(([inputKey, canonicalKey]) => {
    if (normalizedData[inputKey] !== undefined && normalizedData[canonicalKey] === undefined) {
      normalizedData[canonicalKey] = normalizedData[inputKey];
    }
  });

  return normalizedData;
};

const ensureReferencesBelongToVessel = async (config, vesselId, normalizedDevices) => {
  if (!config.references) return;

  await Promise.all(
    Object.entries(config.references).map(async ([fieldName, referenceConfig]) => {
      const referencedIds = [
        ...new Set(
          normalizedDevices
            .map((device) => device[fieldName])
            .filter(Boolean)
        )
      ];

      if (referencedIds.length === 0) return;

      const relatedDevices = await vesselDevicesRepo.findManyByVessel(referenceConfig.deviceKey, vesselId);
      const relatedIds = new Set(relatedDevices.map((device) => device._id.toString()));
      const invalidReference = referencedIds.find((deviceId) => !relatedIds.has(deviceId));

      if (invalidReference) {
        throw new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `${config.key}.${fieldName} must reference a ${referenceConfig.label} on the same vessel`
        );
      }
    })
  );
};

const cleanupRemovedMainEngineReferences = async (vesselId, removedMainEngineIds) => {
  if (!removedMainEngineIds || removedMainEngineIds.length === 0) return;

  await Promise.all([
    vesselDevicesRepo.updateMany(
      "propulsions",
      {
        vessel: vesselId,
        drivenByEngine: { $in: removedMainEngineIds }
      },
      {
        $unset: { drivenByEngine: "" }
      }
    ),
    vesselDevicesRepo.updateMany(
      "gearboxes",
      {
        vessel: vesselId,
        mainEngine: { $in: removedMainEngineIds }
      },
      {
        $unset: { mainEngine: "" }
      }
    )
  ]);
};

const syncDeviceType = async (vesselId, config, rawDevices) => {
  if (rawDevices === undefined) return;

  const existingDevices = await vesselDevicesRepo.findManyByVessel(config.key, vesselId);
  const existingDeviceMap = new Map(
    existingDevices.map((device) => [device._id.toString(), device])
  );

  const normalizedDevices = rawDevices.map((rawDevice, index) => normalizeDeviceSnapshot(
    config,
    rawDevice,
    `${config.key}[${index}]`
  ));

  const seenIds = new Set();
  normalizedDevices.forEach((device, index) => {
    if (!device.id) return;
    if (seenIds.has(device.id)) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `${config.key}[${index}].id is duplicated`
      );
    }

    seenIds.add(device.id);
  });

  await ensureReferencesBelongToVessel(config, vesselId, normalizedDevices);

  const retainedIds = [];

  for (const normalizedDevice of normalizedDevices) {
    if (normalizedDevice.id) {
      const currentDevice = existingDeviceMap.get(normalizedDevice.id);

      if (!currentDevice) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `${config.label} not found`
        );
      }

      const updateCommand = buildUpdateCommand(config, normalizedDevice);
      await vesselDevicesRepo.updateById(config.key, normalizedDevice.id, updateCommand);
      retainedIds.push(normalizedDevice.id);
      continue;
    }

    const createdDevice = await vesselDevicesRepo.create(
      config.key,
      buildCreatePayload(config, vesselId, normalizedDevice)
    );
    retainedIds.push(createdDevice._id.toString());
  }

  const removedIds = existingDevices
    .map((device) => device._id.toString())
    .filter((deviceId) => !retainedIds.includes(deviceId));

  await vesselDevicesRepo.deleteByIds(config.key, removedIds);

  if (config.key === "mainEngines") {
    await cleanupRemovedMainEngineReferences(vesselId, removedIds);
  }
};

const getVesselDevices = async (vesselId) => {
  const deviceEntries = await Promise.all(
    VESSEL_DEVICE_CONFIGS.map(async (config) => {
      const devices = await vesselDevicesRepo.findManyByVessel(config.key, vesselId);
      return [config.key, devices.map((device) => toDeviceResponse(config, device))];
    })
  );

  return Object.fromEntries(deviceEntries);
};

const syncVesselDevices = async (vesselId, data) => {
  const normalizedData = normalizeDevicePayloadKeys(data);

  for (const config of VESSEL_DEVICE_CONFIGS) {
    await syncDeviceType(vesselId, config, normalizedData[config.key]);
  }
};

const deleteVesselDevices = async (vesselId) => {
  await vesselDevicesRepo.deleteAllByVesselId(vesselId);
};

export const vesselDevicesService = {
  getVesselDevices,
  syncVesselDevices,
  deleteVesselDevices,
  normalizeDevicePayloadKeys
};
