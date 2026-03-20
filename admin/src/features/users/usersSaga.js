import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { usersApi } from './usersApi'
import {
  createUser,
  createUserFailure,
  createUserSuccess,
  deleteUser,
  deleteUserFailure,
  deleteUserSuccess,
  fetchUsers,
  fetchUsersFailure,
  fetchUsersSuccess,
  lockUser,
  lockUserFailure,
  lockUserSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './usersSlice'
import { getApiErrorMessage } from '../../shared/utils/format'

function* fetchUsersWorker() {
  try {
    const users = yield call([usersApi, usersApi.getAllUsers])
    yield put(fetchUsersSuccess(users))
  } catch (error) {
    yield put(fetchUsersFailure(getApiErrorMessage(error, 'Unable to load users right now.')))
  }
}

function* createUserWorker(action) {
  try {
    const user = yield call([usersApi, usersApi.createUser], action.payload)
    yield put(createUserSuccess(user))
    action.meta?.deferred?.resolve(user)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to create the user.')
    yield put(createUserFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* updateUserWorker(action) {
  try {
    const user = yield call([usersApi, usersApi.updateUser], action.payload.id, action.payload.payload)
    yield put(updateUserSuccess(user))
    action.meta?.deferred?.resolve(user)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to update the user.')
    yield put(updateUserFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* deleteUserWorker(action) {
  try {
    yield call([usersApi, usersApi.deleteUser], action.payload)
    yield put(deleteUserSuccess(action.payload))
    action.meta?.deferred?.resolve(action.payload)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to remove the user.')
    yield put(deleteUserFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* lockUserWorker(action) {
  try {
    const user = yield call([usersApi, usersApi.lockUser], action.payload)
    yield put(lockUserSuccess(user))
    action.meta?.deferred?.resolve(user)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to lock the user.')
    yield put(lockUserFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

export default function* usersSaga() {
  yield all([
    takeLatest(fetchUsers.type, fetchUsersWorker),
    takeLeading(createUser.type, createUserWorker),
    takeLeading(updateUser.type, updateUserWorker),
    takeLeading(deleteUser.type, deleteUserWorker),
    takeLeading(lockUser.type, lockUserWorker),
  ])
}
