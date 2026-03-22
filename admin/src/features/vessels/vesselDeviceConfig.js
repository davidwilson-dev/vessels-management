import { formatDateInput, toIsoDateString } from '../../shared/utils/format'

function option(value, label) {
  return { value, label }
}

function normalizeNullableText(value) {
  if (value === undefined || value === null) {
    return null
  }

  const normalizedValue = typeof value === 'string' ? value.trim() : value
  return normalizedValue === '' ? null : normalizedValue
}

function normalizeNullableNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  return Number(value)
}

function getEmptyFieldValue(field) {
  if (field.type === 'checkbox') {
    return false
  }

  return ''
}

function isFieldFilled(field, value) {
  if (field.type === 'checkbox') {
    return Boolean(value)
  }

  return value !== '' && value !== null && value !== undefined
}

const equipmentStatusOptions = [
  option('active', 'Active'),
  option('inactive', 'Inactive'),
  option('maintenance', 'Maintenance'),
  option('expired', 'Expired'),
  option('damaged', 'Damaged'),
  option('used', 'Used'),
  option('missing', 'Missing'),
  option('retired', 'Retired'),
  option('disposed', 'Disposed'),
]

const propulsionTypeOptions = [
  option('propeller', 'Propeller'),
  option('waterjet', 'Waterjet'),
  option('azimuth', 'Azimuth'),
  option('thruster', 'Thruster'),
  option('outboard', 'Outboard'),
  option('inboard', 'Inboard'),
  option('other', 'Other'),
]

const fuelTypeOptions = [
  option('diesel', 'Diesel'),
  option('petrol', 'Petrol'),
  option('lng', 'LNG'),
  option('hybrid', 'Hybrid'),
  option('electric', 'Electric'),
  option('other', 'Other'),
]

const compassTypeOptions = [
  option('magnetic', 'Magnetic'),
  option('gyro', 'Gyro'),
  option('hand_bearing', 'Hand bearing'),
  option('other', 'Other'),
]

const radioTypeOptions = [
  option('vhf', 'VHF'),
  option('hf', 'HF'),
  option('mf', 'MF'),
  option('uhf', 'UHF'),
  option('satellite', 'Satellite'),
  option('portable', 'Portable'),
  option('other', 'Other'),
]

const fireEquipmentTypeOptions = [
  option('extinguisher', 'Extinguisher'),
  option('fire_hose', 'Fire hose'),
  option('fire_blanket', 'Fire blanket'),
  option('fire_pump', 'Fire pump'),
  option('detector', 'Detector'),
  option('alarm', 'Alarm'),
  option('sprinkler', 'Sprinkler'),
  option('other', 'Other'),
]

const lifeJacketTypeOptions = [
  option('adult', 'Adult'),
  option('child', 'Child'),
  option('infant', 'Infant'),
  option('crew', 'Crew'),
  option('other', 'Other'),
]

const liferaftPackTypeOptions = [
  option('solas_a', 'SOLAS A'),
  option('solas_b', 'SOLAS B'),
  option('coastal', 'Coastal'),
  option('other', 'Other'),
]

const liferaftLaunchTypeOptions = [
  option('throw_overboard', 'Throw overboard'),
  option('davits', 'Davits'),
  option('cradle', 'Cradle'),
  option('other', 'Other'),
]

const pyrotechnicTypeOptions = [
  option('hand_flare', 'Hand flare'),
  option('rocket_parachute_flare', 'Rocket parachute flare'),
  option('smoke_signal', 'Smoke signal'),
  option('other', 'Other'),
]

export const vesselFormTabs = [
  option('overview', 'Overview'),
  option('compliance', 'Compliance'),
  option('machinery', 'Machinery'),
  option('navigation', 'Navigation'),
  option('safety', 'Safety'),
]

export const vesselTypeOptions = [
  option('passenger', 'Passenger'),
  option('cargo', 'Cargo'),
  option('fishing', 'Fishing'),
  option('tug', 'Tug'),
  option('barge', 'Barge'),
  option('workboat', 'Workboat'),
  option('patrol', 'Patrol'),
  option('recreational', 'Recreational'),
  option('other', 'Other'),
]

export const vesselStatusOptions = [
  option('active', 'Active'),
  option('inactive', 'Inactive'),
  option('maintenance', 'Maintenance'),
  option('retired', 'Retired'),
]

export const vesselDeviceConfigs = [
  {
    key: 'mainEngines',
    tab: 'machinery',
    label: 'Main Engines',
    singularLabel: 'main engine',
    helperText: 'Track each primary propulsion engine installed on the vessel.',
    fields: [
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'engineNumber', label: 'Engine number' },
      { name: 'powerKw', label: 'Power (kW)', type: 'number' },
      { name: 'rpm', label: 'RPM', type: 'number' },
      { name: 'fuelType', label: 'Fuel type', type: 'select', options: fuelTypeOptions },
      { name: 'cylinders', label: 'Cylinders', type: 'number' },
      { name: 'manufacturerYear', label: 'Manufacturer year', type: 'number' },
      { name: 'installationDate', label: 'Installation date', type: 'date' },
      { name: 'lastServiceDate', label: 'Last service date', type: 'date' },
      { name: 'nextServiceDate', label: 'Next service date', type: 'date' },
      { name: 'runningHours', label: 'Running hours', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'propulsions',
    tab: 'machinery',
    label: 'Propulsions',
    singularLabel: 'propulsion',
    helperText: 'Record propellers, waterjets, and other propulsion units.',
    fields: [
      { name: 'type', label: 'Type', type: 'select', options: propulsionTypeOptions, required: true },
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'drivenByEngine', label: 'Driven by main engine Id' },
      { name: 'blades', label: 'Blades', type: 'number' },
      { name: 'diameterMm', label: 'Diameter (mm)', type: 'number' },
      { name: 'material', label: 'Material' },
      { name: 'installationDate', label: 'Installation date', type: 'date' },
      { name: 'lastInspectionDate', label: 'Last inspection date', type: 'date' },
      { name: 'nextInspectionDate', label: 'Next inspection date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'generators',
    tab: 'machinery',
    label: 'Generators',
    singularLabel: 'generator',
    helperText: 'Capture onboard electrical generation equipment and service intervals.',
    fields: [
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'ratedPowerKva', label: 'Rated power (kVA)', type: 'number' },
      { name: 'voltage', label: 'Voltage', type: 'number' },
      { name: 'frequencyHz', label: 'Frequency (Hz)', type: 'number' },
      { name: 'runningHours', label: 'Running hours', type: 'number' },
      { name: 'installationDate', label: 'Installation date', type: 'date' },
      { name: 'lastServiceDate', label: 'Last service date', type: 'date' },
      { name: 'nextServiceDate', label: 'Next service date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'gearboxes',
    tab: 'machinery',
    label: 'Gearboxes',
    singularLabel: 'gearbox',
    helperText: 'Keep gearbox setup, ratios, and service dates attached to the vessel.',
    fields: [
      { name: 'mainEngine', label: 'Linked main engine Id' },
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'ratio', label: 'Ratio' },
      { name: 'oilType', label: 'Oil type' },
      { name: 'installationDate', label: 'Installation date', type: 'date' },
      { name: 'lastServiceDate', label: 'Last service date', type: 'date' },
      { name: 'nextServiceDate', label: 'Next service date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'auxiliaryEngines',
    tab: 'machinery',
    label: 'Auxiliary Engines',
    singularLabel: 'auxiliary engine',
    helperText: 'Use this for smaller engines that support onboard systems or backup operations.',
    fields: [
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'powerKw', label: 'Power (kW)', type: 'number' },
      { name: 'fuelType', label: 'Fuel type', type: 'select', options: fuelTypeOptions },
      { name: 'runningHours', label: 'Running hours', type: 'number' },
      { name: 'installationDate', label: 'Installation date', type: 'date' },
      { name: 'lastServiceDate', label: 'Last service date', type: 'date' },
      { name: 'nextServiceDate', label: 'Next service date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'compasses',
    tab: 'navigation',
    label: 'Compasses',
    singularLabel: 'compass',
    helperText: 'Store navigation compass details and calibration schedule.',
    fields: [
      { name: 'type', label: 'Type', type: 'select', options: compassTypeOptions, required: true },
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'locationOnBoard', label: 'Location on board' },
      { name: 'lastCalibrationDate', label: 'Last calibration date', type: 'date' },
      { name: 'nextCalibrationDate', label: 'Next calibration date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'radios',
    tab: 'navigation',
    label: 'Radios',
    singularLabel: 'radio',
    helperText: 'Track communications equipment, identifiers, and inspection cycle.',
    fields: [
      { name: 'type', label: 'Type', type: 'select', options: radioTypeOptions, required: true },
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'callSign', label: 'Call sign' },
      { name: 'mmsi', label: 'MMSI' },
      { name: 'installationDate', label: 'Installation date', type: 'date' },
      { name: 'lastInspectionDate', label: 'Last inspection date', type: 'date' },
      { name: 'nextInspectionDate', label: 'Next inspection date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'breathingApparatuses',
    tab: 'safety',
    label: 'Breathing Apparatus',
    singularLabel: 'breathing apparatus',
    helperText: 'Log breathing apparatus sets, storage points, and expiry or inspection dates.',
    fields: [
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'cylinderCapacityLitres', label: 'Cylinder capacity (L)', type: 'number' },
      { name: 'workingPressureBar', label: 'Working pressure (bar)', type: 'number' },
      { name: 'locationOnBoard', label: 'Location on board' },
      { name: 'lastInspectionDate', label: 'Last inspection date', type: 'date' },
      { name: 'nextInspectionDate', label: 'Next inspection date', type: 'date' },
      { name: 'expiryDate', label: 'Expiry date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'epirbs',
    tab: 'safety',
    label: 'EPIRBs',
    singularLabel: 'EPIRB',
    helperText: 'Manage emergency beacon identifiers, batteries, and registration dates.',
    fields: [
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'hexId', label: 'Hex Id' },
      { name: 'batteryExpiryDate', label: 'Battery expiry date', type: 'date' },
      { name: 'hydrostaticReleaseExpiryDate', label: 'Hydrostatic release expiry', type: 'date' },
      { name: 'lastTestDate', label: 'Last test date', type: 'date' },
      { name: 'nextTestDate', label: 'Next test date', type: 'date' },
      { name: 'registrationExpiryDate', label: 'Registration expiry date', type: 'date' },
      { name: 'locationOnBoard', label: 'Location on board' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'fireEquipments',
    tab: 'safety',
    label: 'Fire Equipment',
    singularLabel: 'fire equipment item',
    helperText: 'Capture extinguishers, hoses, blankets, alarms, and similar assets.',
    fields: [
      { name: 'type', label: 'Type', type: 'select', options: fireEquipmentTypeOptions, required: true },
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'locationOnBoard', label: 'Location on board' },
      { name: 'extinguishingAgent', label: 'Extinguishing agent' },
      { name: 'capacity', label: 'Capacity' },
      { name: 'lastInspectionDate', label: 'Last inspection date', type: 'date' },
      { name: 'nextInspectionDate', label: 'Next inspection date', type: 'date' },
      { name: 'lastServiceDate', label: 'Last service date', type: 'date' },
      { name: 'nextServiceDate', label: 'Next service date', type: 'date' },
      { name: 'expiryDate', label: 'Expiry date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'firstAidKits',
    tab: 'safety',
    label: 'First Aid Kits',
    singularLabel: 'first aid kit',
    helperText: 'Track each kit location, quantity, and inspection cadence.',
    fields: [
      { name: 'code', label: 'Code' },
      { name: 'locationOnBoard', label: 'Location on board' },
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'lastInspectionDate', label: 'Last inspection date', type: 'date' },
      { name: 'nextInspectionDate', label: 'Next inspection date', type: 'date' },
      { name: 'expiryDate', label: 'Expiry date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'lifeBuoys',
    tab: 'safety',
    label: 'Life Buoys',
    singularLabel: 'life buoy',
    helperText: 'Record buoy locations, quantities, and fitted safety attachments.',
    fields: [
      { name: 'code', label: 'Code' },
      { name: 'locationOnBoard', label: 'Location on board' },
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'hasLight', label: 'Has light', type: 'checkbox' },
      { name: 'hasSmokeSignal', label: 'Has smoke signal', type: 'checkbox' },
      { name: 'lastInspectionDate', label: 'Last inspection date', type: 'date' },
      { name: 'nextInspectionDate', label: 'Next inspection date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'lifeJackets',
    tab: 'safety',
    label: 'Life Jackets',
    singularLabel: 'life jacket batch',
    helperText: 'Manage life jacket quantities by type, location, and inspection cycle.',
    fields: [
      { name: 'type', label: 'Type', type: 'select', options: lifeJacketTypeOptions },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'locationOnBoard', label: 'Location on board' },
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'lastInspectionDate', label: 'Last inspection date', type: 'date' },
      { name: 'nextInspectionDate', label: 'Next inspection date', type: 'date' },
      { name: 'expiryDate', label: 'Expiry date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'liferafts',
    tab: 'safety',
    label: 'Liferafts',
    singularLabel: 'liferaft',
    helperText: 'Track raft capacity, pack and launch type, and service schedule.',
    fields: [
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'capacity', label: 'Capacity', type: 'number', required: true },
      { name: 'packType', label: 'Pack type', type: 'select', options: liferaftPackTypeOptions },
      { name: 'launchType', label: 'Launch type', type: 'select', options: liferaftLaunchTypeOptions },
      { name: 'locationOnBoard', label: 'Location on board' },
      { name: 'manufactureDate', label: 'Manufacture date', type: 'date' },
      { name: 'lastServiceDate', label: 'Last service date', type: 'date' },
      { name: 'nextServiceDate', label: 'Next service date', type: 'date' },
      { name: 'expiryDate', label: 'Expiry date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'lineThrowings',
    tab: 'safety',
    label: 'Line Throwing Appliances',
    singularLabel: 'line throwing appliance',
    helperText: 'Track rescue line sets with expiry and inspection dates.',
    fields: [
      { name: 'maker', label: 'Maker' },
      { name: 'model', label: 'Model' },
      { name: 'serialNumber', label: 'Serial number' },
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'expiryDate', label: 'Expiry date', type: 'date' },
      { name: 'lastInspectionDate', label: 'Last inspection date', type: 'date' },
      { name: 'nextInspectionDate', label: 'Next inspection date', type: 'date' },
      { name: 'storageLocation', label: 'Storage location' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
  {
    key: 'pyrotechnics',
    tab: 'safety',
    label: 'Pyrotechnics',
    singularLabel: 'pyrotechnic item',
    helperText: 'Manage flare and smoke signal stock with batch and expiry data.',
    fields: [
      { name: 'type', label: 'Type', type: 'select', options: pyrotechnicTypeOptions, required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'batchNumber', label: 'Batch number' },
      { name: 'manufactureDate', label: 'Manufacture date', type: 'date' },
      { name: 'expiryDate', label: 'Expiry date', type: 'date' },
      { name: 'storageLocation', label: 'Storage location' },
      { name: 'status', label: 'Status', type: 'select', options: equipmentStatusOptions },
      { name: 'notes', label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    ],
  },
]

export const vesselDeviceConfigByKey = Object.fromEntries(
  vesselDeviceConfigs.map((config) => [config.key, config]),
)

export const vesselDeviceTabs = vesselFormTabs
  .filter((tab) => ['machinery', 'navigation', 'safety'].includes(tab.value))
  .map((tab) => ({
    ...tab,
    sections: vesselDeviceConfigs.filter((config) => config.tab === tab.value),
  }))

export function buildEmptyDeviceItem(config) {
  return config.fields.reduce(
    (item, field) => {
      item[field.name] = getEmptyFieldValue(field)
      return item
    },
    { id: '' },
  )
}

export function buildDeviceFormItems(config, records) {
  if (!Array.isArray(records) || records.length === 0) {
    return []
  }

  return records.map((record) =>
    config.fields.reduce(
      (item, field) => {
        const value = record?.[field.name]

        if (field.type === 'date') {
          item[field.name] = formatDateInput(value)
        } else if (field.type === 'checkbox') {
          item[field.name] = Boolean(value)
        } else {
          item[field.name] = value ?? ''
        }

        return item
      },
      { id: record?.id ?? record?._id ?? '' },
    ),
  )
}

export function isDeviceItemBlank(config, item) {
  return config.fields.every((field) => !isFieldFilled(field, item?.[field.name]))
}

export function normalizeDeviceFormItems(config, items = []) {
  return items
    .filter((item) => !isDeviceItemBlank(config, item))
    .map((item) => {
      const payload = {}

      if (item?.id) {
        payload.id = item.id
      }

      config.fields.forEach((field) => {
        const rawValue = item?.[field.name]

        if (field.type === 'date') {
          payload[field.name] = rawValue ? toIsoDateString(rawValue) : null
          return
        }

        if (field.type === 'number') {
          payload[field.name] = normalizeNullableNumber(rawValue)
          return
        }

        if (field.type === 'checkbox') {
          payload[field.name] = Boolean(rawValue)
          return
        }

        if (field.type === 'select') {
          payload[field.name] = rawValue || null
          return
        }

        payload[field.name] = normalizeNullableText(rawValue)
      })

      return payload
    })
}

export function normalizeDeviceCollection(config, records) {
  if (!Array.isArray(records)) {
    return []
  }

  return records.map((record) =>
    config.fields.reduce(
      (item, field) => {
        if (field.type === 'checkbox') {
          item[field.name] = Boolean(record?.[field.name])
        } else {
          item[field.name] = record?.[field.name] ?? null
        }

        return item
      },
      {
        id: record?.id ?? record?._id ?? null,
        createdAt: record?.createdAt ?? null,
        updatedAt: record?.updatedAt ?? null,
      },
    ),
  )
}
