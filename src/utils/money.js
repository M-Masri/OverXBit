/** Trading contract capital and agreements are denominated in AED. */
export function formatAed(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)
}

export function formatSignedAed(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(Number.isFinite(amount) ? amount : 0)
}
