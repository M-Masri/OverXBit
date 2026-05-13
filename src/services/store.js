import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import { overxApi } from './overxApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [overxApi.reducerPath]: overxApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(overxApi.middleware),
})