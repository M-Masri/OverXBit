import { useMemo } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaArrowTrendUp,
  FaBitcoin,
  FaChartLine,
  FaChevronRight,
  FaClock,
  FaCreditCard,
  FaGlobe,
  FaLayerGroup,
  FaMoneyBillTransfer,
  FaRotate,
  FaShieldHalved,
  FaWaveSquare,
  FaUserLarge,
} from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import brandLogo from '../assets/OVERXBIT LOGO-04.png'
import { clearSession, selectUser } from '../services/authSlice'
import {
  overxApi,
  useGetPortalDashboardQuery,
  useGetPortalHistoryQuery,
  useGetPortalMethodsQuery,
  useGetPortalPeriodsQuery,
  useGetPortalProfileQuery,
  useLogoutMutation,
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

    return [
      { label: 'Stored BTC', value: formatBtc(stats.stored_balance_btc), hint: 'Current reserve', accent: true },
      { label: 'Revenue', value: formatMoney(stats.total_revenue), hint: 'Gross generated' },
      { label: 'Pending', value: String(stats.pending_periods || 0), hint: 'Periods awaiting action' },
      { label: 'Machines', value: String(stats.total_machines || 0), hint: 'Active contract fleet' },
    ]
  }

  if (section.slug === 'periods') {
    return [
      { label: 'Listed Periods', value: String(payload.periodsMeta?.total || payload.periods?.length || 0), hint: 'Visible in the ledger', accent: true },
      { label: 'Ready To Act', value: String(payload.pendingPeriods?.length || 0), hint: 'Client decision window' },
      { label: 'Page Size', value: String(payload.periodsMeta?.per_page || payload.periods?.length || 0), hint: 'Fetched this view' },
      { label: 'Client', value: user?.name || 'OverXBit', hint: 'Authenticated profile' },
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
    <div className={`portal-stat-card ${item.accent ? 'portal-stat-card-accent' : ''}`}>
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

function DashboardView({ payload }) {
  const dashboard = payload.dashboard
  const stats = dashboard?.stats || {}
  const client = dashboard?.client

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Stored Balance" value={formatBtc(stats.stored_balance_btc)} tone="accent" />
        <StatCard label="Stored Revenue" value={formatMoney(stats.stored_balance_revenue)} />
        <StatCard label="Total Revenue" value={formatMoney(stats.total_revenue)} />
        <StatCard label="Total Cashed Out" value={formatMoney(stats.total_cashed_out)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Client Snapshot</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{client?.name || 'Client overview'}</h3>
            </div>
            <div className="portal-chip">
              <FaShieldHalved className="text-[#2ABBAF]" />
              Sanctum Connected
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="portal-metric-block"><span>Total Machines</span><strong>{stats.total_machines || 0}</strong></div>
            <div className="portal-metric-block"><span>Storing Machines</span><strong>{stats.storing_machines || 0}</strong></div>
            <div className="portal-metric-block"><span>Cashout Machines</span><strong>{stats.cashout_machines || 0}</strong></div>
            <div className="portal-metric-block"><span>Pending Requests</span><strong>{stats.pending_requests || 0}</strong></div>
          </div>
        </div>

        <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Action Window</p>
          <div className="mt-6 space-y-4">
            <div className="portal-list-row"><span>Pending Periods</span><strong>{stats.pending_periods || 0}</strong></div>
            <div className="portal-list-row"><span>Total BTC Earned</span><strong>{formatBtc(stats.total_btc_earned)}</strong></div>
            <div className="portal-list-row"><span>Client Email</span><strong>{client?.email || 'Not available'}</strong></div>
            <div className="portal-list-row"><span>Phone</span><strong>{client?.phone || 'Not available'}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PeriodsView({ payload }) {
  const periods = payload.periods || []
  const pendingPeriods = payload.pendingPeriods || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Visible Periods" value={String(payload.periodsMeta?.total || periods.length || 0)} tone="accent" />
        <StatCard label="Eligible For Action" value={String(pendingPeriods.length)} />
        <StatCard label="Page Size" value={String(payload.periodsMeta?.per_page || periods.length || 0)} />
      </div>

      <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
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
                <div><span className="portal-badge">{period.status || 'unknown'}</span></div>
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

      <div className="portal-panel rounded-[1.9rem] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Cashout Details</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {methods.length ? (
            methods.map((method) => (
              <div key={method.id} className="portal-method-card">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{method.label || 'Untitled method'}</p>
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
                      <div className="portal-list-row"><span>Wallet</span><strong>{method.crypto_wallet_address || 'Not set'}</strong></div>
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

function ContentRenderer({ section, payload }) {
  if (section.slug === 'dashboard') {
    return <DashboardView payload={payload} />
  }

  if (section.slug === 'periods') {
    return <PeriodsView payload={payload} />
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

function ClientPortalPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const activeSection = resolveSection(location.pathname)
  const [logoutRequest] = useLogoutMutation()
  const dashboardQuery = useGetPortalDashboardQuery(undefined, { skip: activeSection.slug !== 'dashboard' })
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
  const overviewCards = getOverviewCards(activeSection, payload, user)
  const insightRows = getInsightRows(activeSection, payload, user)

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

  function handleRefresh() {
    activeQuery.refetch()
  }

  return (
    <div className="bg-grid min-h-screen overflow-x-hidden text-slate-100">
      <div className="portal-backdrop-glow" />

      <main className="relative z-10 w-full p-0">
        <section className="portal-shell">
          <aside className="portal-sidebar">
            <div className="portal-sidebar-brand">
              <Link to="/" className="relative inline-flex h-12 w-44 items-center">
                <img src={brandLogo} alt="OVERXBIT" className="pointer-events-none absolute left-0 top-1/2 h-28 w-48 -translate-y-1/2 select-none" />
              </Link>
            </div>

            <div className="portal-sidebar-profile">
              <div className="portal-avatar-ring">
                <span>{(user?.name || 'O').slice(0, 1).toUpperCase()}</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">{user?.client?.name || user?.name || 'OverXBit Client'}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">Private portal access</p>
              </div>
            </div>

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
                      <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">{section.eyebrow}</span>
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

          <section className="portal-main p-5">
            <header className="portal-topbar">
              <div>
                <p className="portal-subtitle">{activeSection.eyebrow}</p>
                <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{activeSection.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{activeSection.description}</p>
              </div>

              <div className="portal-topbar-actions">
                <div className="portal-chip"><FaShieldHalved className="text-[#2ABBAF]" />{user?.email || 'Authenticated client'}</div>
                <button type="button" onClick={handleRefresh} className="portal-secondary-button"><FaRotate />Refresh section</button>
              </div>
            </header>

            <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((item) => (
                <OverviewCard key={item.label} item={item} />
              ))}
            </section>

            <section className="portal-panel mt-6 overflow-hidden rounded-[1.75rem]">
              <div className="border-b border-white/10 bg-gradient-to-r from-[#17304f]/28 via-transparent to-[#2ABBAF]/10 px-6 py-5 sm:px-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#2ABBAF]">Data Grid</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{activeSection.label} Stream</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                      Structured endpoint output with the same OverXBit tone, optimized for quick scanning.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
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
                    <ContentRenderer section={activeSection} payload={payload} />
                  </div>
                ) : null}
              </div>
            </section>
          </section>
        </section>
      </main>
    </div>
  )
}

export default ClientPortalPage