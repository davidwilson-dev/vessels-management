import MainEngine from "#/models/machinery-propulsion/mainEngines.model.js";
import Propulsion from "#/models/machinery-propulsion/propulsions.model.js";
import Generator from "#/models/machinery-propulsion/generators.model.js";
import Gearbox from "#/models/machinery-propulsion/gearboxes.model.js";
import AuxiliaryEngine from "#/models/machinery-propulsion/auxiliaryEngines.model.js";
import Compass from "#/models/navigation-communication/compasses.model.js";
import Radio from "#/models/navigation-communication/radios.model.js";
import BreathingApparatus from "#/models/safety-lifesaving/breathings.model.js";
import EPIRB from "#/models/safety-lifesaving/epirps.model.js";
import FireEquipment from "#/models/safety-lifesaving/fireEquipments.model.js";
import FirstAidKit from "#/models/safety-lifesaving/firstAidKits.model.js";
import LifeBuoy from "#/models/safety-lifesaving/lifeBuoys.model.js";
import LifeJacket from "#/models/safety-lifesaving/lifeJackets.model.js";
import Liferaft from "#/models/safety-lifesaving/liferafts.model.js";
import LineThrowing from "#/models/safety-lifesaving/lineThrowings.model.js";
import Pyrotechnic from "#/models/safety-lifesaving/pyrotechnics.model.js";

import {
  COMPASS_TYPES,
  EQUIPMENT_STATUS,
  FIRE_EQUIPMENT_TYPES,
  FUEL_TYPES,
  LIFE_JACKET_TYPES,
  LIFERAFT_LAUNCH_TYPES,
  LIFERAFT_PACK_TYPES,
  PROPULSION_TYPES,
  PYROTECHNIC_TYPES,
  RADIO_TYPES
} from "#/constants/enums.constants.js";

const currentYear = new Date().getFullYear();

export const VESSEL_DEVICE_CONFIGS = [
  {
    key: "mainEngines",
    aliases: ["mainEngine"],
    label: "main engine",
    model: MainEngine,
    stringFields: ["maker", "model", "serialNumber", "engineNumber", "notes"],
    lowercaseFields: ["maker"],
    numberFields: ["powerKw", "rpm", "cylinders", "manufacturerYear", "runningHours"],
    integerFields: ["cylinders", "manufacturerYear"],
    minFields: {
      runningHours: 0
    },
    maxFields: {
      manufacturerYear: currentYear
    },
    dateFields: ["installationDate", "lastServiceDate", "nextServiceDate"],
    enumFields: {
      fuelType: FUEL_TYPES,
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "propulsions",
    aliases: ["propulsion"],
    label: "propulsion",
    model: Propulsion,
    requiredEnumFields: ["type"],
    stringFields: ["maker", "model", "serialNumber", "material", "notes"],
    lowercaseFields: ["maker", "material"],
    numberFields: ["blades", "diameterMm"],
    integerFields: ["blades"],
    dateFields: ["installationDate", "lastInspectionDate", "nextInspectionDate"],
    objectIdFields: ["drivenByEngine"],
    enumFields: {
      type: PROPULSION_TYPES,
      status: EQUIPMENT_STATUS
    },
    references: {
      drivenByEngine: {
        deviceKey: "mainEngines",
        label: "drivenByEngine"
      }
    }
  },
  {
    key: "generators",
    aliases: ["generator"],
    label: "generator",
    model: Generator,
    stringFields: ["maker", "model", "serialNumber", "notes"],
    lowercaseFields: ["maker"],
    numberFields: ["ratedPowerKva", "voltage", "frequencyHz", "runningHours"],
    minFields: {
      runningHours: 0
    },
    dateFields: ["installationDate", "lastServiceDate", "nextServiceDate"],
    enumFields: {
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "gearboxes",
    aliases: ["gearbox"],
    label: "gearbox",
    model: Gearbox,
    stringFields: ["maker", "model", "serialNumber", "ratio", "oilType", "notes"],
    lowercaseFields: ["maker"],
    dateFields: ["installationDate", "lastServiceDate", "nextServiceDate"],
    objectIdFields: ["mainEngine"],
    enumFields: {
      status: EQUIPMENT_STATUS
    },
    references: {
      mainEngine: {
        deviceKey: "mainEngines",
        label: "mainEngine"
      }
    }
  },
  {
    key: "auxiliaryEngines",
    aliases: ["auxiliaryEngine"],
    label: "auxiliary engine",
    model: AuxiliaryEngine,
    stringFields: ["maker", "model", "serialNumber", "notes"],
    lowercaseFields: ["maker"],
    numberFields: ["powerKw", "runningHours"],
    minFields: {
      runningHours: 0
    },
    dateFields: ["installationDate", "lastServiceDate", "nextServiceDate"],
    enumFields: {
      fuelType: FUEL_TYPES,
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "compasses",
    aliases: ["compass"],
    label: "compass",
    model: Compass,
    requiredEnumFields: ["type"],
    stringFields: ["maker", "model", "serialNumber", "locationOnBoard", "notes"],
    lowercaseFields: ["maker", "locationOnBoard"],
    dateFields: ["lastCalibrationDate", "nextCalibrationDate"],
    enumFields: {
      type: COMPASS_TYPES,
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "radios",
    aliases: ["radio"],
    label: "radio",
    model: Radio,
    requiredEnumFields: ["type"],
    stringFields: ["maker", "model", "serialNumber", "callSign", "mmsi", "notes"],
    lowercaseFields: ["maker"],
    dateFields: ["installationDate", "lastInspectionDate", "nextInspectionDate"],
    enumFields: {
      type: RADIO_TYPES,
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "breathingApparatuses",
    aliases: ["breathing", "breathings", "breathingApparatus"],
    label: "breathing apparatus",
    model: BreathingApparatus,
    stringFields: ["maker", "model", "serialNumber", "locationOnBoard", "notes"],
    lowercaseFields: ["maker", "locationOnBoard"],
    numberFields: ["cylinderCapacityLitres", "workingPressureBar"],
    dateFields: ["lastInspectionDate", "nextInspectionDate", "expiryDate"],
    enumFields: {
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "epirbs",
    aliases: ["epirp", "epirb", "epirps"],
    label: "EPIRB",
    model: EPIRB,
    stringFields: ["maker", "model", "serialNumber", "hexId", "locationOnBoard", "notes"],
    lowercaseFields: ["maker", "locationOnBoard"],
    dateFields: [
      "batteryExpiryDate",
      "hydrostaticReleaseExpiryDate",
      "lastTestDate",
      "nextTestDate",
      "registrationExpiryDate"
    ],
    enumFields: {
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "fireEquipments",
    aliases: ["fireEquipment"],
    label: "fire equipment",
    model: FireEquipment,
    requiredEnumFields: ["type"],
    stringFields: [
      "maker",
      "model",
      "serialNumber",
      "locationOnBoard",
      "extinguishingAgent",
      "capacity",
      "notes"
    ],
    lowercaseFields: ["maker", "locationOnBoard", "extinguishingAgent"],
    numberFields: ["quantity"],
    integerFields: ["quantity"],
    minFields: {
      quantity: 1
    },
    dateFields: [
      "lastInspectionDate",
      "nextInspectionDate",
      "lastServiceDate",
      "nextServiceDate",
      "expiryDate"
    ],
    enumFields: {
      type: FIRE_EQUIPMENT_TYPES,
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "firstAidKits",
    aliases: ["firstAidKit", "fisrtAirKit", "firstAirKit"],
    label: "first aid kit",
    model: FirstAidKit,
    stringFields: ["code", "locationOnBoard", "notes"],
    lowercaseFields: ["locationOnBoard"],
    numberFields: ["quantity"],
    integerFields: ["quantity"],
    minFields: {
      quantity: 1
    },
    dateFields: ["lastInspectionDate", "nextInspectionDate", "expiryDate"],
    enumFields: {
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "lifeBuoys",
    aliases: ["lifeBuoy"],
    label: "life buoy",
    model: LifeBuoy,
    stringFields: ["code", "locationOnBoard", "notes"],
    lowercaseFields: ["locationOnBoard"],
    numberFields: ["quantity"],
    integerFields: ["quantity"],
    booleanFields: ["hasLight", "hasSmokeSignal"],
    minFields: {
      quantity: 1
    },
    dateFields: ["lastInspectionDate", "nextInspectionDate"],
    enumFields: {
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "lifeJackets",
    aliases: ["lifeJacket"],
    label: "life jacket",
    model: LifeJacket,
    requiredNumberFields: ["quantity"],
    stringFields: ["locationOnBoard", "maker", "model", "notes"],
    lowercaseFields: ["locationOnBoard", "maker"],
    numberFields: ["quantity"],
    integerFields: ["quantity"],
    minFields: {
      quantity: 1
    },
    dateFields: ["lastInspectionDate", "nextInspectionDate", "expiryDate"],
    enumFields: {
      type: LIFE_JACKET_TYPES,
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "liferafts",
    aliases: ["liferaft"],
    label: "liferaft",
    model: Liferaft,
    requiredNumberFields: ["capacity"],
    stringFields: ["maker", "model", "serialNumber", "locationOnBoard", "notes"],
    lowercaseFields: ["maker", "locationOnBoard"],
    numberFields: ["capacity"],
    integerFields: ["capacity"],
    minFields: {
      capacity: 1
    },
    dateFields: ["manufactureDate", "lastServiceDate", "nextServiceDate", "expiryDate"],
    enumFields: {
      packType: LIFERAFT_PACK_TYPES,
      launchType: LIFERAFT_LAUNCH_TYPES,
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "lineThrowings",
    aliases: ["lineThrowing"],
    label: "line throwing appliance",
    model: LineThrowing,
    stringFields: ["maker", "model", "serialNumber", "storageLocation", "notes"],
    lowercaseFields: ["maker", "storageLocation"],
    numberFields: ["quantity"],
    integerFields: ["quantity"],
    minFields: {
      quantity: 1
    },
    dateFields: ["expiryDate", "lastInspectionDate", "nextInspectionDate"],
    enumFields: {
      status: EQUIPMENT_STATUS
    }
  },
  {
    key: "pyrotechnics",
    aliases: ["pyrotechnic"],
    label: "pyrotechnic",
    model: Pyrotechnic,
    requiredEnumFields: ["type"],
    requiredNumberFields: ["quantity"],
    stringFields: ["batchNumber", "storageLocation", "notes"],
    lowercaseFields: ["storageLocation"],
    numberFields: ["quantity"],
    integerFields: ["quantity"],
    minFields: {
      quantity: 1
    },
    dateFields: ["manufactureDate", "expiryDate"],
    enumFields: {
      type: PYROTECHNIC_TYPES,
      status: EQUIPMENT_STATUS
    }
  }
];

export const VESSEL_DEVICE_CONFIG_BY_KEY = Object.fromEntries(
  VESSEL_DEVICE_CONFIGS.map((config) => [config.key, config])
);

export const VESSEL_DEVICE_KEYS = VESSEL_DEVICE_CONFIGS.map((config) => config.key);

export const VESSEL_DEVICE_ALIAS_TO_KEY = Object.fromEntries(
  VESSEL_DEVICE_CONFIGS.flatMap((config) => [
    [config.key, config.key],
    ...(config.aliases || []).map((alias) => [alias, config.key])
  ])
);
