import { useMemo, useState } from 'react'
import { FaArrowTrendDown, FaArrowTrendUp, FaFileLines, FaFileSignature } from 'react-icons/fa6'
import {
  useGetMiningContractByIdQuery,
  useGetTradingContractByIdQuery,
} from '../services/overxApi'
import { formatAed, formatSignedAed } from '../utils/money'

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

function sortAdjustmentsAscending(adjustments = []) {
  return [...(Array.isArray(adjustments) ? adjustments : [])].sort((a, b) => {
    const aStamp = new Date(a?.adjusted_on || a?.created_at || 0).getTime()
    const bStamp = new Date(b?.adjusted_on || b?.created_at || 0).getTime()
    if (aStamp !== bStamp) {
      return aStamp - bStamp
    }

    return Number(a?.id || 0) - Number(b?.id || 0)
  })
}

function sortAdjustmentsDescending(adjustments = []) {
  return sortAdjustmentsAscending(adjustments).reverse()
}

function isWithdrawalAdjustment(adjustment) {
  if (adjustment?.is_withdrawal === true) {
    return true
  }

  return String(adjustment?.type || '').toLowerCase() === 'decrease'
}

function adjustmentLabel(adjustment) {
  if (adjustment?.type_label) {
    return adjustment.type_label
  }

  const isIncrease = String(adjustment?.type || '').toLowerCase() === 'increase'
  if (isIncrease) {
    return 'Increase'
  }

  return isWithdrawalAdjustment(adjustment) ? 'Withdrawal' : 'Decrease'
}

function CapitalPathChart({ adjustments = [], createdAmount = null }) {
  const points = useMemo(() => {
    const ascending = sortAdjustmentsAscending(adjustments)
    const series = []

    if (Number.isFinite(Number(createdAmount))) {
      series.push({
        id: 'created',
        label: 'Created',
        value: Number(createdAmount),
      })
    } else if (ascending.length) {
      series.push({
        id: 'start',
        label: 'Start',
        value: Number(ascending[0]?.amount_before ?? 0),
      })
    }

    ascending.forEach((item, index) => {
      series.push({
        id: item.id || `point-${index}`,
        label: formatDate(item.adjusted_on),
        value: Number(item.amount_after || 0),
      })
    })

    return series
  }, [adjustments, createdAmount])

  if (points.length < 2) {
    return null
  }

  const width = 640
  const height = 180
  const paddingX = 24
  const paddingY = 24
  const plotWidth = width - paddingX * 2
  const plotHeight = height - paddingY * 2
  const values = points.map((point) => point.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = Math.max(maxValue - minValue, 1)
  const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0

  const coords = points.map((point, index) => {
    const x = paddingX + index * stepX
    const y = paddingY + plotHeight - ((point.value - minValue) / range) * plotHeight
    return { ...point, x, y }
  })

  const path = coords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Capital path (AED)</p>
          <p className="mt-1 text-sm text-slate-300">Created → each change → current amount.</p>
        </div>
        <p className="text-sm font-semibold text-white">
          {formatAed(coords[0].value)} → {formatAed(coords[coords.length - 1].value)}
        </p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[160px] w-full">
        <path d={path} fill="none" stroke="#70A9DC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((point) => (
          <g key={point.id}>
            <circle cx={point.x} cy={point.y} r="4" fill="#70A9DC" stroke="#071321" strokeWidth="2" />
          </g>
        ))}
      </svg>
    </div>
  )
}

function CreatedRow({ amount, agreementUrl, startDate, module = 'trading' }) {
  const label = module === 'mining' ? 'Mining agreement' : 'Trading agreement'

  return (
    <article className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#70A9DC]/45 bg-[#70A9DC]/15 text-[#9ec5e8]">
            <FaFileSignature />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#70A9DC]/45 bg-[#70A9DC]/14 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#9ec5e8]">
                Created
              </span>
              {startDate ? <span className="text-xs text-slate-500">{formatDate(startDate)}</span> : null}
            </div>
            <p className="mt-2 text-xl font-semibold text-white">{formatAed(amount)}</p>
            <p className="mt-1 text-sm text-slate-400">Original {label} capital (AED).</p>
          </div>
        </div>

        {agreementUrl ? (
          <a
            href={agreementUrl}
            target="_blank"
            rel="noreferrer"
            className="portal-secondary-button inline-flex items-center gap-2"
          >
            <FaFileLines />
            Open agreement
          </a>
        ) : null}
      </div>
    </article>
  )
}

function AdjustmentRow({ adjustment }) {
  const isIncrease = String(adjustment?.type || '').toLowerCase() === 'increase'
  const isWithdrawal = isWithdrawalAdjustment(adjustment)
  const accent = isIncrease ? '#2ABBAF' : '#F87171'
  const Icon = isIncrease ? FaArrowTrendUp : FaArrowTrendDown
  const signed = adjustment?.signed_amount ?? (isIncrease ? adjustment?.amount : -Number(adjustment?.amount || 0))
  const receiptLabel = isWithdrawal ? 'View receipt' : isIncrease ? 'View increase PDF' : 'View document'

  return (
    <article className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border"
            style={{
              color: accent,
              borderColor: `${accent}55`,
              background: `${accent}18`,
            }}
          >
            <Icon />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
                style={{
                  color: accent,
                  borderColor: `${accent}55`,
                  background: `${accent}14`,
                }}
              >
                {adjustmentLabel(adjustment)}
              </span>
              <span className="text-xs text-slate-500">{formatDate(adjustment?.adjusted_on)}</span>
            </div>
            <p className="mt-2 text-xl font-semibold" style={{ color: accent }}>
              {formatSignedAed(signed)}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {formatAed(adjustment?.amount_before)} → {formatAed(adjustment?.amount_after)}
            </p>
            {adjustment?.notes ? <p className="mt-3 text-sm leading-6 text-slate-300">{adjustment.notes}</p> : null}
          </div>
        </div>

        {adjustment?.file_url ? (
          <a
            href={adjustment.file_url}
            target="_blank"
            rel="noreferrer"
            className="portal-secondary-button inline-flex items-center gap-2"
          >
            <FaFileLines />
            {receiptLabel}
          </a>
        ) : null}
      </div>
    </article>
  )
}

export default function ContractAmountHistory({
  module = 'trading',
  contractId,
  fallbackAdjustments = [],
  fallbackCount = 0,
}) {
  const [filter, setFilter] = useState('all')
  const numericId = Number(contractId)
  const hasId = Number.isFinite(numericId) && numericId > 0
  const isMining = module === 'mining'

  const miningDetailQuery = useGetMiningContractByIdQuery(numericId, {
    skip: !hasId || !isMining,
  })
  const tradingDetailQuery = useGetTradingContractByIdQuery(numericId, {
    skip: !hasId || isMining,
  })

  const detailQuery = isMining ? miningDetailQuery : tradingDetailQuery
  const contract = detailQuery.data?.contract || null

  const allAdjustments = useMemo(() => {
    const fromDetail = Array.isArray(contract?.amount_adjustments) ? contract.amount_adjustments : []
    return sortAdjustmentsDescending(fromDetail.length ? fromDetail : fallbackAdjustments)
  }, [contract?.amount_adjustments, fallbackAdjustments])

  const adjustments = useMemo(() => {
    if (filter === 'increase') {
      return allAdjustments.filter((item) => String(item?.type || '').toLowerCase() === 'increase')
    }

    if (filter === 'withdrawal') {
      return allAdjustments.filter((item) => isWithdrawalAdjustment(item))
    }

    return allAdjustments
  }, [allAdjustments, filter])

  const count = Number(contract?.amount_adjustments_count ?? fallbackCount ?? allAdjustments.length ?? 0)
  const currentAmount = Number(contract?.amount)
  const createdAmount = useMemo(() => {
    const ascending = sortAdjustmentsAscending(allAdjustments)
    if (ascending.length) {
      return Number(ascending[0]?.amount_before)
    }

    return Number.isFinite(currentAmount) ? currentAmount : null
  }, [allAdjustments, currentAmount])

  const moduleLabel = isMining ? 'Mining' : 'Trading'

  if (!hasId) {
    return null
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Amount history</p>
          <h4 className="mt-1 text-lg font-semibold text-white">{moduleLabel} capital adjustments</h4>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Agreements are in AED. History shows created capital, green increases, red withdrawals, and the live current amount.
          </p>
        </div>
        <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Current amount (AED)</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {Number.isFinite(currentAmount) ? formatAed(currentAmount) : '—'}
          </p>
          <p className="text-xs text-slate-500">{count} adjustment{count === 1 ? '' : 's'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'increase', label: 'Increases' },
          { id: 'withdrawal', label: 'Withdrawals' },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              filter === option.id
                ? 'border-[#70A9DC] bg-[#70A9DC]/15 text-white'
                : 'border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {detailQuery.isLoading || detailQuery.isFetching ? (
        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="portal-loader" />
          <p className="mt-5 text-sm text-slate-300">Loading amount history.</p>
        </div>
      ) : null}

      {!detailQuery.isLoading && !detailQuery.isFetching && detailQuery.error ? (
        <div className="rounded-[1.2rem] border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-200">
          Unable to load amount history for this contract.
        </div>
      ) : null}

      {!detailQuery.isLoading && !detailQuery.isFetching && !detailQuery.error ? (
        <>
          <CapitalPathChart adjustments={allAdjustments} createdAmount={createdAmount} />

          {filter === 'all' && Number.isFinite(Number(createdAmount)) ? (
            <CreatedRow
              amount={createdAmount}
              agreementUrl={contract?.file_url}
              startDate={contract?.start_date}
              module={module}
            />
          ) : null}

          {allAdjustments.length ? (
            adjustments.length ? (
              <div className="space-y-3">
                {adjustments.map((adjustment) => (
                  <AdjustmentRow key={adjustment.id} adjustment={adjustment} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                No {filter === 'withdrawal' ? 'withdrawals' : filter} in this history.
              </div>
            )
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
              No amount adjustments recorded yet. Current amount matches the original agreement capital of{' '}
              {Number.isFinite(Number(createdAmount)) ? formatAed(createdAmount) : '—'}.
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}
