import { createSlice } from '@reduxjs/toolkit'

import { compareByNewest } from '../../shared/utils/format'
import { createDeferred } from '../../shared/utils/deferred'

const initialState = {
  items: [],
  selectedItem: null,
  status: 'idle',
  detailStatus: 'idle',
  mutationStatus: 'idle',
  error: null,
  detailError: null,
  lastSyncedAt: null,
}

function upsertCompany(companies, incomingCompany) {
  const nextCompanies = companies.filter((company) => company.id !== incomingCompany.id)
  nextCompanies.push(incomingCompany)
  return nextCompanies.sort(compareByNewest)
}

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    fetchCompanies(state) {
      state.status = 'loading'
      state.error = null
    },
    fetchCompaniesSuccess(state, action) {
      state.status = 'succeeded'
      state.items = [...action.payload].sort(compareByNewest)
      state.lastSyncedAt = new Date().toISOString()
      state.error = null
    },
    fetchCompaniesFailure(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
    fetchCompanyDetail: {
      reducer(state) {
        state.detailStatus = 'loading'
        state.detailError = null
        state.selectedItem = null
      },
      prepare(payload) {
        return {
          payload,
          meta: {
            deferred: createDeferred(),
          },
        }
      },
    },
    fetchCompanyDetailSuccess(state, action) {
      state.detailStatus = 'succeeded'
      state.selectedItem = action.payload
      state.items = upsertCompany(state.items, action.payload)
      state.detailError = null
    },
    fetchCompanyDetailFailure(state, action) {
      state.detailStatus = 'failed'
      state.detailError = action.payload
      state.selectedItem = null
    },
    clearSelectedCompany(state) {
      state.selectedItem = null
      state.detailStatus = 'idle'
      state.detailError = null
    },
    createCompany: {
      reducer(state) {
        state.mutationStatus = 'loading'
        state.error = null
      },
      prepare(payload) {
        return {
          payload,
          meta: {
            deferred: createDeferred(),
          },
        }
      },
    },
    createCompanySuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertCompany(state.items, action.payload)
      state.error = null
    },
    createCompanyFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    updateCompany: {
      reducer(state) {
        state.mutationStatus = 'loading'
        state.error = null
      },
      prepare(payload) {
        return {
          payload,
          meta: {
            deferred: createDeferred(),
          },
        }
      },
    },
    updateCompanySuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertCompany(state.items, action.payload)
      if (state.selectedItem?.id === action.payload.id) {
        state.selectedItem = action.payload
      }
      state.error = null
    },
    updateCompanyFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    deleteCompany: {
      reducer(state) {
        state.mutationStatus = 'loading'
        state.error = null
      },
      prepare(payload) {
        return {
          payload,
          meta: {
            deferred: createDeferred(),
          },
        }
      },
    },
    deleteCompanySuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = state.items.filter((company) => company.id !== action.payload)
      if (state.selectedItem?.id === action.payload) {
        state.selectedItem = null
        state.detailStatus = 'idle'
      }
      state.error = null
    },
    deleteCompanyFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    resetCompaniesState() {
      return initialState
    },
  },
})

export const {
  fetchCompanies,
  fetchCompaniesSuccess,
  fetchCompaniesFailure,
  fetchCompanyDetail,
  fetchCompanyDetailSuccess,
  fetchCompanyDetailFailure,
  clearSelectedCompany,
  createCompany,
  createCompanySuccess,
  createCompanyFailure,
  updateCompany,
  updateCompanySuccess,
  updateCompanyFailure,
  deleteCompany,
  deleteCompanySuccess,
  deleteCompanyFailure,
  resetCompaniesState,
} = companiesSlice.actions

export const selectCompanies = (state) => state.companies.items
export const selectCompaniesStatus = (state) => state.companies.status
export const selectCompaniesError = (state) => state.companies.error
export const selectSelectedCompany = (state) => state.companies.selectedItem
export const selectSelectedCompanyStatus = (state) => state.companies.detailStatus
export const selectSelectedCompanyError = (state) => state.companies.detailError

export default companiesSlice.reducer
