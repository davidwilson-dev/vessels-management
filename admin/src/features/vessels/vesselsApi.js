import { apiClient } from '../../app/api/client'
import { normalizeDeviceCollection, vesselDeviceConfigs } from './vesselDeviceConfig'

function normalizeCrewSummary(crewMember) {
  if (!crewMember) {
    return null
  }

  return {
    id: crewMember.id ?? crewMember._id ?? null,
    employeeCode: crewMember.employeeCode ?? '',
    fullName: crewMember.fullName ?? '',
    email: crewMember.email ?? '',
    phone: crewMember.phone ?? '',
    role: crewMember.role ?? (Array.isArray(crewMember.roles) ? crewMember.roles[0] ?? '' : ''),
    rank: crewMember.rank ?? '',
    status: crewMember.status ?? 'active',
  }
}

function normalizeAssignment(assignment) {
  return {
    id: assignment.id ?? assignment._id ?? null,
    role: assignment.role ?? 'other',
    startDate: assignment.startDate ?? null,
    endDate: assignment.endDate ?? null,
    isCurrent: Boolean(assignment.isCurrent),
    notes: assignment.notes ?? '',
    crewMember: normalizeCrewSummary(assignment.crewMember),
  }
}

function normalizeCompanyReference(company) {
  if (!company) {
    return null
  }

  if (typeof company === 'string') {
    return {
      id: company,
      companyCode: '',
      name: '',
      status: '',
    }
  }

  return {
    id: company.id ?? company._id ?? null,
    companyCode: company.companyCode ?? '',
    name: company.name ?? '',
    status: company.status ?? '',
  }
}

function normalizeVessel(vessel) {
  const normalizedVessel = {
    id: vessel.id ?? vessel._id ?? null,
    vesselCode: vessel.vesselCode ?? '',
    name: vessel.name ?? '',
    officialNumber: vessel.officialNumber ?? '',
    imoNumber: vessel.imoNumber ?? '',
    amsaUvi: vessel.amsaUvi ?? '',
    trailerRegNo: vessel.trailerRegNo ?? '',
    homePort: vessel.homePort ?? '',
    builder: vessel.builder ?? '',
    buildYear: vessel.buildYear ?? null,
    buildersPlateNo: vessel.buildersPlateNo ?? '',
    surveyClass: vessel.surveyClass ?? '',
    surveyAuthority: vessel.surveyAuthority ?? '',
    vesselType: vessel.vesselType ?? 'other',
    flagState: vessel.flagState ?? '',
    lengthOverall: vessel.lengthOverall ?? null,
    beam: vessel.beam ?? null,
    draft: vessel.draft ?? null,
    grossTonnage: vessel.grossTonnage ?? null,
    netTonnage: vessel.netTonnage ?? null,
    hullMaterial: vessel.hullMaterial ?? '',
    noOfCrew: vessel.noOfCrew ?? 0,
    noOfPax: vessel.noOfPax ?? 0,
    noOfBerthed: vessel.noOfBerthed ?? 0,
    noOfUnberthedPax: vessel.noOfUnberthedPax ?? 0,
    cosExpiryDate: vessel.cosExpiryDate ?? null,
    surveyAnniversaryDate: vessel.surveyAnniversaryDate ?? null,
    classCertExpiryDate: vessel.classCertExpiryDate ?? null,
    cooExpiryDate: vessel.cooExpiryDate ?? null,
    trailerRegExpiryDate: vessel.trailerRegExpiryDate ?? null,
    rcdTestExpiryDate: vessel.rcdTestExpiryDate ?? null,
    meggerTestExpiryDate: vessel.meggerTestExpiryDate ?? null,
    ecocExpiryDate: vessel.ecocExpiryDate ?? null,
    gasCocExpiryDate: vessel.gasCocExpiryDate ?? null,
    workOrderNo: vessel.workOrderNo ?? '',
    captain: normalizeCrewSummary(vessel.captain),
    lineManager: normalizeCrewSummary(vessel.lineManager),
    company: normalizeCompanyReference(vessel.company),
    status: vessel.status ?? 'active',
    notes: vessel.notes ?? '',
    crewAssignments: Array.isArray(vessel.crewAssignments)
      ? vessel.crewAssignments.map(normalizeAssignment)
      : [],
    createdAt: vessel.createdAt ?? null,
    updatedAt: vessel.updatedAt ?? null,
  }

  vesselDeviceConfigs.forEach((config) => {
    normalizedVessel[config.key] = normalizeDeviceCollection(config, vessel[config.key])
  })

  return normalizedVessel
}

async function getAllVessels() {
  const vessels = []
  const limit = 100
  let page = 1
  let hasNextPage = true
  let pageGuard = 0

  while (hasNextPage && pageGuard < 25) {
    const { data } = await apiClient.get('/admin/vessels', {
      params: { page, limit },
    })

    vessels.push(...(data?.vessels ?? []).map(normalizeVessel))
    hasNextPage = Boolean(data?.pagination?.hasNextPage)
    page += 1
    pageGuard += 1
  }

  return vessels
}

export const vesselsApi = {
  getAllVessels,

  async getVesselById(id) {
    const { data } = await apiClient.get(`/admin/vessels/${id}`)
    return normalizeVessel(data.vessel)
  },

  async createVessel(payload) {
    const { data } = await apiClient.post('/admin/vessels', payload)
    return normalizeVessel(data.vessel)
  },

  async updateVessel(id, payload) {
    const { data } = await apiClient.patch(`/admin/vessels/${id}`, payload)
    return normalizeVessel(data.vessel)
  },

  async deleteVessel(id) {
    const { data } = await apiClient.delete(`/admin/vessels/${id}`)
    return data
  },
}
