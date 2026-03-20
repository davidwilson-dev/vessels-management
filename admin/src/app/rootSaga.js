import { all } from 'redux-saga/effects'

import authSaga from '../features/auth/authSaga'
import usersSaga from '../features/users/usersSaga'

export default function* rootSaga() {
  yield all([authSaga(), usersSaga()])
}
