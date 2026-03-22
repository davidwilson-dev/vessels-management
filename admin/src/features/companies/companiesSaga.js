import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { companiesApi } from './companiesApi'
import {
  createCompany,
  createCompanyFailure,
  createCompanySuccess,
  deleteCompany,
  deleteCompanyFailure,
  deleteCompanySuccess,
  fetchCompanies,
  fetchCompaniesFailure,
  fetchCompaniesSuccess,
  fetchCompanyDetail,
  fetchCompanyDetailFailure,
  fetchCompanyDetailSuccess,
  updateCompany,
  updateCompanyFailure,
  updateCompanySuccess,
} from './companiesSlice'
import { getApiErrorMessage } from '../../shared/utils/format'

function* fetchCompaniesWorker() {
  try {
    const companies = yield call([companiesApi, companiesApi.getAllCompanies])
    yield put(fetchCompaniesSuccess(companies))
  } catch (error) {
    yield put(fetchCompaniesFailure(getApiErrorMessage(error, 'Unable to load companies right now.')))
  }
}

function* fetchCompanyDetailWorker(action) {
  try {
    const company = yield call([companiesApi, companiesApi.getCompanyById], action.payload)
    yield put(fetchCompanyDetailSuccess(company))
    action.meta?.deferred?.resolve(company)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to load the company details.')
    yield put(fetchCompanyDetailFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* createCompanyWorker(action) {
  try {
    const company = yield call([companiesApi, companiesApi.createCompany], action.payload)
    yield put(createCompanySuccess(company))
    action.meta?.deferred?.resolve(company)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to create the company.')
    yield put(createCompanyFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* updateCompanyWorker(action) {
  try {
    const company = yield call([companiesApi, companiesApi.updateCompany], action.payload.id, action.payload.payload)
    yield put(updateCompanySuccess(company))
    action.meta?.deferred?.resolve(company)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to update the company.')
    yield put(updateCompanyFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

function* deleteCompanyWorker(action) {
  try {
    yield call([companiesApi, companiesApi.deleteCompany], action.payload)
    yield put(deleteCompanySuccess(action.payload))
    action.meta?.deferred?.resolve(action.payload)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to remove the company.')
    yield put(deleteCompanyFailure(message))
    action.meta?.deferred?.reject(new Error(message))
  }
}

export default function* companiesSaga() {
  yield all([
    takeLatest(fetchCompanies.type, fetchCompaniesWorker),
    takeLatest(fetchCompanyDetail.type, fetchCompanyDetailWorker),
    takeLeading(createCompany.type, createCompanyWorker),
    takeLeading(updateCompany.type, updateCompanyWorker),
    takeLeading(deleteCompany.type, deleteCompanyWorker),
  ])
}
