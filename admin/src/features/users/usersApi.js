import { apiClient } from '../../app/api/client'

function normalizeProfile(profile) {
  if (!profile) {
    return null
  }

  return {
    id: profile.id ?? profile._id ?? null,
    name: profile.name ?? '',
    dateOfBirth: profile.dateOfBirth ?? null,
    address: profile.address ?? '',
    idCardNumber: profile.idCardNumber ?? '',
    phoneNumber: profile.phoneNumber ?? '',
    gender: profile.gender ?? 'Other',
    position: profile.position ?? '',
    avatarUrl: profile.avatarUrl ?? '',
    bio: profile.bio ?? '',
    createdAt: profile.createdAt ?? null,
    updatedAt: profile.updatedAt ?? null,
  }
}

function normalizeUser(user) {
  return {
    id: user.id ?? user._id,
    email: user.email ?? '',
    role: user.role ?? 'staff',
    emailVerified: Boolean(user.emailVerified),
    isActive: Boolean(user.isActive),
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
    profile: normalizeProfile(user.profile),
    name: user.name ?? '',
  }
}

async function getAllUsers() {
  const users = []
  const limit = 100
  let page = 1
  let hasNextPage = true
  let pageGuard = 0

  while (hasNextPage && pageGuard < 25) {
    const { data } = await apiClient.get('/admin/users', {
      params: { page, limit },
    })

    users.push(...(data?.users ?? []).map(normalizeUser))
    hasNextPage = Boolean(data?.pagination?.hasNextPage)
    page += 1
    pageGuard += 1
  }

  return users
}

export const usersApi = {
  getAllUsers,

  async createUser(payload) {
    const { data } = await apiClient.post('/admin/users', payload)
    return normalizeUser(data.user)
  },

  async updateUser(id, payload) {
    const { data } = await apiClient.patch(`/admin/users/${id}`, payload)
    return normalizeUser(data.user)
  },

  async deleteUser(id) {
    const { data } = await apiClient.delete(`/admin/users/${id}`)
    return data
  },

  async lockUser(id) {
    const { data } = await apiClient.patch(`/admin/users/${id}/lock`)
    return normalizeUser(data.user)
  },
}
