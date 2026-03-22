import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import authReducer from '../features/auth/authSlice'
import companiesReducer from '../features/companies/companiesSlice'
import usersReducer from '../features/users/usersSlice'
import vesselsReducer from '../features/vessels/vesselsSlice'
import crewMembersReducer from '../features/crew-members/crewMembersSlice'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    companies: companiesReducer,
    vessels: vesselsReducer,
    crewMembers: crewMembersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActionPaths: ['meta.deferred'],
      },
    }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)
