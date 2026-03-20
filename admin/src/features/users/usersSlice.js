import { createSlice } from '@reduxjs/toolkit'

import { compareByNewest } from '../../shared/utils/format'
import { createDeferred } from '../../shared/utils/deferred'

const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
  lastSyncedAt: null,
}

function upsertUser(users, incomingUser) {
  const nextUsers = users.filter((user) => user.id !== incomingUser.id)
  nextUsers.push(incomingUser)
  return nextUsers.sort(compareByNewest)
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsers(state) {
      state.status = 'loading'
      state.error = null
    },
    fetchUsersSuccess(state, action) {
      state.status = 'succeeded'
      state.items = [...action.payload].sort(compareByNewest)
      state.lastSyncedAt = new Date().toISOString()
      state.error = null
    },
    fetchUsersFailure(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
    createUser: {
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
    createUserSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertUser(state.items, action.payload)
      state.error = null
    },
    createUserFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    updateUser: {
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
    updateUserSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertUser(state.items, action.payload)
      state.error = null
    },
    updateUserFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    deleteUser: {
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
    deleteUserSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = state.items.filter((user) => user.id !== action.payload)
      state.error = null
    },
    deleteUserFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    lockUser: {
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
    lockUserSuccess(state, action) {
      state.mutationStatus = 'succeeded'
      state.items = upsertUser(state.items, action.payload)
      state.error = null
    },
    lockUserFailure(state, action) {
      state.mutationStatus = 'failed'
      state.error = action.payload
    },
    resetUsersState() {
      return initialState
    },
  },
})

export const {
  fetchUsers,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUser,
  createUserSuccess,
  createUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure,
  lockUser,
  lockUserSuccess,
  lockUserFailure,
  resetUsersState,
} = usersSlice.actions

export const selectUsers = (state) => state.users.items
export const selectUsersStatus = (state) => state.users.status
export const selectUsersError = (state) => state.users.error

export default usersSlice.reducer
