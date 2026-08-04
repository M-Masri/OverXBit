import { useEffect, useMemo, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import ContractAmountHistory from './ContractAmountHistory'
import { formatAed } from '../utils/money'

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

function EmptyState({ title, detail }) {
  return (
    <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  )
}

export default function MiningContractsView({ payload }) {
  const contracts = Array.isArray(payload.contracts) ? payload.contracts : []
  const [selectedContractId, setSelectedContractId] = useState(null)

  useEffect(() => {
    if (!contracts.length) {
      setSelectedContractId(null)
      return
    }

    const stillExists = contracts.some((contract) => Number(contract.id) === Number(selectedContractId))
    if (!stillExists) {
      setSelectedContractId(Number(contracts[0].id))
    }
  }, [contracts, selectedContractId])

  const selectedContract = useMemo(
    () => contracts.find((contract) => Number(contract.id) === Number(selectedContractId)) || null,
    [contracts, selectedContractId]
  )

  const totalCapital = contracts.reduce((sum, contract) => sum + Number(contract?.amount || 0), 0)
  const totalAdjustments = contracts.reduce(
    (sum, contract) => sum + Number(contract?.amount_adjustments_count || 0),
    0
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="portal-metric-block">
          <span>Contracts</span>
          <strong>{contracts.length}</strong>
        </div>
        <div className="portal-metric-block">
          <span>Current capital (AED)</span>
          <strong>{formatAed(totalCapital)}</strong>
        </div>
        <div className="portal-metric-block">
          <span>Amount adjustments</span>
          <strong>{totalAdjustments}</strong>
        </div>
      </div>

      <div className="portal-panel rounded-[1.45rem] p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="portal-subtitle">Mining Agreements</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Contracts & AED capital</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Mining agreements are denominated in AED. Capital withdrawals reduce the live amount immediately and always include a receipt.
            </p>
          </div>
        </div>

        {contracts.length ? (
          <div className="mt-5 space-y-3">
            {contracts.map((contract) => {
              const isSelected = Number(contract.id) === Number(selectedContractId)
              const adjustmentsCount = Number(contract.amount_adjustments_count || 0)

              return (
                <button
                  key={contract.id}
                  type="button"
                  onClick={() => setSelectedContractId(Number(contract.id))}
                  className={`w-full rounded-[1.25rem] border p-4 text-left transition sm:p-5 ${
                    isSelected
                      ? 'border-[#70A9DC]/45 bg-[#70A9DC]/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">
                          {contract.period_label || `Contract #${contract.id}`}
                        </p>
                        {adjustmentsCount > 0 ? (
                          <span className="rounded-full border border-[#70A9DC]/35 bg-[#70A9DC]/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#9ec5e8]">
                            History ({adjustmentsCount})
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        {formatDate(contract.start_date)} to {formatDate(contract.end_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Current amount (AED)</p>
                      <p className="mt-1 text-lg font-semibold text-white">{formatAed(contract.amount)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className={`text-sm ${isSelected ? 'text-[#9ec5e8]' : 'text-slate-400'}`}>
                      {isSelected ? 'Showing amount history below' : 'View amount history'}
                    </span>
                    {contract.file_url ? (
                      <a
                        href={contract.file_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="portal-inline-link"
                      >
                        Open agreement
                        <FaArrowRight />
                      </a>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="No mining contracts returned yet."
              detail="Signed mining agreements will appear here with live AED capital."
            />
          </div>
        )}
      </div>

      {selectedContract ? (
        <div className="portal-panel rounded-[1.45rem] p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-white/8 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#70A9DC]">Selected contract</p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                {selectedContract.period_label || `Contract #${selectedContract.id}`}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Live capital {formatAed(selectedContract.amount)}
              </p>
            </div>
            <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Source of truth</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatAed(selectedContract.amount)}</p>
              <p className="text-xs text-slate-500">Current AED amount</p>
            </div>
          </div>

          <ContractAmountHistory
            module="mining"
            contractId={selectedContract.id}
            fallbackAdjustments={selectedContract.amount_adjustments || []}
            fallbackCount={selectedContract.amount_adjustments_count || 0}
          />
        </div>
      ) : null}
    </div>
  )
}
