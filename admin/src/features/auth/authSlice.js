import { createSlice } from '@reduxjs/toolkit'

import { createDeferred } from '../../shared/utils/deferred'
import { readSession } from '../../shared/utils/session'

const storedSession = readSession()

const initialState = {
  currentUser: storedSession.user,
  accessToken: storedSession.accessToken,
  isBootstrapped: false,
  loginStatus: 'idle',
  logoutStatus: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreSession(state) {
      state.error = null
    },
    restoreSessionSuccess(state, action) {
      state.currentUser = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isBootstrapped = true
      state.error = null
    },
    restoreSessionFailure(state) {
      state.currentUser = null
      state.accessToken = null
      state.isBootstrapped = true
      state.error = null
    },
    loginUser: {
      reducer(state) {
        state.loginStatus = 'loading'
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
    loginUserSuccess(state, action) {
      state.loginStatus = 'succeeded'
      state.logoutStatus = 'idle'
      state.currentUser = action.payload.user
      state.accessToken = action.payload.accessToken
      state.error = null
    },
    loginUserFailure(state, action) {
      state.loginStatus = 'failed'
      state.error = action.payload
    },
    logoutUser: {
      reducer(state) {
        state.logoutStatus = 'loading'
      },
      prepare() {
        return {
          payload: undefined,
          meta: {
            deferred: createDeferred(),
          },
        }
      },
    },
    logoutUserSuccess(state) {
      state.currentUser = null
      state.accessToken = null
      state.logoutStatus = 'succeeded'
      state.loginStatus = 'idle'
      state.error = null
      state.isBootstrapped = true
    },
  },
})

export const {
  restoreSession,
  restoreSessionSuccess,
  restoreSessionFailure,
  loginUser,
  loginUserSuccess,
  loginUserFailure,
  logoutUser,
  logoutUserSuccess,
} = authSlice.actions

export const selectAuthState = (state) => state.auth
export const selectCurrentUser = (state) => state.auth.currentUser
export const selectIsBootstrapped = (state) => state.auth.isBootstrapped
export const selectIsAuthenticated = (state) => Boolean(state.auth.currentUser && state.auth.accessToken)
export const selectCanManageUsers = (state) => state.auth.currentUser?.role === 'admin'

export default authSlice.reducer
