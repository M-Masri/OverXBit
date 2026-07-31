/** Trading contract capital and agreements are denominated in AED. */
export function formatAed(value) {
  const amount = Number(value || 0)
  const safe = Number.isFinite(amount) ? amount : 0
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe)

  return `AED ${formatted}`
}

export function formatSignedAed(value) {
  const amount = Number(value || 0)
  const safe = Number.isFinite(amount) ? amount : 0
  const absolute = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(safe))

  if (safe > 0) {
    return `+AED ${absolute}`
  }

  if (safe < 0) {
    return `−AED ${absolute}`
  }

  return `AED ${absolute}`
}
