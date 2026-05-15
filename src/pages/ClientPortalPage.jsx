import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaArrowTrendUp,
  FaBitcoin,
  FaChartLine,
  FaChevronRight,
  FaClock,
  FaCreditCard,
  FaEye,
  FaEyeSlash,
  FaGlobe,
  FaLayerGroup,
  FaMoneyBillTransfer,
  FaShieldHalved,
  FaWaveSquare,
  FaUserLarge,
} from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import brandLogo from '../assets/OVERXBIT LOGO-04.png'
import { clearSession, selectToken, selectUser } from '../services/authSlice'
import {
  overxApi,
  useChangePasswordMutation,
  useCreatePortalCashoutDetailsMutation,
  useGetPortalDashboardQuery,
  useGetPortalHistoryQuery,
  useGetPortalMethodsQuery,
  useGetPortalPeriodsChartQuery,
  useGetPortalSinglePeriodChartQuery,
  useGetPortalPeriodsQuery,
  useGetPortalProfileQuery,
  useLogoutMutation,
  useRequestPeriodCashoutMutation,
  useRequestPeriodStoreMutation,
} from '../services/overxApi'
import { clearStoredToken } from '../services/sessionStorage'

const portalSections = [
  {
    slug: 'dashboard',
    label: 'Command Center',
    title: 'Portfolio pulse and contract activity',
    description: 'A single-screen overview of machines, balances, and client momentum.',
    icon: FaChartLine,
  },
  {
    slug: 'periods',
    label: 'Earning Periods',
    title: 'Closed cycles and pending client decisions',
    description: 'Track completed periods, request windows, and daily mining performance.',
    icon: FaLayerGroup,
  },
  {
    slug: 'history',
    label: 'Transfers Ledger',
    title: 'Cashouts, storage records, and request history',
    description: 'Surface all fund movements with quick status visibility.',
    icon: FaMoneyBillTransfer,
  },
  {
    slug: 'methods',
    label: 'Cashout Methods',
    title: 'Wallets and bank rails ready for payouts',
    description: 'Display saved payout methods and default settlement preferences.',
    icon: FaCreditCard,
  },
  {
    slug: 'profile',
    label: 'Client Profile',
    title: 'Identity, contracts, and account footprint',
    description: 'Present the client dossier and the active contract base in one place.',
    icon: FaUserLarge,
  },
]

const mapDots = [
  { top: '18%', left: '16%' },
  { top: '28%', left: '34%' },
  { top: '24%', left: '58%' },
  { top: '42%', left: '26%' },
  { top: '46%', left: '48%' },
  { top: '38%', left: '66%' },
  { top: '62%', left: '38%' },
  { top: '66%', left: '56%' },
  { top: '54%', left: '76%' },
]

function formatMoney(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)
}

function formatBtc(value) {
  const amount = Number(value || 0)
  return `${Number.isFinite(amount) ? amount.toFixed(8) : '0.00000000'} BTC`
}

function formatDate(value) {
  if (!value) {
    return 'Not available'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatDateTime(value) {
  if (!value) {
    return 'Not available'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function resolveSection(pathname) {
  const slug = pathname.split('/')[2] || 'dashboard'
  return portalSections.find((section) => section.slug === slug) || portalSections[0]
}

function getStatusTone(status) {
  if (status === 'completed' || status === 'paid' || status === 'stored') {
    return 'positive'
  }

  if (status === 'pending') {
    return 'warning'
  }

  return 'neutral'
}

function createActivityMatrix(payload) {
  const sourceItems =
    payload.periods || payload.transactions || payload.contracts || payload.methods || payload.storedEarnings || []

  return Array.from({ length: 35 }, (_, index) => {
    const source = sourceItems[index % Math.max(sourceItems.length || 1, 1)]
    const intensitySeed = Number(source?.id || index + 1)
    const intensity = (intensitySeed % 5) + 1

    return {
      id: `activity-${index}`,
      intensity,
    }
  })
}

function getOverviewCards(section, payload, user) {
  if (section.slug === 'dashboard') {
    const stats = payload.dashboard?.stats || {}
    const revenueToday =
      stats.revenue_today ?? stats.today_revenue ?? stats.total_revenue_today ?? 0

    return [
      { label: 'Stored BTC', value: formatBtc(stats.stored_balance_btc), hint: 'Current reserve', accent: true },
      { label: 'Stored Machines', value: String(stats.storing_machines || 0), hint: 'Reserved fleet' },
      { label: 'Revenue Today', value: formatMoney(revenueToday), hint: 'Today\'s generated revenue' },
      { label: 'Cashout Machines', value: String(stats.cashout_machines || 0), hint: 'Payout fleet' },
    ]
  }

  if (section.slug === 'periods') {
    const periods = payload.periods || []
    const totalBtcEarned = periods.reduce((sum, period) => sum + Number(period?.total_btc_earned || 0), 0)
    const totalRevenue = periods.reduce((sum, period) => sum + Number(period?.total_revenue || 0), 0)

    return [
      { label: 'Listed Periods', value: String(payload.periodsMeta?.total || periods.length || 0), hint: 'Visible in the ledger', accent: true },
      { label: 'Ready To Act', value: String(payload.pendingPeriods?.length || 0), hint: 'Client decision window' },
      { label: 'Total BTC Earned', value: formatBtc(totalBtcEarned), hint: 'Across fetched periods' },
      { label: 'Total Revenue', value: formatMoney(totalRevenue), hint: 'Across fetched periods' },
    ]
  }

  if (section.slug === 'history') {
    return [
      { label: 'Transactions', value: String(payload.transactionsMeta?.total || payload.transactions?.length || 0), hint: 'All request records', accent: true },
      { label: 'Cashouts', value: String(payload.cashoutsMeta?.total || payload.cashouts?.length || 0), hint: 'Payout events' },
      { label: 'Stored BTC', value: formatBtc(payload.storedMeta?.total_stored_btc), hint: 'Accumulated reserve' },
      { label: 'Stored Value', value: formatMoney(payload.storedMeta?.total_stored_revenue), hint: 'Revenue retained' },
    ]
  }

  if (section.slug === 'methods') {
    const methods = payload.methods || []
    return [
      { label: 'Saved Methods', value: String(methods.length), hint: 'Available payout rails', accent: true },
      { label: 'Crypto', value: String(methods.filter((method) => method.type === 'crypto').length), hint: 'Wallet endpoints' },
      { label: 'Bank', value: String(methods.filter((method) => method.type === 'bank').length), hint: 'Banking endpoints' },
      { label: 'Default', value: methods.find((method) => method.is_default)?.label || 'Not set', hint: 'Settlement priority' },
    ]
  }

  return [
    { label: 'Contracts', value: String(payload.contractsMeta?.total || payload.contracts?.length || 0), hint: 'Signed agreements', accent: true },
    { label: 'Total Machines', value: String(payload.profile?.total_machines || 0), hint: 'Client operating base' },
    { label: 'Storing', value: String(payload.profile?.current_storing_machines || 0), hint: 'Reserved fleet' },
    { label: 'Cashout', value: String(payload.profile?.current_cashout_machines || 0), hint: 'Payout fleet' },
  ]
}

function getInsightRows(section, payload, user) {
  if (section.slug === 'dashboard') {
    const stats = payload.dashboard?.stats || {}
    return [
      { label: 'Client', value: user?.email || payload.dashboard?.client?.email || 'Not available' },
      { label: 'Stored Revenue', value: formatMoney(stats.stored_balance_revenue) },
      { label: 'Total Cashed Out', value: formatMoney(stats.total_cashed_out) },
      { label: 'Pending Requests', value: String(stats.pending_requests || 0) },
    ]
  }

  if (section.slug === 'periods') {
    return (payload.periods || []).slice(0, 4).map((period) => ({
      label: `${formatDate(period.start_date)} - ${formatDate(period.end_date)}`,
      value: period.status || 'unknown',
      tone: getStatusTone(period.status),
    }))
  }

  if (section.slug === 'history') {
    return (payload.transactions || []).slice(0, 4).map((transaction) => ({
      label: `${transaction.type || 'transaction'} · ${formatDateTime(transaction.requested_at)}`,
      value: transaction.status || 'unknown',
      tone: getStatusTone(transaction.status),
    }))
  }

  if (section.slug === 'methods') {
    return (payload.methods || []).slice(0, 4).map((method) => ({
      label: method.label || 'Untitled method',
      value: method.type || 'method',
      tone: method.is_default ? 'positive' : 'neutral',
    }))
  }

  return (payload.contracts || []).slice(0, 4).map((contract) => ({
    label: `Contract #${contract.id}`,
    value: formatMoney(contract.amount),
  }))
}

function OverviewCard({ item }) {
  return (
    <div className={`portal-stat-card bg-[rgba(255,255,255,0.04)] ${item.accent ? 'portal-stat-card-accent' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="portal-stat-label">{item.label}</p>
          <p className="mt-3 portal-value-text">{item.value}</p>
        </div>
        <span className="portal-stat-icon">
          <FaArrowTrendUp />
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-400">{item.hint}</p>
    </div>
  )
}

function InsightList({ rows }) {
  return (
    <div className="space-y-3">
      {rows.length ? (
        rows.map((row, index) => (
          <div key={`${row.label}-${index}`} className="portal-insight-row">
            <span className="text-slate-300">{row.label}</span>
            <strong className={`portal-tone-${row.tone || 'neutral'}`}>{row.value}</strong>
          </div>
        ))
      ) : (
        <EmptyState title="No signals yet." detail="As soon as this section returns records, the quick insight list will populate." compact />
      )}
    </div>
  )
}

function ActivityBoard({ payload }) {
  const cells = createActivityMatrix(payload)

  return (
    <div className="portal-panel portal-analytic-card rounded-[1.9rem] p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="portal-subtitle">Signal Density</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Activity matrix</h3>
        </div>
        <div className="portal-chip">
          <FaWaveSquare className="text-[#2ABBAF]" />
          Live pattern
        </div>
      </div>

      <div className="portal-heatmap mt-6">
        {cells.map((cell) => (
          <span key={cell.id} className={`portal-heatmap-cell is-${cell.intensity}`} />
        ))}
      </div>
    </div>
  )
}

function CoverageBoard({ rows }) {
  return (
    <div className="portal-panel portal-analytic-card rounded-[1.9rem] p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="portal-subtitle">Network Reach</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Client coverage pulse</h3>
        </div>
        <div className="portal-chip">
          <FaGlobe className="text-[#2ABBAF]" />
          Routed view
        </div>
      </div>

      <div className="portal-map-shell mt-6">
        <div className="portal-map-outline" />
        {mapDots.map((dot, index) => (
          <span key={`${dot.top}-${dot.left}-${index}`} className="portal-map-dot" style={dot} />
        ))}
      </div>

      <div className="mt-6">
        <InsightList rows={rows} />
      </div>
    </div>
  )
}

function StatCard({ label, value, tone = 'default' }) {
  return (
    <div className={`portal-panel rounded-[1.75rem] p-5 ${tone === 'accent' ? 'portal-panel-accent' : ''}`}>
      <p className="portal-stat-label">{label}</p>
      <p className="mt-3 portal-value-text">{value}</p>
    </div>
  )
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.28em] text-[#2ABBAF]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
    </div>
  )
}

function EmptyState({ title, detail, compact = false }) {
  return (
    <div className={`rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.03] text-slate-300 ${compact ? 'p-4' : 'p-6'}`}>
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-400">{detail}</p>
    </div>
  )
}

function normalizeChartPoints(rawChart) {
  const source =
    (Array.isArray(rawChart) && rawChart) ||
    (Array.isArray(rawChart?.details) && rawChart.details) ||
    (Array.isArray(rawChart?.points) && rawChart.points) ||
    (Array.isArray(rawChart?.series) && rawChart.series) ||
    []

  if (!source.length && Array.isArray(rawChart?.labels) && Array.isArray(rawChart?.revenue)) {
    return rawChart.labels.map((label, index) => {
      const value = Number(rawChart.revenue[index] || 0)
      const btc = Number(rawChart?.btc?.[index] || 0)
      return {
        id: `point-${index}`,
        label: label || `P${index + 1}`,
        value: Number.isFinite(value) ? value : 0,
        btc: Number.isFinite(btc) ? btc : 0,
      }
    })
  }

  return source
    .map((entry, index) => {
      const label =
        entry?.label ||
        entry?.name ||
        entry?.period ||
        entry?.month ||
        entry?.date ||
        (entry?.start_date ? formatDate(entry.start_date) : `P${index + 1}`)
      const value = Number(
        entry?.revenue ??
          entry?.total_revenue ??
          entry?.amount ??
          entry?.value ??
          entry?.y ??
          0
      )
      const btc = Number(entry?.btc ?? entry?.total_btc_earned ?? entry?.btc_amount ?? 0)

      return {
        id: entry?.id || `point-${index}`,
        label,
        value: Number.isFinite(value) ? value : 0,
        btc: Number.isFinite(btc) ? btc : 0,
      }
    })
    .filter((point) => point.label)
}

function roundUpNice(value) {
  if (!value || value <= 0) {
    return 1
  }

  const power = Math.floor(Math.log10(value))
  const base = 10 ** power
  const step = base / 2

  return Math.ceil(value / step) * step
}

function buildMonthlyStatusSeries(rawChart) {
  const details = Array.isArray(rawChart?.details) ? rawChart.details : []

  if (details.length) {
    const byLabel = new Map()

    details.forEach((entry, index) => {
      const fallbackLabel = entry?.start_date
        ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(entry.start_date))
        : `P${index + 1}`
      const label = entry?.label || fallbackLabel
      const status = String(entry?.status || '').toLowerCase()
      const revenue = Number(entry?.total_revenue ?? entry?.revenue ?? 0)
      const amount = Number.isFinite(revenue) ? revenue : 0

      if (!byLabel.has(label)) {
        byLabel.set(label, {
          id: `series-${index}`,
          label,
          cashedOut: 0,
          stored: 0,
        })
      }

      const row = byLabel.get(label)

      if (status === 'cashed_out' || status === 'paid') {
        row.cashedOut += amount
      } else {
        row.stored += amount
      }
    })

    return Array.from(byLabel.values())
  }

  if (Array.isArray(rawChart?.labels) && Array.isArray(rawChart?.revenue)) {
    return rawChart.labels.map((label, index) => ({
      id: `series-${index}`,
      label: label || `P${index + 1}`,
      cashedOut: Number(rawChart?.cashed_out?.[index] || 0),
      stored: Number(rawChart.revenue[index] || 0),
    }))
  }

  const points = normalizeChartPoints(rawChart)
  return points.map((point, index) => ({
    id: `series-${index}`,
    label: point.label || `P${index + 1}`,
    cashedOut: 0,
    stored: Number(point.value || 0),
  }))
}

function resolveDefaultPeriodId(rawMonthlyChart, dashboardPayload, periodsList = []) {
  const dashboardCandidates = [
    dashboardPayload?.current_period?.id,
    dashboardPayload?.latest_period?.id,
    dashboardPayload?.period?.id,
    dashboardPayload?.stats?.current_period_id,
    dashboardPayload?.stats?.latest_period_id,
  ]

  for (const candidate of dashboardCandidates) {
    const numeric = Number(candidate)
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric
    }
  }

  const details = Array.isArray(rawMonthlyChart?.details) ? rawMonthlyChart.details : []

  const detailRows = details
    .map((entry) => {
      const id = Number(entry?.id)
      const dateSeed = entry?.end_date || entry?.start_date || entry?.date || null
      const stamp = dateSeed ? new Date(dateSeed).getTime() : Number.NaN

      return {
        id,
        stamp: Number.isFinite(stamp) ? stamp : Number.NEGATIVE_INFINITY,
      }
    })
    .filter((row) => Number.isFinite(row.id) && row.id > 0)

  if (detailRows.length) {
    detailRows.sort((a, b) => {
      if (b.stamp !== a.stamp) {
        return b.stamp - a.stamp
      }

      return b.id - a.id
    })
    return detailRows[0].id
  }

  const periodsRows = (Array.isArray(periodsList) ? periodsList : [])
    .map((entry) => {
      const id = Number(entry?.id)
      const dateSeed = entry?.end_date || entry?.start_date || entry?.date || null
      const stamp = dateSeed ? new Date(dateSeed).getTime() : Number.NaN

      return {
        id,
        stamp: Number.isFinite(stamp) ? stamp : Number.NEGATIVE_INFINITY,
      }
    })
    .filter((row) => Number.isFinite(row.id) && row.id > 0)

  if (periodsRows.length) {
    periodsRows.sort((a, b) => {
      if (b.stamp !== a.stamp) {
        return b.stamp - a.stamp
      }

      return b.id - a.id
    })
    return periodsRows[0].id
  }

  return null
}

function buildDailyRevenueSeries(rawChart) {
  const labels = Array.isArray(rawChart?.labels) ? rawChart.labels : []
  const dailyRevenue = Array.isArray(rawChart?.daily_revenue) ? rawChart.daily_revenue : []

  if (!labels.length || !dailyRevenue.length) {
    return []
  }

  return labels.map((label, index) => {
    const value = Number(dailyRevenue[index] || 0)
    return {
      id: `daily-${index}`,
      label,
      value: Number.isFinite(value) ? value : 0,
    }
  })
}

function getPeriodOptionLabel(period) {
  if (!period) {
    return 'Unknown period'
  }

  const start = formatDate(period.start_date)
  const end = formatDate(period.end_date)
  return `${start} - ${end}`
}

function formatStatusLabel(status) {
  const raw = String(status || 'unknown').toLowerCase()
  if (raw === 'cashed_out') {
    return 'Cashed Out'
  }

  if (raw === 'request_pending') {
    return 'Request Pending'
  }

  return raw.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function buildSmoothLinePath(points) {
  if (!points.length) {
    return ''
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  const tension = 0.2
  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] || points[index]
    const current = points[index]
    const next = points[index + 1]
    const afterNext = points[index + 2] || next

    const cp1x = current.x + (next.x - previous.x) * tension
    const cp1y = current.y + (next.y - previous.y) * tension
    const cp2x = next.x - (afterNext.x - current.x) * tension
    const cp2y = next.y - (afterNext.y - current.y) * tension

    path += ` C ${Math.round(cp1x)} ${Math.round(cp1y)}, ${Math.round(cp2x)} ${Math.round(cp2y)}, ${next.x} ${next.y}`
  }

  return path
}

function DashboardChartSection({ chartQuery, onRetry, className = 'mt-6' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const series = buildMonthlyStatusSeries(chartQuery.data?.chart)
  const totalCashedOut = series.reduce((sum, point) => sum + Number(point.cashedOut || 0), 0)
  const totalStored = series.reduce((sum, point) => sum + Number(point.stored || 0), 0)
  const maxValue = series.reduce((max, point) => Math.max(max, Number(point.cashedOut || 0), Number(point.stored || 0)), 0)
  const yMax = roundUpNice(maxValue || 1)
  const tickCount = 4

  const chartWidth = 920
  const chartHeight = 340
  const paddingTop = 24
  const paddingRight = 20
  const paddingBottom = 56
  const paddingLeft = 64
  const plotWidth = chartWidth - paddingLeft - paddingRight
  const plotHeight = chartHeight - paddingTop - paddingBottom
  const groupWidth = series.length ? plotWidth / series.length : plotWidth
  const groupGap = Math.max(4, Math.round(groupWidth * 0.1))
  const barWidth = Math.min(36, Math.max(12, Math.round((groupWidth - groupGap - 8) / 2)))

  const bars = series.map((point, index) => {
    const groupX = paddingLeft + index * groupWidth
    const cashValue = Number(point.cashedOut || 0)
    const storeValue = Number(point.stored || 0)
    const cashHeight = Math.max(0, Math.round((cashValue / yMax) * plotHeight))
    const storeHeight = Math.max(0, Math.round((storeValue / yMax) * plotHeight))
    const barGroupWidth = barWidth * 2 + groupGap
    const startX = groupX + (groupWidth - barGroupWidth) / 2
    const cashX = Math.round(startX)
    const storeX = Math.round(startX + barWidth + groupGap)

    return {
      ...point,
      cashX,
      storeX,
      cashY: paddingTop + plotHeight - cashHeight,
      storeY: paddingTop + plotHeight - storeHeight,
      cashHeight,
      storeHeight,
      centerX: Math.round(groupX + groupWidth / 2),
    }
  })

  const yTicks = Array.from({ length: tickCount + 1 }, (_, index) => {
    const ratio = index / tickCount
    const value = yMax * (1 - ratio)
    const y = Math.round(paddingTop + plotHeight * ratio)

    return {
      value,
      y,
    }
  })

  const hoveredBar = hoveredPoint !== null ? bars[hoveredPoint.index] : null
  const hoveredLabel = hoveredPoint?.series === 'cashout' ? 'Cashed Out' : 'Stored'
  const hoveredValue =
    hoveredBar && hoveredPoint
      ? hoveredPoint.series === 'cashout'
        ? hoveredBar.cashedOut
        : hoveredBar.stored
      : 0

  return (
    <section className={className}>
      <div className="rounded-[1.75rem]  p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#2ABBAF]">Cycle Chart</p>
            <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Earning periods performance</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">Grouped monthly comparison from /client/earning-periods/chart.</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-sm bg-[#f59e0b]" />Cashed Out ($)</span>
              <span className="inline-flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-sm bg-[#2ABBAF]" />Stored ($)</span>
            </div>
          </div>
          <div className="portal-chip">
            <FaChartLine className="text-[#2ABBAF]" />
            Total {formatMoney(totalCashedOut + totalStored)}
          </div>
        </div>

        {chartQuery.isLoading || chartQuery.isFetching ? (
          <div className="portal-panel mt-6 rounded-[1.45rem] p-8 sm:p-10">
            <div className="portal-loader" />
            <p className="mt-5 text-sm text-slate-300">Loading chart from periods endpoint.</p>
          </div>
        ) : null}

        {!chartQuery.isLoading && !chartQuery.isFetching && chartQuery.error ? (
          <div className="mt-6 rounded-[1.45rem] border border-red-400/30 bg-red-500/10 p-6">
            <p className="text-sm text-red-200">{getQueryErrorMessage(chartQuery.error)}</p>
            <button type="button" onClick={onRetry} className="portal-secondary-button mt-4">Retry chart</button>
          </div>
        ) : null}

        {!chartQuery.isLoading && !chartQuery.isFetching && !chartQuery.error ? (
          series.length ? (
            <div className="relative mt-7 rounded-[1.3rem] border border-white/12 bg-[rgba(255,255,255,0.04)] p-3 sm:p-4">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-[320px] w-full"
              >
                {yTicks.map((tick) => (
                  <g key={`tick-${tick.y}`}>
                    <line
                      x1={paddingLeft}
                      y1={tick.y}
                      x2={paddingLeft + plotWidth}
                      y2={tick.y}
                      stroke="rgba(148,163,184,0.2)"
                      strokeDasharray="4 6"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={tick.y + 4}
                      fill="#94a3b8"
                      fontSize="11"
                      textAnchor="end"
                    >
                      {formatMoney(tick.value)}
                    </text>
                  </g>
                ))}

                {bars.map((bar, index) => (
                  <g key={`bar-${bar.id}`}>
                    <rect
                      x={bar.cashX}
                      y={bar.cashY}
                      width={barWidth}
                      height={bar.cashHeight}
                      rx="4"
                      fill="#f59e0b"
                      opacity={
                        hoveredPoint
                          ? hoveredPoint.index === index && hoveredPoint.series === 'cashout'
                            ? 1
                            : 0.35
                          : 1
                      }
                      onMouseEnter={() => setHoveredPoint({ index, series: 'cashout' })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <rect
                      x={bar.storeX}
                      y={bar.storeY}
                      width={barWidth}
                      height={bar.storeHeight}
                      rx="4"
                      fill="#2ABBAF"
                      opacity={
                        hoveredPoint
                          ? hoveredPoint.index === index && hoveredPoint.series === 'stored'
                            ? 1
                            : 0.35
                          : 1
                      }
                      onMouseEnter={() => setHoveredPoint({ index, series: 'stored' })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}

                {hoveredBar ? (
                  <g>
                    <line
                      x1={hoveredBar.centerX}
                      y1={paddingTop}
                      x2={hoveredBar.centerX}
                      y2={paddingTop + plotHeight}
                      stroke="rgba(148,163,184,0.55)"
                      strokeDasharray="6 6"
                    />
                  </g>
                ) : null}

                {bars.map((point) => (
                  <g key={`point-${point.id}`}>
                    <text
                      x={point.centerX}
                      y={paddingTop + plotHeight + 24}
                      fill="#94a3b8"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {String(point.label).slice(0, 10)}
                    </text>
                  </g>
                ))}

              </svg>

              {hoveredBar ? (
                <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-[#7ad7cf]/45 bg-[#061d22]/92 px-3 py-2 shadow-[0_8px_24px_-10px_rgba(42,187,175,0.6)]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#7ad7cf]">{hoveredBar.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{hoveredLabel}: {formatMoney(hoveredValue)}</p>
                </div>
              ) : null}

              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {series.map((point) => (
                  <div key={`meta-${point.id}`} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-xs">
                    <span className="truncate text-slate-400" title={point.label}>{point.label}</span>
                    <span className="font-semibold text-white" title={`${formatMoney(point.cashedOut)} | ${formatMoney(point.stored)}`}>
                      {formatMoney(point.cashedOut + point.stored)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState title="No chart points yet." detail="Chart endpoint responded without series values." compact />
            </div>
          )
        ) : null}
      </div>
    </section>
  )
}

function SinglePeriodLineChartSection({
  chartQuery,
  periodId,
  periods = [],
  onSelectPeriod,
  onRetry,
  className = 'mt-6',
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const hasPeriodId = Number.isFinite(Number(periodId)) && Number(periodId) > 0
  const points = buildDailyRevenueSeries(chartQuery.data?.chart)
  const maxValue = points.reduce((max, point) => Math.max(max, Number(point.value || 0)), 0)
  const yMax = roundUpNice(maxValue || 1)

  const chartWidth = 920
  const chartHeight = 340
  const paddingTop = 28
  const paddingRight = 28
  const paddingBottom = 56
  const paddingLeft = 64
  const plotWidth = chartWidth - paddingLeft - paddingRight
  const plotHeight = chartHeight - paddingTop - paddingBottom
  const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0

  const linePoints = points.map((point, index) => {
    const x = Math.round(paddingLeft + index * stepX)
    const y = Math.round(paddingTop + plotHeight - (Number(point.value || 0) / yMax) * plotHeight)

    return {
      ...point,
      x,
      y,
      shortLabel: formatDate(point.label),
    }
  })

  const linePath = buildSmoothLinePath(linePoints)
  const areaPath =
    linePoints.length > 1
      ? `${linePath} L ${linePoints[linePoints.length - 1].x} ${paddingTop + plotHeight} L ${linePoints[0].x} ${paddingTop + plotHeight} Z`
      : ''

  const hoveredPoint = hoveredIndex !== null ? linePoints[hoveredIndex] : null

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4
    const value = yMax * (1 - ratio)
    const y = Math.round(paddingTop + plotHeight * ratio)
    return { value, y }
  })

  return (
    <section className={className}>
      <div className="rounded-[1.75rem] p-6  sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#2ABBAF]">Single Period Trend</p>
            <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Daily revenue line</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
              Daily line view from /client/earning-periods/{'{id}'}/chart.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="period-select" className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Select Period
            </label>
            <select
              id="period-select"
              value={periodId || ''}
              onChange={(event) => onSelectPeriod?.(event.target.value ? Number(event.target.value) : null)}
              className="rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
            >
              <option value="">Choose period</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  #{period.id} - {getPeriodOptionLabel(period)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!hasPeriodId ? (
          <div className="mt-6">
            <EmptyState title="No period selected yet." detail="No period ID was found to load the single period chart endpoint." compact />
          </div>
        ) : null}

        {hasPeriodId && (chartQuery.isLoading || chartQuery.isFetching) ? (
          <div className="portal-panel mt-6 rounded-[1.45rem] p-8 sm:p-10">
            <div className="portal-loader" />
            <p className="mt-5 text-sm text-slate-300">Loading single period line chart.</p>
          </div>
        ) : null}

        {hasPeriodId && !chartQuery.isLoading && !chartQuery.isFetching && chartQuery.error ? (
          <div className="mt-6 rounded-[1.45rem] border border-red-400/30 bg-red-500/10 p-6">
            <p className="text-sm text-red-200">{getQueryErrorMessage(chartQuery.error)}</p>
            <button type="button" onClick={onRetry} className="portal-secondary-button mt-4">Retry line chart</button>
          </div>
        ) : null}

        {hasPeriodId && !chartQuery.isLoading && !chartQuery.isFetching && !chartQuery.error ? (
          linePoints.length ? (
            <div className="relative mt-7 rounded-[1.3rem] border border-white/12 bg-[rgba(255,255,255,0.04)] p-3 sm:p-4">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-[320px] w-full">
                <defs>
                  <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(176,108,255,0.22)" />
                    <stop offset="100%" stopColor="rgba(93,134,255,0.03)" />
                  </linearGradient>
                </defs>

                {yTicks.map((tick) => (
                  <g key={`line-tick-${tick.y}`}>
                    <line
                      x1={paddingLeft}
                      y1={tick.y}
                      x2={paddingLeft + plotWidth}
                      y2={tick.y}
                      stroke="rgba(148,163,184,0.2)"
                      strokeDasharray="4 6"
                    />
                    <text x={paddingLeft - 10} y={tick.y + 4} fill="#94a3b8" fontSize="11" textAnchor="end">
                      {formatMoney(tick.value)}
                    </text>
                  </g>
                ))}

                {areaPath ? <path d={areaPath} fill="url(#lineFill)" /> : null}
                {linePath ? <path d={linePath} fill="none" stroke="#2ABBAF" strokeWidth="3" strokeLinecap="round" /> : null}

                {linePoints.map((point, index) => (
                  <g key={point.id}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={hoveredIndex === index ? 5 : 4}
                      fill="#2ABBAF"
                      stroke="#071321"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                    {index % Math.max(1, Math.ceil(linePoints.length / 7)) === 0 || index === linePoints.length - 1 ? (
                      <text
                        x={point.x}
                        y={paddingTop + plotHeight + 24}
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        {String(point.label).slice(5)}
                      </text>
                    ) : null}
                  </g>
                ))}
              </svg>

              {hoveredPoint ? (
                <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-[#7ad7cf]/45 bg-[#061d22]/92 px-3 py-2 shadow-[0_8px_24px_-10px_rgba(42,187,175,0.6)]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#7ad7cf]">{hoveredPoint.shortLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-white">Revenue: {formatMoney(hoveredPoint.value)}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState title="No line points yet." detail="Single period endpoint responded without daily revenue values." compact />
            </div>
          )
        ) : null}
      </div>
    </section>
  )
}

function DashboardPeriodsTable({ periods }) {
  const rows = Array.isArray(periods) ? periods.slice(0, 8) : []

  return (
    <section className="portal-panel rounded-[1.45rem] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="portal-subtitle">Data Table</p>
          <h3 className="mt-1 text-xl font-semibold text-white">Recent periods</h3>
        </div>
        <span className="portal-chip">{rows.length} rows</span>
      </div>

      {rows.length ? (
        <div className="portal-table-shell mt-4">
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Status</th>
                <th>Decision</th>
                <th>BTC Earned</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((period) => (
                <tr key={period.id}>
                  <td>{formatDate(period.start_date)} - {formatDate(period.end_date)}</td>
                  <td><span className="portal-badge">{formatStatusLabel(period.status)}</span></td>
                  <td>{period.client_decision || 'pending'}</td>
                  <td>{formatBtc(period.total_btc_earned)}</td>
                  <td>{formatMoney(period.total_revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState title="No periods yet." detail="The table will populate once periods are available." compact />
        </div>
      )}
    </section>
  )
}

function DashboardView({ payload }) {
  const dashboard = payload.dashboard
  const stats = dashboard?.stats || {}
  const client = dashboard?.client

  return (
    // <div className="space-y-6">
    //   {/* <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    //     <StatCard label="Stored Balance" value={formatBtc(stats.stored_balance_btc)} tone="accent" />
    //     <StatCard label="Stored Revenue" value={formatMoney(stats.stored_balance_revenue)} />
    //     <StatCard label="Total Revenue" value={formatMoney(stats.total_revenue)} />
    //     <StatCard label="Total Cashed Out" value={formatMoney(stats.total_cashed_out)} />
    //   </div>

    //   <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
    //     <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
    //       <div className="flex items-center justify-between gap-4">
    //         <div>
    //           <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Client Snapshot</p>
    //           <h3 className="mt-3 text-2xl font-semibold text-white">{client?.name || 'Client overview'}</h3>
    //         </div>
    //         <div className="portal-chip">
    //           <FaShieldHalved className="text-[#2ABBAF]" />
    //           Sanctum Connected
    //         </div>
    //       </div>

    //       <div className="mt-8 grid gap-4 md:grid-cols-2">
    //         <div className="portal-metric-block"><span>Total Machines</span><strong>{stats.total_machines || 0}</strong></div>
    //         <div className="portal-metric-block"><span>Storing Machines</span><strong>{stats.storing_machines || 0}</strong></div>
    //         <div className="portal-metric-block"><span>Cashout Machines</span><strong>{stats.cashout_machines || 0}</strong></div>
    //         <div className="portal-metric-block"><span>Pending Requests</span><strong>{stats.pending_requests || 0}</strong></div>
    //       </div>
    //     </div>

    //     <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
    //       <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Action Window</p>
    //       <div className="mt-6 space-y-4">
    //         <div className="portal-list-row"><span>Pending Periods</span><strong>{stats.pending_periods || 0}</strong></div>
    //         <div className="portal-list-row"><span>Total BTC Earned</span><strong>{formatBtc(stats.total_btc_earned)}</strong></div>
    //         <div className="portal-list-row"><span>Client Email</span><strong>{client?.email || 'Not available'}</strong></div>
    //         <div className="portal-list-row"><span>Phone</span><strong>{client?.phone || 'Not available'}</strong></div>
    //       </div>
    //     </div>
    //   </div> */}
    // </div>
    <></>
  )
}

function PeriodsView({ payload, onRequestCashout, onRequestStore, actionState }) {
  const periods = payload.periods || []
  const pendingPeriods = payload.pendingPeriods || []

  return (
    <div className="space-y-6">
      <div className="portal-panel rounded-[1.9rem] p-6 sm:p-4" style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Cycle Monitor</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Earning periods</h3>
          </div>
          <div className="portal-chip"><FaClock className="text-[#2ABBAF]" />{pendingPeriods.length} ready for action</div>
        </div>

        <div className="mt-6 space-y-4">
          {periods.length ? (
            periods.map((period) => (
              <div key={period.id} className="portal-table-row">
                <div>
                  <p className="text-sm font-semibold text-white">{formatDate(period.start_date)} <span className="text-slate-500">to</span> {formatDate(period.end_date)}</p>
                  <p className="mt-1 text-sm text-slate-400">{period.days_count} days · Decision: {period.client_decision || 'pending'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">BTC Earned</p>
                  <p className="mt-1 font-semibold text-white">{formatBtc(period.total_btc_earned)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Revenue</p>
                  <p className="mt-1 font-semibold text-white">{formatMoney(period.total_revenue)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {String(period?.status || '').toLowerCase() === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onRequestCashout(period.id)}
                        disabled={actionState.loading}
                        className="portal-secondary-button"
                      >
                        {actionState.loading && actionState.type === 'cashout' && actionState.periodId === period.id ? 'Sending...' : 'Cashout'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestStore(period.id)}
                        disabled={actionState.loading}
                        className="portal-secondary-button"
                      >
                        {actionState.loading && actionState.type === 'store' && actionState.periodId === period.id ? 'Sending...' : 'Store'}
                      </button>
                    </div>
                  ) : (
                    <span className="portal-badge">{period.status || 'unknown'}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="No earning periods returned yet." detail="Once the API starts returning cycles, they will appear here." />
          )}
        </div>
      </div>
    </div>
  )
}

function HistoryView({ payload }) {
  const transactions = payload.transactions || []
  const cashouts = payload.cashouts || []
  const storedEarnings = payload.storedEarnings || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Transactions" value={String(payload.transactionsMeta?.total || transactions.length || 0)} tone="accent" />
        <StatCard label="Cashouts" value={String(payload.cashoutsMeta?.total || cashouts.length || 0)} />
        <StatCard label="Stored BTC" value={formatBtc(payload.storedMeta?.total_stored_btc)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transactions</p>
          <div className="mt-5 space-y-4">
            {transactions.length ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="portal-table-row portal-table-row-compact">
                  <div>
                    <p className="font-semibold text-white">{transaction.type || 'transaction'}</p>
                    <p className="mt-1 text-sm text-slate-400">Requested {formatDateTime(transaction.requested_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">BTC</p>
                    <p className="mt-1 font-semibold text-white">{formatBtc(transaction.btc_amount)}</p>
                  </div>
                  <span className="portal-badge">{transaction.status || 'unknown'}</span>
                </div>
              ))
            ) : (
              <EmptyState title="No transaction history yet." detail="Requests will surface here once the client starts moving balances." />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Cashouts</p>
            <div className="mt-5 space-y-4">
              {cashouts.length ? (
                cashouts.map((cashout) => (
                  <div key={cashout.id} className="portal-list-row"><span>{formatDate(cashout.date)}</span><strong>{formatMoney(cashout.amount)}</strong></div>
                ))
              ) : (
                <EmptyState title="No cashout records yet." detail="Completed payouts and receipts will be listed here." compact />
              )}
            </div>
          </div>

          <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Stored Earnings</p>
            <div className="mt-5 space-y-4">
              {storedEarnings.length ? (
                storedEarnings.map((entry) => (
                  <div key={entry.id} className="portal-list-row"><span>{formatDateTime(entry.stored_at)}</span><strong>{formatBtc(entry.btc_amount)}</strong></div>
                ))
              ) : (
                <EmptyState title="No stored earnings yet." detail="Stored balances will appear here once a period is kept in BTC." compact />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MethodsView({ payload }) {
  const methods = payload.methods || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Saved Methods" value={String(methods.length)} tone="accent" />
        <StatCard label="Default Method" value={methods.find((method) => method.is_default)?.label || 'Not set'} />
        <StatCard label="Crypto Methods" value={String(methods.filter((method) => method.type === 'crypto').length)} />
      </div>

      <div className="portal-panel rounded-[1.9rem] p-6 sm:p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Cashout Details</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {methods.length ? (
            methods.map((method) => (
              <div key={method.id} className="portal-method-card">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="max-w-[11rem] truncate text-lg font-semibold text-white sm:max-w-[16rem]" title={method.label || 'Untitled method'}>
                      {method.label || 'Untitled method'}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{method.type === 'bank' ? 'Bank transfer' : 'Crypto wallet'}</p>
                  </div>
                  {method.is_default ? <span className="portal-badge">default</span> : null}
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  {method.type === 'bank' ? (
                    <>
                      <div className="portal-list-row"><span>Account Holder</span><strong>{method.account_holder || 'Not set'}</strong></div>
                      <div className="portal-list-row"><span>Bank</span><strong>{method.bank_name || 'Not set'}</strong></div>
                      <div className="portal-list-row"><span>IBAN</span><strong>{method.iban || 'Not set'}</strong></div>
                    </>
                  ) : (
                    <>
                      <div className="portal-list-row"><span>Network</span><strong>{method.crypto_network || 'Not set'}</strong></div>
                      <div className="portal-list-row flex-wrap gap-2">
                        <span>Wallet</span>
                        <strong className="max-w-[11rem] truncate text-right sm:max-w-[16rem]" title={method.crypto_wallet_address || 'Not set'}>
                          {method.crypto_wallet_address || 'Not set'}
                        </strong>
                      </div>
                      <div className="portal-list-row"><span>Currency</span><strong>{method.currency?.code || 'Not set'}</strong></div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2">
              <EmptyState title="No payout methods returned yet." detail="Saved wallets and bank accounts will render here as soon as the endpoint is live." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileView({ payload }) {
  const profile = payload.profile
  const contracts = payload.contracts || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Contracts" value={String(payload.contractsMeta?.total || contracts.length || 0)} tone="accent" />
        <StatCard label="Total Machines" value={String(profile?.total_machines || 0)} />
        <StatCard label="Current Storing" value={String(profile?.current_storing_machines || 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Client Identity</p>
          <div className="mt-6 space-y-4">
            <div className="portal-list-row"><span>Name</span><strong>{profile?.name || 'Not available'}</strong></div>
            <div className="portal-list-row"><span>Email</span><strong>{profile?.email || 'Not available'}</strong></div>
            <div className="portal-list-row"><span>Phone</span><strong>{profile?.phone || 'Not available'}</strong></div>
            <div className="portal-list-row"><span>Passport</span><strong>{profile?.passport || 'Not available'}</strong></div>
            <div className="portal-list-row"><span>Created</span><strong>{formatDateTime(profile?.created_at)}</strong></div>
          </div>
        </div>

        <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Contracts</p>
          <div className="mt-6 space-y-4">
            {contracts.length ? (
              contracts.map((contract) => (
                <div key={contract.id} className="portal-table-row">
                  <div>
                    <p className="font-semibold text-white">Contract #{contract.id}</p>
                    <p className="mt-1 text-sm text-slate-400">{formatDate(contract.start_date)} to {formatDate(contract.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Amount</p>
                    <p className="mt-1 font-semibold text-white">{formatMoney(contract.amount)}</p>
                  </div>
                  <a href={contract.file_url || '#'} target="_blank" rel="noreferrer" className="portal-inline-link">
                    Open file
                    <FaArrowRight />
                  </a>
                </div>
              ))
            ) : (
              <EmptyState title="No contracts returned yet." detail="Uploaded agreements will appear here with direct file links." />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentRenderer({ section, payload, onRequestCashout, onRequestStore, actionState }) {
  if (section.slug === 'dashboard') {
    return <DashboardView payload={payload} />
  }

  if (section.slug === 'periods') {
    return (
      <PeriodsView
        payload={payload}
        onRequestCashout={onRequestCashout}
        onRequestStore={onRequestStore}
        actionState={actionState}
      />
    )
  }

  if (section.slug === 'history') {
    return <HistoryView payload={payload} />
  }

  if (section.slug === 'methods') {
    return <MethodsView payload={payload} />
  }

  return <ProfileView payload={payload} />
}

function getQueryErrorMessage(error) {
  return error?.data?.message || error?.message || 'Unable to load this section right now.'
}

const initialPasswordForm = {
  current_password: '',
  password: '',
  password_confirmation: '',
}

const initialCashoutDetailsForm = {
  label: '',
  is_default: false,
  account_holder: '',
  bank_name: '',
  swift_code: '',
  routing_number: '',
  iban: '',
  crypto_wallet_address: '',
  crypto_network: '',
  currency_id: '',
}

function ClientPortalPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const token = useSelector(selectToken)
  const activeSection = resolveSection(location.pathname)
  const [logoutRequest] = useLogoutMutation()
  const [changePasswordRequest] = useChangePasswordMutation()
  const [createPortalCashoutDetails] = useCreatePortalCashoutDetailsMutation()
  const [requestPeriodCashout] = useRequestPeriodCashoutMutation()
  const [requestPeriodStore] = useRequestPeriodStoreMutation()
  const [periodActionState, setPeriodActionState] = useState({ loading: false, type: '', periodId: null })
  const [periodStatusOverrides, setPeriodStatusOverrides] = useState({})
  const [periodActionError, setPeriodActionError] = useState('')
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm)
  const [isCashoutDetailsModalOpen, setIsCashoutDetailsModalOpen] = useState(false)
  const [cashoutDetailsType, setCashoutDetailsType] = useState('bank')
  const [cashoutDetailsSubmitting, setCashoutDetailsSubmitting] = useState(false)
  const [cashoutDetailsError, setCashoutDetailsError] = useState('')
  const [cashoutDetailsSuccess, setCashoutDetailsSuccess] = useState('')
  const [cashoutDetailsForm, setCashoutDetailsForm] = useState(initialCashoutDetailsForm)
  const [passwordVisibility, setPasswordVisibility] = useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  })
  const [selectedPeriodId, setSelectedPeriodId] = useState(null)
  const dashboardQuery = useGetPortalDashboardQuery(undefined, { skip: activeSection.slug !== 'dashboard' })
  const periodsChartQuery = useGetPortalPeriodsChartQuery(undefined, { skip: activeSection.slug !== 'dashboard' || !token })
  const dashboardPeriodsQuery = useGetPortalPeriodsQuery(undefined, {
    skip: activeSection.slug !== 'dashboard' || !token,
  })
  const defaultPeriodId = useMemo(
    () =>
      resolveDefaultPeriodId(
        periodsChartQuery.data?.chart,
        dashboardQuery.data?.dashboard,
        dashboardPeriodsQuery.data?.periods
      ),
    [periodsChartQuery.data?.chart, dashboardQuery.data?.dashboard, dashboardPeriodsQuery.data?.periods]
  )
  const periodOptions = useMemo(() => {
    const rows = Array.isArray(dashboardPeriodsQuery.data?.periods) ? dashboardPeriodsQuery.data.periods : []
    return [...rows].sort((a, b) => {
      const aDate = new Date(a?.end_date || a?.start_date || 0).getTime()
      const bDate = new Date(b?.end_date || b?.start_date || 0).getTime()
      if (bDate !== aDate) {
        return bDate - aDate
      }

      return Number(b?.id || 0) - Number(a?.id || 0)
    })
  }, [dashboardPeriodsQuery.data?.periods])

  useEffect(() => {
    if (selectedPeriodId) {
      const stillExists = periodOptions.some((period) => Number(period.id) === Number(selectedPeriodId))
      if (!stillExists) {
        setSelectedPeriodId(defaultPeriodId || null)
      }
      return
    }

    if (defaultPeriodId) {
      setSelectedPeriodId(defaultPeriodId)
    }
  }, [defaultPeriodId, periodOptions, selectedPeriodId])

  const singlePeriodChartQuery = useGetPortalSinglePeriodChartQuery(selectedPeriodId, {
    skip: activeSection.slug !== 'dashboard' || !token || !selectedPeriodId,
  })
  const periodsQuery = useGetPortalPeriodsQuery(undefined, { skip: activeSection.slug !== 'periods' })
  const historyQuery = useGetPortalHistoryQuery(undefined, { skip: activeSection.slug !== 'history' })
  const methodsQuery = useGetPortalMethodsQuery(undefined, { skip: activeSection.slug !== 'methods' })
  const profileQuery = useGetPortalProfileQuery(undefined, { skip: activeSection.slug !== 'profile' })

  const activeQuery = useMemo(() => {
    if (activeSection.slug === 'dashboard') {
      return dashboardQuery
    }

    if (activeSection.slug === 'periods') {
      return periodsQuery
    }

    if (activeSection.slug === 'history') {
      return historyQuery
    }

    if (activeSection.slug === 'methods') {
      return methodsQuery
    }

    return profileQuery
  }, [activeSection.slug, dashboardQuery, historyQuery, methodsQuery, periodsQuery, profileQuery])

  const payload = activeQuery.data || {}
  const loading = activeQuery.isLoading || activeQuery.isFetching
  const error = activeQuery.error ? getQueryErrorMessage(activeQuery.error) : ''
  const payloadWithPeriodOverrides = useMemo(() => {
    if (!payload.periods?.length) {
      return payload
    }

    return {
      ...payload,
      periods: payload.periods.map((period) => {
        const overrideStatus = periodStatusOverrides[period.id]
        if (!overrideStatus) {
          return period
        }

        return {
          ...period,
          status: overrideStatus,
        }
      }),
    }
  }, [payload, periodStatusOverrides])
  const overviewCards = getOverviewCards(activeSection, payload, user)
  const insightRows = getInsightRows(activeSection, payloadWithPeriodOverrides, user)

  async function handleLogout() {
    clearStoredToken()
    dispatch(clearSession())
    dispatch(overxApi.util.resetApiState())

    try {
      await logoutRequest().unwrap()
    } catch {
      // Ignore logout failures after local session is cleared.
    }

    navigate('/login', { replace: true })
  }

  async function handleRequestCashout(periodId) {
    if (!periodId || !token || periodActionState.loading) {
      return
    }

    setPeriodActionError('')
    setPeriodActionState({ loading: true, type: 'cashout', periodId })

    try {
      await requestPeriodCashout({ earning_period_id: periodId, token }).unwrap()
      setPeriodStatusOverrides((prev) => ({ ...prev, [periodId]: 'cashout requested' }))
      periodsQuery.refetch()
    } catch (requestError) {
      setPeriodActionError(getQueryErrorMessage(requestError))
    } finally {
      setPeriodActionState({ loading: false, type: '', periodId: null })
    }
  }

  async function handleRequestStore(periodId) {
    if (!periodId || !token || periodActionState.loading) {
      return
    }

    setPeriodActionError('')
    setPeriodActionState({ loading: true, type: 'store', periodId })

    try {
      await requestPeriodStore({ earning_period_id: periodId, token }).unwrap()
      setPeriodStatusOverrides((prev) => ({ ...prev, [periodId]: 'stored' }))
      periodsQuery.refetch()
    } catch (requestError) {
      setPeriodActionError(getQueryErrorMessage(requestError))
    } finally {
      setPeriodActionState({ loading: false, type: '', periodId: null })
    }
  }

  function handleOpenChangePasswordModal() {
    setPasswordError('')
    setPasswordSuccess('')
    setPasswordForm(initialPasswordForm)
    setPasswordVisibility({
      current_password: false,
      password: false,
      password_confirmation: false,
    })
    setIsPasswordModalOpen(true)
  }

  function handleCloseChangePasswordModal() {
    if (passwordSubmitting) {
      return
    }

    setIsPasswordModalOpen(false)
    setPasswordError('')
    setPasswordSuccess('')
    setPasswordForm(initialPasswordForm)
    setPasswordVisibility({
      current_password: false,
      password: false,
      password_confirmation: false,
    })
  }

  function handlePasswordInputChange(event) {
    const { name, value } = event.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function togglePasswordVisibility(fieldName) {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  function handleOpenCashoutDetailsModal() {
    setCashoutDetailsType('bank')
    setCashoutDetailsError('')
    setCashoutDetailsSuccess('')
    setCashoutDetailsForm(initialCashoutDetailsForm)
    setIsCashoutDetailsModalOpen(true)
  }

  function handleCloseCashoutDetailsModal() {
    if (cashoutDetailsSubmitting) {
      return
    }

    setIsCashoutDetailsModalOpen(false)
    setCashoutDetailsError('')
    setCashoutDetailsSuccess('')
    setCashoutDetailsType('bank')
    setCashoutDetailsForm(initialCashoutDetailsForm)
  }

  function handleCashoutDetailsInputChange(event) {
    const { name, value, type, checked } = event.target
    setCashoutDetailsForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmitCashoutDetails(event) {
    event.preventDefault()

    if (cashoutDetailsSubmitting) {
      return
    }

    setCashoutDetailsError('')
    setCashoutDetailsSuccess('')

    if (!cashoutDetailsForm.label.trim()) {
      setCashoutDetailsError('Label is required.')
      return
    }

    const basePayload = {
      label: cashoutDetailsForm.label.trim(),
      type: cashoutDetailsType,
      is_default: cashoutDetailsForm.is_default,
    }

    let payload = basePayload

    if (cashoutDetailsType === 'bank') {
      if (!cashoutDetailsForm.account_holder.trim() || !cashoutDetailsForm.bank_name.trim() || !cashoutDetailsForm.iban.trim()) {
        setCashoutDetailsError('Account holder, bank name, and IBAN are required for bank details.')
        return
      }

      payload = {
        ...basePayload,
        account_holder: cashoutDetailsForm.account_holder.trim(),
        bank_name: cashoutDetailsForm.bank_name.trim(),
        swift_code: cashoutDetailsForm.swift_code.trim(),
        routing_number: cashoutDetailsForm.routing_number.trim(),
        iban: cashoutDetailsForm.iban.trim(),
      }
    } else {
      const parsedCurrencyId = Number(cashoutDetailsForm.currency_id)

      if (!cashoutDetailsForm.crypto_wallet_address.trim() || !cashoutDetailsForm.crypto_network.trim() || !Number.isFinite(parsedCurrencyId) || parsedCurrencyId <= 0) {
        setCashoutDetailsError('Wallet address, network, and currency ID are required for crypto details.')
        return
      }

      payload = {
        ...basePayload,
        crypto_wallet_address: cashoutDetailsForm.crypto_wallet_address.trim(),
        crypto_network: cashoutDetailsForm.crypto_network.trim(),
        currency_id: parsedCurrencyId,
      }
    }

    setCashoutDetailsSubmitting(true)

    try {
      await createPortalCashoutDetails(payload).unwrap()
      setCashoutDetailsSuccess('Payment details saved successfully.')
      methodsQuery.refetch()
      setCashoutDetailsForm(initialCashoutDetailsForm)
    } catch (requestError) {
      setCashoutDetailsError(getQueryErrorMessage(requestError))
    } finally {
      setCashoutDetailsSubmitting(false)
    }
  }

  async function handleSubmitChangePassword(event) {
    event.preventDefault()

    if (passwordSubmitting) {
      return
    }

    setPasswordError('')
    setPasswordSuccess('')

    if (!passwordForm.current_password || !passwordForm.password || !passwordForm.password_confirmation) {
      setPasswordError('All password fields are required.')
      return
    }

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setPasswordError('Password confirmation does not match.')
      return
    }

    setPasswordSubmitting(true)

    try {
      await changePasswordRequest({
        current_password: passwordForm.current_password,
        password: passwordForm.password,
        password_confirmation: passwordForm.password_confirmation,
      }).unwrap()

      setPasswordSuccess('Password changed successfully.')
      setPasswordForm(initialPasswordForm)
    } catch (requestError) {
      setPasswordError(getQueryErrorMessage(requestError))
    } finally {
      setPasswordSubmitting(false)
    }
  }

  return (
    <div className="portal-theme min-h-screen overflow-x-hidden bg-grid text-slate-100">
      <div className="portal-backdrop-glow" />

      <main className="relative z-10 w-full p-0">
        <section className="portal-shell">
          <aside className="portal-sidebar">
            {/* <div className="portal-sidebar-brand">
              <Link to="/" className="relative inline-flex h-12 w-44 items-center">
                <img src={brandLogo} alt="OVERXBIT" className="pointer-events-none absolute left-0 top-1/2 h-28 w-48 -translate-y-1/2 select-none" />
              </Link>
            </div> */}

            {/* <div className="portal-sidebar-profile">
              <div className="portal-avatar-ring">
                <span>{(user?.name || 'O').slice(0, 1).toUpperCase()}</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">{user?.client?.name || user?.name || 'OverXBit Client'}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">Private portal access</p>
              </div>
            </div> */}

            <nav className="mt-8 space-y-2">
              {portalSections.map((section) => {
                const Icon = section.icon

                return (
                  <NavLink
                    key={section.slug}
                    to={`/portal/${section.slug}`}
                    className={({ isActive }) => `portal-nav-item rounded-2xl ${isActive ? 'portal-nav-item-active' : ''}`}
                  >
                    <span className="portal-nav-icon rounded-full"><Icon /></span>
                    <span>
                      {/* <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">{section.slug}</span> */}
                      <span className="mt-1 block text-sm font-medium text-white">{section.label}</span>
                    </span>
                    <FaChevronRight className="ml-auto text-xs text-slate-500" />
                  </NavLink>
                )
              })}
            </nav>

            <div className="portal-sidebar-promo">
              <button type="button" onClick={handleLogout} className="portal-secondary-button mt-5 w-full justify-center">Sign out</button>
            </div>
          </aside>

          <section className="portal-main p-3 sm:p-4">
            <header className="portal-topbar">
              <div>
                <p className="portal-subtitle">{activeSection.slug}</p>
                <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{activeSection.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{activeSection.description}</p>
              </div>

              {/* <div className="portal-topbar-actions">
                <div className="portal-chip"><FaShieldHalved className="text-[#2ABBAF]" />{user?.email || 'Authenticated client'}</div>
              </div> */}
            </header>

            <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((item) => (
                <OverviewCard key={item.label} item={item} />
              ))}
            </section>

            {activeSection.slug === 'dashboard' ? (
              <section className="mt-6 grid gap-6">
                <DashboardChartSection
                  className="min-w-0"
                  chartQuery={periodsChartQuery}
                  onRetry={() => periodsChartQuery.refetch()}
                />
                <SinglePeriodLineChartSection
                  className="min-w-0"
                  chartQuery={singlePeriodChartQuery}
                  periodId={selectedPeriodId}
                  periods={periodOptions}
                  onSelectPeriod={setSelectedPeriodId}
                  onRetry={() => singlePeriodChartQuery.refetch()}
                />
                <DashboardPeriodsTable periods={periodOptions} />
              </section>
            ) : (
              <section className="portal-panel mt-6 overflow-hidden rounded-[1.75rem]" style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
                <div className="border-b border-white/12 bg-[rgba(255,255,255,0.04)] px-6 py-5 sm:px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      {/* <p className="text-xs uppercase tracking-[0.22em] text-[#2ABBAF]">Data Grid</p> */}
                      <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{activeSection.label} Stream</h3>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                        Structured endpoint output with the same OverXBit tone, optimized for quick scanning.
                      </p>
                    </div>
                    {activeSection.slug === 'profile' ? (
                      <button
                        type="button"
                        onClick={handleOpenChangePasswordModal}
                        className="portal-secondary-button"
                      >
                        Change Password
                      </button>
                    ) : null}
                    {activeSection.slug === 'methods' ? (
                      <button
                        type="button"
                        onClick={handleOpenCashoutDetailsModal}
                        className="portal-secondary-button"
                      >
                        Add Payment Details
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {activeSection.slug === 'periods' && periodActionError ? (
                    <div className="mb-4 rounded-[1.2rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {periodActionError}
                    </div>
                  ) : null}

                  {loading ? (
                    <div className="portal-panel rounded-[1.45rem] p-8 sm:p-10">
                      <div className="portal-loader" />
                      <p className="mt-5 text-sm text-slate-300">Loading {activeSection.label.toLowerCase()} from the OverX API.</p>
                    </div>
                  ) : null}

                  {!loading && error ? (
                    <div className="rounded-[1.45rem] border border-red-400/30 bg-gradient-to-b from-red-500/12 to-red-500/4 p-8">
                      <EmptyState title="The API section could not be loaded." detail={`${error} Check that Laravel is running on localhost:8000 and that the current token is valid.`} />
                    </div>
                  ) : null}

                  {!loading && !error ? (
                    <div className="rounded-[1.45rem] p-4 sm:p-5">
                      <ContentRenderer
                        section={activeSection}
                        payload={payloadWithPeriodOverrides}
                        onRequestCashout={handleRequestCashout}
                        onRequestStore={handleRequestStore}
                        actionState={periodActionState}
                      />
                    </div>
                  ) : null}
                </div>
              </section>
            )}
          </section>
        </section>
      </main>

      {isCashoutDetailsModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-4">
          <div className="w-full max-w-2xl rounded-[1.2rem] border border-white/15 bg-[#07181d] p-6 shadow-[0_20px_80px_-50px_rgba(42,187,175,0.72)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#2ABBAF]">Payment Details</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Add cashout method</h3>
              </div>
              <button type="button" onClick={handleCloseCashoutDetailsModal} className="portal-secondary-button" disabled={cashoutDetailsSubmitting}>
                Close
              </button>
            </div>

            <div className="mt-5 inline-flex rounded-xl border border-white/12 bg-[rgba(255,255,255,0.04)] p-1">
              <button
                type="button"
                onClick={() => setCashoutDetailsType('bank')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${cashoutDetailsType === 'bank' ? 'bg-[#1D4ED8] text-white' : 'text-slate-300'}`}
              >
                <span className="inline-flex items-center gap-2">
                  <FaCreditCard />
                  Bank
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCashoutDetailsType('crypto')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${cashoutDetailsType === 'crypto' ? 'bg-[#1D4ED8] text-white' : 'text-slate-300'}`}
              >
                <span className="inline-flex items-center gap-2">
                  <FaBitcoin />
                  Crypto
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmitCashoutDetails} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="cashout_label" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Label</label>
                  <input
                    id="cashout_label"
                    name="label"
                    value={cashoutDetailsForm.label}
                    onChange={handleCashoutDetailsInputChange}
                    className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                    placeholder="My main payout method"
                  />
                </div>

                {cashoutDetailsType === 'bank' ? (
                  <>
                    <div>
                      <label htmlFor="account_holder" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Account Holder</label>
                      <input
                        id="account_holder"
                        name="account_holder"
                        value={cashoutDetailsForm.account_holder}
                        onChange={handleCashoutDetailsInputChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                      />
                    </div>
                    <div>
                      <label htmlFor="bank_name" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Bank Name</label>
                      <input
                        id="bank_name"
                        name="bank_name"
                        value={cashoutDetailsForm.bank_name}
                        onChange={handleCashoutDetailsInputChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                      />
                    </div>
                    <div>
                      <label htmlFor="swift_code" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Swift Code</label>
                      <input
                        id="swift_code"
                        name="swift_code"
                        value={cashoutDetailsForm.swift_code}
                        onChange={handleCashoutDetailsInputChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                      />
                    </div>
                    <div>
                      <label htmlFor="routing_number" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Routing Number</label>
                      <input
                        id="routing_number"
                        name="routing_number"
                        value={cashoutDetailsForm.routing_number}
                        onChange={handleCashoutDetailsInputChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="iban" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">IBAN</label>
                      <input
                        id="iban"
                        name="iban"
                        value={cashoutDetailsForm.iban}
                        onChange={handleCashoutDetailsInputChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sm:col-span-2">
                      <label htmlFor="crypto_wallet_address" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Wallet Address</label>
                      <input
                        id="crypto_wallet_address"
                        name="crypto_wallet_address"
                        value={cashoutDetailsForm.crypto_wallet_address}
                        onChange={handleCashoutDetailsInputChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                      />
                    </div>
                    <div>
                      <label htmlFor="crypto_network" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Network</label>
                      <input
                        id="crypto_network"
                        name="crypto_network"
                        value={cashoutDetailsForm.crypto_network}
                        onChange={handleCashoutDetailsInputChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                        placeholder="TRC20"
                      />
                    </div>
                    <div>
                      <label htmlFor="currency_id" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Currency ID</label>
                      <input
                        id="currency_id"
                        name="currency_id"
                        type="number"
                        min="1"
                        value={cashoutDetailsForm.currency_id}
                        onChange={handleCashoutDetailsInputChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                      />
                    </div>
                  </>
                )}
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={cashoutDetailsForm.is_default}
                  onChange={handleCashoutDetailsInputChange}
                  className="h-4 w-4 rounded border-white/20 bg-[#0b1a1f]"
                />
                Set as default
              </label>

              {cashoutDetailsError ? (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{cashoutDetailsError}</p>
              ) : null}

              {cashoutDetailsSuccess ? (
                <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{cashoutDetailsSuccess}</p>
              ) : null}

              <button type="submit" className="portal-secondary-button w-full justify-center" disabled={cashoutDetailsSubmitting}>
                {cashoutDetailsSubmitting ? 'Saving...' : 'Save Payment Details'}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {isPasswordModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 p-4">
          <div className="w-full max-w-md rounded-[1.2rem] border border-white/15 bg-[#07181d] p-6 shadow-[0_20px_80px_-50px_rgba(42,187,175,0.72)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#2ABBAF]">Security</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Change Password</h3>
              </div>
              <button type="button" onClick={handleCloseChangePasswordModal} className="portal-secondary-button" disabled={passwordSubmitting}>
                Close
              </button>
            </div>

            <form onSubmit={handleSubmitChangePassword} className="mt-6 space-y-4">
              <div>
                <label htmlFor="current_password" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Current Password</label>
                <div className="relative">
                  <input
                    id="current_password"
                    name="current_password"
                    type={passwordVisibility.current_password ? 'text' : 'password'}
                    value={passwordForm.current_password}
                    onChange={handlePasswordInputChange}
                    className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 pr-10 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current_password')}
                    className="absolute inset-y-0 right-0 inline-flex items-center pr-3 text-slate-400 transition hover:text-[#7ad7cf]"
                    aria-label={passwordVisibility.current_password ? 'Hide current password' : 'Show current password'}
                  >
                    {passwordVisibility.current_password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">New Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisibility.password ? 'text' : 'password'}
                    value={passwordForm.password}
                    onChange={handlePasswordInputChange}
                    className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 pr-10 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="absolute inset-y-0 right-0 inline-flex items-center pr-3 text-slate-400 transition hover:text-[#7ad7cf]"
                    aria-label={passwordVisibility.password ? 'Hide new password' : 'Show new password'}
                  >
                    {passwordVisibility.password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password_confirmation" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Confirm New Password</label>
                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={passwordVisibility.password_confirmation ? 'text' : 'password'}
                    value={passwordForm.password_confirmation}
                    onChange={handlePasswordInputChange}
                    className="w-full rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 pr-10 text-sm text-white outline-none transition focus:border-[#2ABBAF]"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password_confirmation')}
                    className="absolute inset-y-0 right-0 inline-flex items-center pr-3 text-slate-400 transition hover:text-[#7ad7cf]"
                    aria-label={passwordVisibility.password_confirmation ? 'Hide password confirmation' : 'Show password confirmation'}
                  >
                    {passwordVisibility.password_confirmation ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {passwordError ? (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{passwordError}</p>
              ) : null}

              {passwordSuccess ? (
                <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{passwordSuccess}</p>
              ) : null}

              <button type="submit" className="portal-secondary-button w-full justify-center" disabled={passwordSubmitting}>
                {passwordSubmitting ? 'Sending...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ClientPortalPage