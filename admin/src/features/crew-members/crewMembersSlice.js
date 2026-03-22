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

function upsertCrewMember(crewMembers, incomingCrewMember) {
  const nextCrewMembers = crewMembers.filter((crewMember) => crewMember.id !== incomingCrewMember.id)
  nextCrewMembers.push(incomingCrewMember)
  return nextCrewMembers.sort(compareByNewest)
}

const crewMembersSlice = createSlice({
  name: 'crewMembers',
  initialState,
  reducers: {
    fetchCrewMembers(state) {
      state.status = 'loading'
      state.error = null
    },
    fetchCrewMembersSuccess(state, action) {
      state.status = 'succeeded'
      state.items = [...action.payload].sort(compareByNewest)
      state.lastSyncedAt = new Date().toISOString()
      state.error = null
    },
    fetchCrewMembersFailure(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
    fetchCrewMemberDetail: {
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
    fetchCrewMemberDetailSuccess(state, action) {
      state.detailStatus = 'succeeded'
      state.selectedItem = action.payload
      state.items = upsertCrewMember(state.items, action.payload)
      state.detailError = null
    },
    fetchCrewMemberDetailFailure(state, action) {
      state.detailStatus = 'failed'
      state.detailError = action.payload
      state.selectedItem = null
    },
    clearSelectedCrewMember(state) {
      state.selectedItem = null
      state.detailStatus = 'idle'
      state.detailError = null
    },
    createCrewMember: {
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
    createCrewMemberSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertCrewMember(state.items, action.payload)
      state.error = null
    },
    createCrewMemberFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    updateCrewMember: {
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
    updateCrewMemberSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertCrewMember(state.items, action.payload)
      if (state.selectedItem?.id === action.payload.id) {
        state.selectedItem = action.payload
      }
      state.error = null
    },
    updateCrewMemberFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    deleteCrewMember: {
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
    deleteCrewMemberSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = state.items.filter((crewMember) => crewMember.id !== action.payload)
      if (state.selectedItem?.id === action.payload) {
        state.selectedItem = null
        state.detailStatus = 'idle'
      }
      state.error = null
    },
    deleteCrewMemberFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    resetCrewMembersState() {
      return initialState
    },
  },
})

export const {
  fetchCrewMembers,
  fetchCrewMembersSuccess,
  fetchCrewMembersFailure,
  fetchCrewMemberDetail,
  fetchCrewMemberDetailSuccess,
  fetchCrewMemberDetailFailure,
  clearSelectedCrewMember,
  createCrewMember,
  createCrewMemberSuccess,
  createCrewMemberFailure,
  updateCrewMember,
  updateCrewMemberSuccess,
  updateCrewMemberFailure,
  deleteCrewMember,
  deleteCrewMemberSuccess,
  deleteCrewMemberFailure,
  resetCrewMembersState,
} = crewMembersSlice.actions

export const selectCrewMembers = (state) => state.crewMembers.items
export const selectCrewMembersStatus = (state) => state.crewMembers.status
export const selectCrewMembersError = (state) => state.crewMembers.error
export const selectSelectedCrewMember = (state) => state.crewMembers.selectedItem
export const selectSelectedCrewMemberStatus = (state) => state.crewMembers.detailStatus
export const selectSelectedCrewMemberError = (state) => state.crewMembers.detailError

export default crewMembersSlice.reducer
