import { all } from 'redux-saga/effects'

import authSaga from '../features/auth/authSaga'
import companiesSaga from '../features/companies/companiesSaga'
import usersSaga from '../features/users/usersSaga'
import vesselsSaga from '../features/vessels/vesselsSaga'
import crewMembersSaga from '../features/crew-members/crewMembersSaga'

export default function* rootSaga() {
  yield all([authSaga(), usersSaga(), companiesSaga(), vesselsSaga(), crewMembersSaga()])
}
