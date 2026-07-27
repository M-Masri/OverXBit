const STORING_COLOR = '#2ABBAF'
const CASHOUT_COLOR = '#70A9DC'

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
  return Number.isFinite(amount) ? amount.toFixed(8) : '0.00000000'
}

function SplitCard({
  tone = 'storing',
  title,
  subtitle,
  btc,
  revenue,
  machines = null,
}) {
  const isStoring = tone === 'storing'
  const accent = isStoring ? STORING_COLOR : CASHOUT_COLOR
  const panelClass = isStoring
    ? 'border-[#2ABBAF]/25 bg-[linear-gradient(160deg,rgba(42,187,175,0.14),rgba(7,19,26,0.72))]'
    : 'border-[#70A9DC]/25 bg-[linear-gradient(160deg,rgba(112,169,220,0.14),rgba(7,19,26,0.72))]'

  return (
    <div className={`rounded-[1.35rem] border p-5 sm:p-6 ${panelClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
            {title}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{subtitle}</p>
        </div>
        {machines != null ? (
          <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
            {machines} machines
          </span>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">BTC earned</p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]">
            {formatBtc(btc)}
            <span className="ml-2 text-sm font-medium text-slate-400">BTC</span>
          </p>
        </div>
        <div className="border-t border-white/8 pt-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Revenue</p>
          <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">{formatMoney(revenue)}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Clear storing vs cashout earnings summary for mining clients.
 */
export default function EarningsSplitSummary({
  title = 'Your earnings breakdown',
  description = 'What your machines earned this period, split by machine type.',
  btcStoring = 0,
  btcCashout = 0,
  revenueStoring = 0,
  revenueCashout = 0,
  btcTotal = null,
  revenueTotal = null,
  storingMachines = null,
  cashoutMachines = null,
  className = '',
}) {
  const totalBtc = btcTotal != null ? Number(btcTotal) : Number(btcStoring || 0) + Number(btcCashout || 0)
  const totalRevenue =
    revenueTotal != null ? Number(revenueTotal) : Number(revenueStoring || 0) + Number(revenueCashout || 0)
  const storingShare = totalBtc > 0 ? (Number(btcStoring || 0) / totalBtc) * 100 : 0
  const cashoutShare = totalBtc > 0 ? (Number(btcCashout || 0) / totalBtc) * 100 : 0

  return (
    <section className={`space-y-4 ${className}`.trim()}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">{description}</p>
        </div>
        <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Combined total</p>
          <p className="mt-1 font-mono text-sm font-semibold text-white">{formatBtc(totalBtc)} BTC</p>
          <p className="text-sm font-semibold text-slate-200">{formatMoney(totalRevenue)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SplitCard
          tone="storing"
          title="Earned as storing"
          subtitle="Mined by your storing machines and kept in your mining balance."
          btc={btcStoring}
          revenue={revenueStoring}
          machines={storingMachines}
        />
        <SplitCard
          tone="cashout"
          title="Earned as cashout"
          subtitle="Mined by your cashout machines and available toward payout decisions."
          btc={btcCashout}
          revenue={revenueCashout}
          machines={cashoutMachines}
        />
      </div>

      <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>Share of total BTC</span>
          <span>
            Storing {storingShare.toFixed(0)}% · Cashout {cashoutShare.toFixed(0)}%
          </span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-white/8">
          <div className="h-full transition-all" style={{ width: `${storingShare}%`, background: STORING_COLOR }} />
          <div className="h-full transition-all" style={{ width: `${cashoutShare}%`, background: CASHOUT_COLOR }} />
        </div>
      </div>
    </section>
  )
}

export { STORING_COLOR, CASHOUT_COLOR, formatBtc as formatSplitBtc, formatMoney as formatSplitMoney }
