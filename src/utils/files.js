import { API_BASE_URL } from '../services/overxApi'

export function isStorageFilePath(value) {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmed = value.trim()
  if (!trimmed || /^https?:\/\//i.test(trimmed)) {
    return false
  }

  return trimmed.includes('/') || /\.(png|jpe?g|pdf|webp|gif)$/i.test(trimmed)
}

export function resolveStorageFileUrl(path) {
  if (!path || typeof path !== 'string') {
    return null
  }

  const trimmed = path.trim()
  if (!trimmed) {
    return null
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  if (!isStorageFilePath(trimmed)) {
    return null
  }

  const apiOrigin = new URL(API_BASE_URL).origin
  const normalized = trimmed.replace(/^\/+/, '').replace(/^storage\//, '')

  return `${apiOrigin}/storage/${normalized}`
}

export function storageFileName(path) {
  if (!path) {
    return 'document'
  }

  const parts = String(path).split('/')
  return parts[parts.length - 1] || 'document'
}
