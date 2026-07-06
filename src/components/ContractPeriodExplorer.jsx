import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDownloadPeriodReportMutation } from '../services/overxApi'
import { selectToken } from '../services/authSlice'
import PortalContractSelect from './PortalContractSelect'
import {
  buildDailyPeriodRows,
  buildDailyRevenueSeriesFromPayload,
  filterPeriodsByContract,
  getPeriodDisplayLabel,
  sortPeriodsForClient,
} from '../utils/periodUtils'

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
    return String(value)
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
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

export default function ContractPeriodExplorer({
  contracts = [],
  contractId,
  onContractChange,
  periods = [],
  periodId,
  onPeriodChange,
  chartQuery,
  onRetry,
  errorMessage = 'Unable to load period details right now.',
}) {
  const token = useSelector(selectToken)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [reportHref, setReportHref] = useState('#')
  const [downloadPeriodReport, { isLoading: reportLoading }] = useDownloadPeriodReportMutation()

  const contractPeriods = useMemo(
    () => sortPeriodsForClient(filterPeriodsByContract(periods, contracts, contractId), contracts),
    [contracts, contractId, periods]
  )

  const selectedPeriod = useMemo(
    () => contractPeriods.find((period) => Number(period.id) === Number(periodId)) || null,
    [contractPeriods, periodId]
  )

  const dailyRows = useMemo(
    () => buildDailyPeriodRows(chartQuery.data, selectedPeriod),
    [chartQuery.data, selectedPeriod]
  )

  const points = useMemo(
    () => buildDailyRevenueSeriesFromPayload(chartQuery.data, selectedPeriod),
    [chartQuery.data, selectedPeriod]
  )

  const totalBtc = dailyRows.reduce((sum, row) => sum + Number(row.btc || 0), 0)
  const totalRevenue = dailyRows.reduce((sum, row) => sum + Number(row.revenue || 0), 0)
  const hasPeriodId = Number.isFinite(Number(periodId)) && Number(periodId) > 0
  const usingRangeFallback =
    hasPeriodId &&
    !chartQuery.isLoading &&
    !chartQuery.isFetching &&
    !chartQuery.error &&
    dailyRows.length > 0 &&
    points.every((point) => Number(point.value || 0) === 0) &&
    !chartQuery.data?.dailyEarnings?.length &&
    !chartQuery.data?.chart?.labels?.length

  useEffect(() => {
    setReportHref('#')
  }, [periodId])

  const maxValue = points.reduce((max, point) => Math.max(max, Number(point.value || 0)), 0)
  const yMax = roundUpNice(maxValue || 1)
  const chartWidth = 920
  const chartHeight = 300
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

  async function handleDownloadReport(event) {
    if (reportHref !== '#') {
      return
    }

    event.preventDefault()

    if (!hasPeriodId || !token) {
      return
    }

    try {
      const response = await downloadPeriodReport({
        earning_period_id: Number(periodId),
        token,
      }).unwrap()

      const url = typeof response?.data?.url === 'string' ? response.data.url.trim() : ''
      if (!url) {
        return
      }

      setReportHref(url)
      const opened = window.open(url, '_blank')
      if (!opened) {
        window.location.href = url
      }
    } catch (error) {}
  }

  return (
    <section className="portal-panel overflow-visible rounded-[1.45rem] p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="portal-subtitle">Contract Explorer</p>
          <h3 className="mt-1 text-xl font-semibold text-white">Daily earnings by month</h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Choose a contract, then pick a month to review the daily revenue line and day-by-day breakdown.
          </p>
        </div>
        <PortalContractSelect
          id="contract-select"
          contracts={contracts}
          value={contractId}
          onChange={onContractChange}
          placeholder="Choose contract"
        />
      </div>

      {contractPeriods.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {contractPeriods.map((period) => {
            const isActive = Number(period.id) === Number(periodId)

            return (
              <button
                key={period.id}
                type="button"
                onClick={() => onPeriodChange?.(Number(period.id))}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? 'border-[#2ABBAF] bg-[#2ABBAF]/15 text-white'
                    : 'border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {getPeriodDisplayLabel(period)}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-400">No earning periods found for this contract.</p>
      )}

      {!hasPeriodId ? (
        <div className="mt-6 rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
          Select a contract and month to load daily earnings.
        </div>
      ) : null}

      {hasPeriodId && (chartQuery.isLoading || chartQuery.isFetching) ? (
        <div className="mt-6 rounded-[1.2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-8">
          <div className="portal-loader" />
          <p className="mt-5 text-sm text-slate-300">Loading {getPeriodDisplayLabel(selectedPeriod)}.</p>
        </div>
      ) : null}

      {hasPeriodId && !chartQuery.isLoading && !chartQuery.isFetching && chartQuery.error ? (
        <div className="mt-6 rounded-[1.2rem] border border-red-400/30 bg-red-500/10 p-6">
          <p className="text-sm text-red-200">{errorMessage}</p>
          <button type="button" onClick={onRetry} className="portal-secondary-button mt-4">
            Retry
          </button>
        </div>
      ) : null}

      {hasPeriodId && !chartQuery.isLoading && !chartQuery.isFetching && !chartQuery.error ? (
        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#2ABBAF]">Selected month</p>
              <h4 className="mt-1 text-lg font-semibold text-white">{getPeriodDisplayLabel(selectedPeriod)}</h4>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="portal-chip">{dailyRows.length} days</span>
              <a
                href={reportHref}
                onClick={handleDownloadReport}
                className="portal-secondary-button cursor-pointer"
                target="_blank"
                rel="noreferrer"
              >
                {reportLoading ? 'Downloading...' : 'Download Month Report'}
              </a>
            </div>
          </div>

          {usingRangeFallback ? (
            <p className="text-sm text-slate-400">
              Daily values are not available from the API yet. Showing the month calendar — totals below use the period summary.
            </p>
          ) : null}

          {linePoints.length ? (
            <div className="relative rounded-[1.3rem] border border-white/12 bg-[rgba(255,255,255,0.04)] p-3 sm:p-4">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-[280px] w-full">
                <defs>
                  <linearGradient id="contractLineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(42,187,175,0.22)" />
                    <stop offset="100%" stopColor="rgba(42,187,175,0.03)" />
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

                {areaPath ? <path d={areaPath} fill="url(#contractLineFill)" /> : null}
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
                      <text x={point.x} y={paddingTop + plotHeight + 24} fill="#94a3b8" fontSize="11" textAnchor="middle">
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
          ) : null}

          {dailyRows.length ? (
            <>
              <div className="portal-table-shell">
                <table className="portal-data-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>BTC Earned</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyRows.map((row) => (
                      <tr key={row.id}>
                        <td>{formatDate(row.date)}</td>
                        <td>{formatBtc(row.btc)}</td>
                        <td>{formatMoney(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="portal-metric-block">
                  <span>Month BTC Total</span>
                  <strong>{formatBtc(selectedPeriod?.total_btc_earned ?? totalBtc)}</strong>
                </div>
                <div className="portal-metric-block">
                  <span>Month Revenue Total</span>
                  <strong>{formatMoney(selectedPeriod?.total_revenue ?? totalRevenue)}</strong>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
              No daily rows available for this month yet.
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}
