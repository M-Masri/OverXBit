import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDownloadPeriodReportMutation } from '../services/overxApi'
import { selectToken } from '../services/authSlice'
import PortalContractSelect from './PortalContractSelect'
import EarningsSplitSummary, { STORING_COLOR, CASHOUT_COLOR } from './EarningsSplitSummary'
import {
  buildDailyPeriodRows,
  buildDailyRevenueSeriesFromPayload,
  dailyRowsHaveSplit,
  filterPeriodsByContract,
  getPeriodDisplayLabel,
  getPeriodEarningsSplit,
  sortPeriodsForClient,
  sumDailySplitRows,
} from '../utils/periodUtils'

const TOTAL_COLOR = '#94a3b8'

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

function resolveDisplaySplit(periodSplit, dailyTotals) {
  const preferPeriod = periodSplit?.hasSplit
  return {
    btcStoring: preferPeriod ? periodSplit.btcStoring : dailyTotals.btcStoring || periodSplit.btcStoring,
    btcCashout: preferPeriod ? periodSplit.btcCashout : dailyTotals.btcCashout || periodSplit.btcCashout,
    revenueStoring: preferPeriod ? periodSplit.revenueStoring : dailyTotals.revenueStoring || periodSplit.revenueStoring,
    revenueCashout: preferPeriod ? periodSplit.revenueCashout : dailyTotals.revenueCashout || periodSplit.revenueCashout,
    btcTotal: periodSplit.btc || dailyTotals.btc,
    revenueTotal: periodSplit.revenue || dailyTotals.revenue,
  }
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

  const dailyTotals = useMemo(() => sumDailySplitRows(dailyRows), [dailyRows])
  const periodSplit = useMemo(() => getPeriodEarningsSplit(selectedPeriod), [selectedPeriod])
  const displaySplit = useMemo(() => resolveDisplaySplit(periodSplit, dailyTotals), [dailyTotals, periodSplit])
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
  const chartHasSplit = dailyRowsHaveSplit(dailyRows)

  useEffect(() => {
    setReportHref('#')
  }, [periodId])

  const maxValue = points.reduce(
    (max, point) => Math.max(max, Number(point.value || 0), Number(point.storing || 0), Number(point.cashout || 0)),
    0
  )
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
    const toY = (value) => Math.round(paddingTop + plotHeight - (Number(value || 0) / yMax) * plotHeight)

    return {
      ...point,
      x,
      y: toY(point.value),
      storingY: toY(point.storing),
      cashoutY: toY(point.cashout),
      shortLabel: formatDate(point.label),
    }
  })

  const totalPath = buildSmoothLinePath(linePoints.map((point) => ({ x: point.x, y: point.y })))
  const storingPath = buildSmoothLinePath(linePoints.map((point) => ({ x: point.x, y: point.storingY })))
  const cashoutPath = buildSmoothLinePath(linePoints.map((point) => ({ x: point.x, y: point.cashoutY })))
  const areaPath =
    linePoints.length > 1
      ? `${totalPath} L ${linePoints[linePoints.length - 1].x} ${paddingTop + plotHeight} L ${linePoints[0].x} ${paddingTop + plotHeight} Z`
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
            Choose a contract, then pick a month to review storing vs cashout earnings day by day.
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

          <EarningsSplitSummary
            title={`${getPeriodDisplayLabel(selectedPeriod)} earnings`}
            description="Exactly how much this month earned from storing machines versus cashout machines."
            btcStoring={displaySplit.btcStoring}
            btcCashout={displaySplit.btcCashout}
            revenueStoring={displaySplit.revenueStoring}
            revenueCashout={displaySplit.revenueCashout}
            btcTotal={displaySplit.btcTotal}
            revenueTotal={displaySplit.revenueTotal}
          />

          {linePoints.length ? (
            <div className="relative rounded-[1.3rem] border border-white/12 bg-[rgba(255,255,255,0.04)] p-3 sm:p-4">
              <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                {chartHasSplit ? (
                  <>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: STORING_COLOR }} />
                      Storing revenue
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: CASHOUT_COLOR }} />
                      Cashout revenue
                    </span>
                  </>
                ) : null}
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: chartHasSplit ? TOTAL_COLOR : STORING_COLOR }} />
                  Total revenue
                </span>
              </div>

              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-[280px] w-full">
                <defs>
                  <linearGradient id="contractLineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(42,187,175,0.18)" />
                    <stop offset="100%" stopColor="rgba(42,187,175,0.02)" />
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

                {!chartHasSplit && areaPath ? <path d={areaPath} fill="url(#contractLineFill)" /> : null}
                {chartHasSplit && storingPath ? (
                  <path d={storingPath} fill="none" stroke={STORING_COLOR} strokeWidth="2.5" strokeLinecap="round" />
                ) : null}
                {chartHasSplit && cashoutPath ? (
                  <path d={cashoutPath} fill="none" stroke={CASHOUT_COLOR} strokeWidth="2.5" strokeLinecap="round" />
                ) : null}
                {totalPath ? (
                  <path
                    d={totalPath}
                    fill="none"
                    stroke={chartHasSplit ? TOTAL_COLOR : STORING_COLOR}
                    strokeWidth={chartHasSplit ? 2 : 3}
                    strokeLinecap="round"
                    strokeDasharray={chartHasSplit ? '5 5' : undefined}
                  />
                ) : null}

                {linePoints.map((point, index) => (
                  <g key={point.id}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={hoveredIndex === index ? 5 : 3.5}
                      fill={chartHasSplit ? TOTAL_COLOR : STORING_COLOR}
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
                  {chartHasSplit ? (
                    <>
                      <p className="mt-1 text-sm text-slate-200">Storing: {formatMoney(hoveredPoint.storing)}</p>
                      <p className="text-sm text-slate-200">Cashout: {formatMoney(hoveredPoint.cashout)}</p>
                      <p className="mt-1 text-sm font-semibold text-white">Total: {formatMoney(hoveredPoint.value)}</p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-white">Revenue: {formatMoney(hoveredPoint.value)}</p>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          {dailyRows.length ? (
            <>
              <div>
                <h5 className="text-sm font-semibold text-white">Day-by-day detail</h5>
                <p className="mt-1 text-sm text-slate-400">Each day broken into storing machines vs cashout machines.</p>
              </div>
              <div className="portal-table-shell">
                <table className="portal-data-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Storing BTC</th>
                      <th>Cashout BTC</th>
                      <th>Total BTC</th>
                      <th>Storing $</th>
                      <th>Cashout $</th>
                      <th>Total $</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyRows.map((row) => (
                      <tr key={row.id}>
                        <td>{formatDate(row.date)}</td>
                        <td className="text-[#7ad7cf]">{formatBtc(row.btcStoring)}</td>
                        <td className="text-[#9ec5e8]">{formatBtc(row.btcCashout)}</td>
                        <td>{formatBtc(row.btc)}</td>
                        <td className="text-[#7ad7cf]">{formatMoney(row.revenueStoring)}</td>
                        <td className="text-[#9ec5e8]">{formatMoney(row.revenueCashout)}</td>
                        <td>{formatMoney(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-500">
                Cashout and store requests use the combined month total ({formatBtc(displaySplit.btcTotal)} / {formatMoney(displaySplit.revenueTotal)}).
              </p>
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
