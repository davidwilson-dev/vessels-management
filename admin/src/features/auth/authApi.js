import { apiClient } from '../../app/api/client'

function normalizeSessionResponse(data) {
  return {
    accessToken: data?.accessToken ?? null,
    user: data?.safeUser ?? data?.user ?? null,
  }
}

export const authApi = {
  async login(payload) {
    const { data } = await apiClient.post('/auth/login', payload)
    return normalizeSessionResponse(data)
  },

  async refresh() {
    const { data } = await apiClient.post('/auth/refresh-token')
    return normalizeSessionResponse(data)
  },

  async logout() {
    await apiClient.delete('/auth/logout')
  },
}
