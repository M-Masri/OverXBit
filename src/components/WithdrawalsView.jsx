import { FaArrowRight, FaBitcoin, FaFileLines, FaWaveSquare } from 'react-icons/fa6'
import { formatAed, formatSignedAed } from '../utils/money'

const FILTER_OPTIONS = [
  { id: '', label: 'All' },
  { id: 'mining', label: 'Mining' },
  { id: 'trading', label: 'Trading' },
]

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

function contractLabel(withdrawal) {
  const contract =
    withdrawal?.contract_type === 'mining'
      ? withdrawal?.contract
      : withdrawal?.trading_contract

  return (
    contract?.period_label ||
    (withdrawal?.contract_type === 'mining'
      ? `Mining contract #${withdrawal?.contract_id || 'N/A'}`
      : `Trading contract #${withdrawal?.trading_contract_id || 'N/A'}`)
  )
}

function ModuleBadge({ contractType }) {
  const isMining = contractType === 'mining'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${
        isMining
          ? 'border-[#2ABBAF]/45 bg-[#2ABBAF]/12 text-[#7ad7cf]'
          : 'border-[#70A9DC]/45 bg-[#70A9DC]/12 text-[#9ec5e8]'
      }`}
    >
      {isMining ? <FaBitcoin className="text-[10px]" /> : <FaWaveSquare className="text-[10px]" />}
      {isMining ? 'Mining' : 'Trading'}
    </span>
  )
}

function WithdrawalRow({ withdrawal }) {
  const signed = withdrawal?.signed_amount ?? -Number(withdrawal?.amount || 0)

  return (
    <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ModuleBadge contractType={withdrawal?.contract_type} />
            <span className="rounded-full border border-red-400/35 bg-red-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-red-200">
              {withdrawal?.type_label || 'Withdrawal'}
            </span>
            <span className="text-xs text-slate-500">{formatDate(withdrawal?.adjusted_on)}</span>
          </div>

          <h4 className="mt-3 truncate text-lg font-semibold text-white" title={contractLabel(withdrawal)}>
            {contractLabel(withdrawal)}
          </h4>

          <p className="mt-2 text-2xl font-semibold text-red-300">{formatSignedAed(signed)}</p>

          <p className="mt-2 text-sm text-slate-400">
            {formatAed(withdrawal?.amount_before)} → {formatAed(withdrawal?.amount_after)}
          </p>

          {withdrawal?.notes ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{withdrawal.notes}</p>
          ) : null}
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          {withdrawal?.file_url ? (
            <a
              href={withdrawal.file_url}
              target="_blank"
              rel="noreferrer"
              className="portal-secondary-button inline-flex items-center justify-center gap-2"
            >
              <FaFileLines />
              View receipt
            </a>
          ) : (
            <span className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-500">
              Receipt pending
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function WithdrawalsView({
  payload = {},
  contractTypeFilter = '',
  onFilterChange,
  page = 1,
  onPageChange,
  onRetry,
  errorMessage,
}) {
  const withdrawals = payload.withdrawals || []
  const meta = payload.withdrawalsMeta || {}
  const total = Number(meta.total || withdrawals.length || 0)
  const lastPage = Number(meta.last_page || 1)
  const currentPage = Number(meta.current_page || page)

  const miningCount = withdrawals.filter((row) => row.contract_type === 'mining').length
  const tradingCount = withdrawals.filter((row) => row.contract_type === 'trading').length
  const totalWithdrawn = withdrawals.reduce((sum, row) => sum + Number(row?.amount || 0), 0)

  function handleFilterChange(nextFilter) {
    onFilterChange?.(nextFilter)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.45rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Contract capital</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Withdrawals</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Read-only record of capital withdrawn from mining and trading agreements. These reduce AED contract
              balances and are separate from earnings cashouts.
            </p>
          </div>
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Total records</p>
            <p className="mt-1 text-lg font-semibold text-white">{total}</p>
            <p className="text-xs text-slate-500">Capital withdrawals</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="portal-metric-block">
          <span>On this page</span>
          <strong>{withdrawals.length}</strong>
        </div>
        <div className="portal-metric-block">
          <span>Mining / Trading</span>
          <strong>
            {miningCount} / {tradingCount}
          </strong>
        </div>
        <div className="portal-metric-block">
          <span>Withdrawn (page)</span>
          <strong className="text-red-200">{formatAed(totalWithdrawn)}</strong>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.id || 'all'}
            type="button"
            onClick={() => handleFilterChange(option.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              contractTypeFilter === option.id
                ? 'border-[#70A9DC] bg-[#70A9DC]/15 text-white'
                : 'border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {errorMessage ? (
        <div className="rounded-[1.45rem] border border-red-400/30 bg-red-500/10 p-6">
          <p className="text-lg font-semibold text-white">Withdrawals could not be loaded.</p>
          <p className="mt-2 text-sm text-red-200">{errorMessage}</p>
          {onRetry ? (
            <button type="button" className="portal-secondary-button mt-4" onClick={onRetry}>
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {!errorMessage && withdrawals.length ? (
        <div className="space-y-3">
          {withdrawals.map((withdrawal) => (
            <WithdrawalRow key={`${withdrawal.contract_type}-${withdrawal.id}`} withdrawal={withdrawal} />
          ))}
        </div>
      ) : null}

      {!errorMessage && !withdrawals.length ? (
        <div className="rounded-[1.45rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-lg font-semibold text-white">No capital withdrawals yet.</p>
          <p className="mt-2 text-sm text-slate-400">
            When the firm processes a contract capital withdrawal, it will appear here with the receipt and updated balance.
          </p>
        </div>
      ) : null}

      {!errorMessage && lastPage > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            Page {currentPage} of {lastPage}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="portal-secondary-button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="portal-secondary-button inline-flex items-center gap-2"
              disabled={currentPage >= lastPage}
              onClick={() => onPageChange?.(Math.min(lastPage, currentPage + 1))}
            >
              Next
              <FaArrowRight />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
