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

function upsertVessel(vessels, incomingVessel) {
  const nextVessels = vessels.filter((vessel) => vessel.id !== incomingVessel.id)
  nextVessels.push(incomingVessel)
  return nextVessels.sort(compareByNewest)
}

const vesselsSlice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    fetchVessels(state) {
      state.status = 'loading'
      state.error = null
    },
    fetchVesselsSuccess(state, action) {
      state.status = 'succeeded'
      state.items = [...action.payload].sort(compareByNewest)
      state.lastSyncedAt = new Date().toISOString()
      state.error = null
    },
    fetchVesselsFailure(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
    fetchVesselDetail: {
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
    fetchVesselDetailSuccess(state, action) {
      state.detailStatus = 'succeeded'
      state.selectedItem = action.payload
      state.items = upsertVessel(state.items, action.payload)
      state.detailError = null
    },
    fetchVesselDetailFailure(state, action) {
      state.detailStatus = 'failed'
      state.detailError = action.payload
      state.selectedItem = null
    },
    clearSelectedVessel(state) {
      state.selectedItem = null
      state.detailStatus = 'idle'
      state.detailError = null
    },
    createVessel: {
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
    createVesselSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertVessel(state.items, action.payload)
      state.error = null
    },
    createVesselFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    updateVessel: {
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
    updateVesselSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertVessel(state.items, action.payload)
      if (state.selectedItem?.id === action.payload.id) {
        state.selectedItem = action.payload
      }
      state.error = null
    },
    updateVesselFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    deleteVessel: {
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
    deleteVesselSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = state.items.filter((vessel) => vessel.id !== action.payload)
      if (state.selectedItem?.id === action.payload) {
        state.selectedItem = null
        state.detailStatus = 'idle'
      }
      state.error = null
    },
    deleteVesselFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    resetVesselsState() {
      return initialState
    },
  },
})

export const {
  fetchVessels,
  fetchVesselsSuccess,
  fetchVesselsFailure,
  fetchVesselDetail,
  fetchVesselDetailSuccess,
  fetchVesselDetailFailure,
  clearSelectedVessel,
  createVessel,
  createVesselSuccess,
  createVesselFailure,
  updateVessel,
  updateVesselSuccess,
  updateVesselFailure,
  deleteVessel,
  deleteVesselSuccess,
  deleteVesselFailure,
  resetVesselsState,
} = vesselsSlice.actions

export const selectVessels = (state) => state.vessels.items
export const selectVesselsStatus = (state) => state.vessels.status
export const selectVesselsError = (state) => state.vessels.error
export const selectSelectedVessel = (state) => state.vessels.selectedItem
export const selectSelectedVesselStatus = (state) => state.vessels.detailStatus
export const selectSelectedVesselError = (state) => state.vessels.detailError

export default vesselsSlice.reducer
