import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { crewMembersApi } from './crewMembersApi'
import {
  createCrewMember,
  createCrewMemberFailure,
  createCrewMemberSuccess,
  deleteCrewMember,
  deleteCrewMemberFailure,
  deleteCrewMemberSuccess,
  fetchCrewMemberDetail,
  fetchCrewMemberDetailFailure,
  fetchCrewMemberDetailSuccess,
  fetchCrewMembers,
  fetchCrewMembersFailure,
  fetchCrewMembersSuccess,
  updateCrewMember,
  updateCrewMemberFailure,
  updateCrewMemberSuccess,
} from './crewMembersSlice'
import { getApiErrorMessage } from '../../shared/utils/format'

function* fetchCrewMembersWorker() {
  try {
    const crewMembers = yield call([crewMembersApi, crewMembersApi.getAllCrewMembers])
    yield put(fetchCrewMembersSuccess(crewMembers))
  } catch (error) {
    yield put(fetchCrewMembersFailure(getApiErrorMessage(error, 'Unable to load crew members right now.')))
  }
}

function* fetchCrewMemberDetailWorker(action) {
  try {
    const crewMember = yield call([crewMembersApi, crewMembersApi.getCrewMemberById], action.payload)
    yield put(fetchCrewMemberDetailSuccess(crewMember))
    action.meta?.deferred?.resolve(crewMember)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to load the crew member details.')
    yield put(fetchCrewMemberDetailFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* createCrewMemberWorker(action) {
  try {
    const crewMember = yield call([crewMembersApi, crewMembersApi.createCrewMember], action.payload)
    yield put(createCrewMemberSuccess(crewMember))
    action.meta?.deferred?.resolve(crewMember)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to create the crew member.')
    yield put(createCrewMemberFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* updateCrewMemberWorker(action) {
  try {
    const crewMember = yield call([crewMembersApi, crewMembersApi.updateCrewMember], action.payload.id, action.payload.payload)
    yield put(updateCrewMemberSuccess(crewMember))
    action.meta?.deferred?.resolve(crewMember)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to update the crew member.')
    yield put(updateCrewMemberFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* deleteCrewMemberWorker(action) {
  try {
    yield call([crewMembersApi, crewMembersApi.deleteCrewMember], action.payload)
    yield put(deleteCrewMemberSuccess(action.payload))
    action.meta?.deferred?.resolve(action.payload)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to remove the crew member.')
    yield put(deleteCrewMemberFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

export default function* crewMembersSaga() {
  yield all([
    takeLatest(fetchCrewMembers.type, fetchCrewMembersWorker),
    takeLatest(fetchCrewMemberDetail.type, fetchCrewMemberDetailWorker),
    takeLeading(createCrewMember.type, createCrewMemberWorker),
    takeLeading(updateCrewMember.type, updateCrewMemberWorker),
    takeLeading(deleteCrewMember.type, deleteCrewMemberWorker),
  ])
}
