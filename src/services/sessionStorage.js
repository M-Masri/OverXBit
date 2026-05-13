export const STORAGE_KEY = 'overxbit.portal.token'

export function getStoredToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(STORAGE_KEY) || ''
}

export function setStoredToken(token) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, token)
}

export function clearStoredToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}