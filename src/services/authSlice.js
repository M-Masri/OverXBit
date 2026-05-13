import { createSlice } from '@reduxjs/toolkit'
import { getStoredToken } from './sessionStorage'

const initialToken = getStoredToken()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: null,
    sessionReady: !initialToken,
  },
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token
      state.user = action.payload.user || null
      state.sessionReady = true
    },
    setUser(state, action) {
      state.user = action.payload || null
      state.sessionReady = true
    },
    setSessionReady(state, action) {
      state.sessionReady = action.payload
    },
    clearSession(state) {
      state.token = ''
      state.user = null
      state.sessionReady = true
    },
  },
})

export const { setCredentials, setUser, setSessionReady, clearSession } = authSlice.actions
export const selectAuth = (state) => state.auth
export const selectToken = (state) => state.auth.token
export const selectUser = (state) => state.auth.user
export const selectSessionReady = (state) => state.auth.sessionReady
export const selectIsAuthenticated = (state) => Boolean(state.auth.token)

export default authSlice.reducer