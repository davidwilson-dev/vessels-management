import axios from 'axios'

import {
  clearSession,
  getAccessToken,
  setAccessToken,
  setStoredUser,
} from '../../shared/utils/session'

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshRequest = null

async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = apiClient
      .post('/auth/refresh-token')
      .then(({ data }) => {
        const accessToken = data?.accessToken ?? null
        const user = data?.user ?? data?.safeUser ?? null

        if (accessToken) {
          setAccessToken(accessToken)
        }

        if (user) {
          setStoredUser(user)
        }

        return accessToken
      })
      .catch((error) => {
        clearSession()
        throw error
      })
      .finally(() => {
        refreshRequest = null
      })
  }

  return refreshRequest
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const requestUrl = originalRequest?.url || ''
    const isAuthRequest =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh-token')

    if (error?.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true

      try {
        const newToken = await refreshAccessToken()

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        clearSession()

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.assign('/login')
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
