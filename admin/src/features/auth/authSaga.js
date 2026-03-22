import { all, call, put, takeLatest } from 'redux-saga/effects'

import { authApi } from './authApi'
import {
  loginUser,
  loginUserFailure,
  loginUserSuccess,
  logoutUser,
  logoutUserSuccess,
  restoreSession,
  restoreSessionFailure,
  restoreSessionSuccess,
} from './authSlice'
import { resetUsersState } from '../users/usersSlice'
import { resetVesselsState } from '../vessels/vesselsSlice'
import { resetCrewMembersState } from '../crew-members/crewMembersSlice'
import { getApiErrorMessage } from '../../shared/utils/format'
import { clearSession, readSession, writeSession } from '../../shared/utils/session'

function* restoreSessionWorker() {
  const session = yield call(readSession)

  if (session.accessToken && session.user) {
    yield put(restoreSessionSuccess(session))
    return
  }

  try {
    const refreshedSession = yield call([authApi, authApi.refresh])
    yield call(writeSession, refreshedSession)
    yield put(restoreSessionSuccess(refreshedSession))
  } catch {
    yield call(clearSession)
    yield put(resetUsersState())
    yield put(resetVesselsState())
    yield put(resetCrewMembersState())
    yield put(restoreSessionFailure())
  }
}

function* loginUserWorker(action) {
  try {
    const session = yield call([authApi, authApi.login], action.payload)
    yield call(writeSession, session)
    yield put(loginUserSuccess(session))
    action.meta?.deferred?.resolve(session)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to sign in. Please try again.')
    yield put(
      loginUserFailure(message),
    )
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* logoutUserWorker(action) {
  try {
    yield call([authApi, authApi.logout])
  } finally {
    yield call(clearSession)
    yield put(resetUsersState())
    yield put(resetVesselsState())
    yield put(resetCrewMembersState())
    yield put(logoutUserSuccess())
    action.meta?.deferred?.resolve()
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(restoreSession.type, restoreSessionWorker),
    takeLatest(loginUser.type, loginUserWorker),
    takeLatest(logoutUser.type, logoutUserWorker),
  ])
}
