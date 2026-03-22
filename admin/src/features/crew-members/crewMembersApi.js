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
  }
}

function normalizeCertificate(certificate) {
  return {
    name: certificate.name ?? '',
    number: certificate.number ?? '',
    issuedBy: certificate.issuedBy ?? '',
    issueDate: certificate.issueDate ?? null,
    expiryDate: certificate.expiryDate ?? null,
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
    vessel: normalizeVesselSummary(assignment.vessel),
  }
}

function normalizeCompanyReference(company) {
  if (!company) {
    return ''
  }

  if (typeof company === 'string') {
    return company
  }

  return company.id ?? company._id ?? ''
}

function normalizeCrewMember(crewMember) {
  return {
    id: crewMember.id ?? crewMember._id ?? null,
    employeeCode: crewMember.employeeCode ?? '',
    fullName: crewMember.fullName ?? '',
    dateOfBirth: crewMember.dateOfBirth ?? null,
    nationality: crewMember.nationality ?? '',
    phone: crewMember.phone ?? '',
    email: crewMember.email ?? '',
    role: crewMember.role ?? (Array.isArray(crewMember.roles) ? crewMember.roles[0] ?? '' : ''),
    rank: crewMember.rank ?? '',
    company: normalizeCompanyReference(crewMember.company),
    assignedVessels: Array.isArray(crewMember.assignedVessels)
      ? crewMember.assignedVessels.map(normalizeVesselSummary)
      : [],
    certificates: Array.isArray(crewMember.certificates)
      ? crewMember.certificates.map(normalizeCertificate)
      : [],
    medicalExpiryDate: crewMember.medicalExpiryDate ?? null,
    contractStartDate: crewMember.contractStartDate ?? null,
    contractEndDate: crewMember.contractEndDate ?? null,
    emergencyContact: crewMember.emergencyContact
      ? {
          name: crewMember.emergencyContact.name ?? '',
          phone: crewMember.emergencyContact.phone ?? '',
          relationship: crewMember.emergencyContact.relationship ?? '',
        }
      : null,
    status: crewMember.status ?? 'active',
    notes: crewMember.notes ?? '',
    assignments: Array.isArray(crewMember.assignments)
      ? crewMember.assignments.map(normalizeAssignment)
      : [],
    createdAt: crewMember.createdAt ?? null,
    updatedAt: crewMember.updatedAt ?? null,
  }
}

async function getAllCrewMembers() {
  const crewMembers = []
  const limit = 100
  let page = 1
  let hasNextPage = true
  let pageGuard = 0

  while (hasNextPage && pageGuard < 25) {
    const { data } = await apiClient.get('/admin/crew-members', {
      params: { page, limit },
    })

    crewMembers.push(...(data?.crewMembers ?? []).map(normalizeCrewMember))
    hasNextPage = Boolean(data?.pagination?.hasNextPage)
    page += 1
    pageGuard += 1
  }

  return crewMembers
}

export const crewMembersApi = {
  getAllCrewMembers,

  async getCrewMemberById(id) {
    const { data } = await apiClient.get(`/admin/crew-members/${id}`)
    return normalizeCrewMember(data.crewMember)
  },

  async createCrewMember(payload) {
    const { data } = await apiClient.post('/admin/crew-members', payload)
    return normalizeCrewMember(data.crewMember)
  },

  async updateCrewMember(id, payload) {
    const { data } = await apiClient.patch(`/admin/crew-members/${id}`, payload)
    return normalizeCrewMember(data.crewMember)
  },

  async deleteCrewMember(id) {
    const { data } = await apiClient.delete(`/admin/crew-members/${id}`)
    return data
  },
}
