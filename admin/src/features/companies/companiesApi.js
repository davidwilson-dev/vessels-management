import { apiClient } from '../../app/api/client'

function normalizeVesselSummary(vessel) {
  if (!vessel) {
    return null
  }

  return {
    id: vessel.id ?? vessel._id ?? null,
    vesselCode: vessel.vesselCode ?? '',
    name: vessel.name ?? '',
    officialNumber: vessel.officialNumber ?? '',
    imoNumber: vessel.imoNumber ?? '',
    amsaUvi: vessel.amsaUvi ?? '',
    vesselType: vessel.vesselType ?? 'other',
    status: vessel.status ?? 'active',
    startDate: vessel.startDate ?? null,
    endDate: vessel.endDate ?? null,
    isCurrent: Boolean(vessel.isCurrent),
  }
}

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
    startDate: crewMember.startDate ?? null,
    endDate: crewMember.endDate ?? null,
    isCurrent: Boolean(crewMember.isCurrent),
  }
}

function normalizeCompany(company) {
  return {
    id: company.id ?? company._id ?? null,
    companyCode: company.companyCode ?? '',
    name: company.name ?? '',
    email: company.email ?? '',
    phone: company.phone ?? '',
    address: company.address ?? '',
    status: company.status ?? 'active',
    notes: company.notes ?? '',
    linkedVessels: Array.isArray(company.linkedVessels)
      ? company.linkedVessels.map(normalizeVesselSummary)
      : [],
    linkedCrewMembers: Array.isArray(company.linkedCrewMembers)
      ? company.linkedCrewMembers.map(normalizeCrewSummary)
      : [],
    createdAt: company.createdAt ?? null,
    updatedAt: company.updatedAt ?? null,
  }
}

async function getAllCompanies() {
  const companies = []
  const limit = 100
  let page = 1
  let hasNextPage = true
  let pageGuard = 0

  while (hasNextPage && pageGuard < 25) {
    const { data } = await apiClient.get('/admin/companies', {
      params: { page, limit },
    })

    companies.push(...(data?.companies ?? []).map(normalizeCompany))
    hasNextPage = Boolean(data?.pagination?.hasNextPage)
    page += 1
    pageGuard += 1
  }

  return companies
}

export const companiesApi = {
  getAllCompanies,

  async getCompanyById(id) {
    const { data } = await apiClient.get(`/admin/companies/${id}`)
    return normalizeCompany(data.company)
  },

  async createCompany(payload) {
    const { data } = await apiClient.post('/admin/companies', payload)
    return normalizeCompany(data.company)
  },

  async updateCompany(id, payload) {
    const { data } = await apiClient.patch(`/admin/companies/${id}`, payload)
    return normalizeCompany(data.company)
  },

  async deleteCompany(id) {
    const { data } = await apiClient.delete(`/admin/companies/${id}`)
    return data
  },
}
