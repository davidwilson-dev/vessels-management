import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { vesselsApi } from './vesselsApi'
import {
  createVessel,
  createVesselFailure,
  createVesselSuccess,
  deleteVessel,
  deleteVesselFailure,
  deleteVesselSuccess,
  fetchVesselDetail,
  fetchVesselDetailFailure,
  fetchVesselDetailSuccess,
  fetchVessels,
  fetchVesselsFailure,
  fetchVesselsSuccess,
  updateVessel,
  updateVesselFailure,
  updateVesselSuccess,
} from './vesselsSlice'
import { getApiErrorMessage } from '../../shared/utils/format'

function* fetchVesselsWorker() {
  try {
    const vessels = yield call([vesselsApi, vesselsApi.getAllVessels])
    yield put(fetchVesselsSuccess(vessels))
  } catch (error) {
    yield put(fetchVesselsFailure(getApiErrorMessage(error, 'Unable to load vessels right now.')))
  }
}

function* fetchVesselDetailWorker(action) {
  try {
    const vessel = yield call([vesselsApi, vesselsApi.getVesselById], action.payload)
    yield put(fetchVesselDetailSuccess(vessel))
    action.meta?.deferred?.resolve(vessel)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to load the vessel details.')
    yield put(fetchVesselDetailFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* createVesselWorker(action) {
  try {
    const vessel = yield call([vesselsApi, vesselsApi.createVessel], action.payload)
    yield put(createVesselSuccess(vessel))
    action.meta?.deferred?.resolve(vessel)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to create the vessel.')
    yield put(createVesselFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* updateVesselWorker(action) {
  try {
    const vessel = yield call([vesselsApi, vesselsApi.updateVessel], action.payload.id, action.payload.payload)
    yield put(updateVesselSuccess(vessel))
    action.meta?.deferred?.resolve(vessel)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to update the vessel.')
    yield put(updateVesselFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* deleteVesselWorker(action) {
  try {
    yield call([vesselsApi, vesselsApi.deleteVessel], action.payload)
    yield put(deleteVesselSuccess(action.payload))
    action.meta?.deferred?.resolve(action.payload)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to remove the vessel.')
    yield put(deleteVesselFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

export default function* vesselsSaga() {
  yield all([
    takeLatest(fetchVessels.type, fetchVesselsWorker),
    takeLatest(fetchVesselDetail.type, fetchVesselDetailWorker),
    takeLeading(createVessel.type, createVesselWorker),
    takeLeading(updateVessel.type, updateVesselWorker),
    takeLeading(deleteVessel.type, deleteVesselWorker),
  ])
}
