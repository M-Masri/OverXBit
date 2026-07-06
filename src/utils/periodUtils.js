function parseDate(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatPeriodDate(value) {
  const date = parseDate(value)
  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function resolvePeriodDate(period) {
  return (
    period?.end_date ||
    period?.endDate ||
    period?.ended_at ||
    period?.endedAt ||
    period?.to_date ||
    period?.toDate ||
    period?.start_date ||
    period?.startDate ||
    period?.started_at ||
    period?.startedAt ||
    period?.from_date ||
    period?.fromDate ||
    null
  )
}

export function getPeriodDisplayLabel(period) {
  if (!period) {
    return 'Unknown period'
  }

  const periodLabel = period.period || period.label || period.name || ''
  if (periodLabel) {
    return String(periodLabel)
  }

  const start = formatPeriodDate(
    period.start_date || period.startDate || period.started_at || period.startedAt || period.from_date || period.fromDate
  )
  const end = formatPeriodDate(
    period.end_date || period.endDate || period.ended_at || period.endedAt || period.to_date || period.toDate
  )

  if (start || end) {
    return `${start || 'N/A'} - ${end || 'N/A'}`
  }

  return 'Unknown period'
}

export function formatContractRange(contract) {
  if (!contract) {
    return null
  }

  const label =
    contract.period_label ||
    contract.label ||
    contract.name ||
    (contract.start_date && contract.end_date
      ? `${formatPeriodDate(contract.start_date)} → ${formatPeriodDate(contract.end_date)}`
      : null)

  return label ? String(label) : null
}

export function resolvePeriodContract(period, contracts = []) {
  if (!period) {
    return null
  }

  if (period.contract || period.mining_contract) {
    return period.contract || period.mining_contract
  }

  const contractId = period.contract_id || period.mining_contract_id || period.earning_contract_id
  const contractRows = Array.isArray(contracts) ? contracts : []

  if (contractId) {
    const matched = contractRows.find((contract) => Number(contract?.id) === Number(contractId))
    if (matched) {
      return matched
    }
  }

  const periodStart = parseDate(period.start_date || period.startDate)
  if (!periodStart || !contractRows.length) {
    return null
  }

  return (
    contractRows.find((contract) => {
      const contractStart = parseDate(contract?.start_date)
      const contractEnd = parseDate(contract?.end_date)
      if (!contractStart || !contractEnd) {
        return false
      }

      return periodStart >= contractStart && periodStart <= contractEnd
    }) || null
  )
}

export function getPeriodContractGroup(period, contracts = []) {
  if (!period) {
    return null
  }

  const contract = resolvePeriodContract(period, contracts)

  return (
    period.contract_label ||
    period.contract_period ||
    formatContractRange(contract) ||
    (period.contract_start_date && period.contract_end_date
      ? `${formatPeriodDate(period.contract_start_date)} → ${formatPeriodDate(period.contract_end_date)}`
      : null)
  )
}

export function enrichPeriods(periods = [], contracts = []) {
  return (Array.isArray(periods) ? periods : []).map((period) => {
    const contract = resolvePeriodContract(period, contracts)
    return {
      ...period,
      _contract: contract,
      _contractLabel: getPeriodContractGroup(period, contracts),
    }
  })
}

export function sortPeriodsForClient(periods = [], contracts = []) {
  const enriched = enrichPeriods(periods, contracts)

  return [...enriched].sort((a, b) => {
    const aContractStart = parseDate(a._contract?.start_date)?.getTime() || 0
    const bContractStart = parseDate(b._contract?.start_date)?.getTime() || 0

    if (bContractStart !== aContractStart) {
      return bContractStart - aContractStart
    }

    const aPeriodStart = parseDate(a.start_date || a.startDate)?.getTime() || 0
    const bPeriodStart = parseDate(b.start_date || b.startDate)?.getTime() || 0

    if (bPeriodStart !== aPeriodStart) {
      return bPeriodStart - aPeriodStart
    }

    return Number(b?.id || 0) - Number(a?.id || 0)
  })
}

export function buildPeriodGroups(periods = [], contracts = []) {
  const rows = sortPeriodsForClient(periods, contracts)
  const grouped = new Map()

  rows.forEach((period) => {
    const groupLabel = period._contractLabel || getPeriodContractGroup(period, contracts)
    const key = groupLabel || '__flat__'

    if (!grouped.has(key)) {
      grouped.set(key, {
        label: groupLabel,
        periods: [],
      })
    }

    grouped.get(key).periods.push(period)
  })

  const groups = Array.from(grouped.values())
  if (groups.length === 1 && !groups[0].label) {
    return [{ label: null, periods: groups[0].periods }]
  }

  return groups
}

export function resolveCurrentPeriodId(periodsList = [], referenceDate = new Date()) {
  const periods = Array.isArray(periodsList) ? periodsList : []
  if (!periods.length) {
    return null
  }

  const containing = periods.find((period) => {
    const start = parseDate(period.start_date || period.startDate)
    const end = parseDate(period.end_date || period.endDate)
    if (!start || !end) {
      return false
    }

    return referenceDate >= start && referenceDate <= end
  })

  if (containing?.id) {
    return Number(containing.id)
  }

  const monthYearLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(referenceDate)

  const byLabel = periods.find((period) => String(period.period || period.label || '').toLowerCase() === monthYearLabel.toLowerCase())
  if (byLabel?.id) {
    return Number(byLabel.id)
  }

  const byMonth = periods.find((period) => {
    const start = parseDate(period.start_date || period.startDate)
    if (!start) {
      return false
    }

    return start.getMonth() === referenceDate.getMonth() && start.getFullYear() === referenceDate.getFullYear()
  })

  if (byMonth?.id) {
    return Number(byMonth.id)
  }

  const pastPeriods = periods
    .filter((period) => {
      const start = parseDate(period.start_date || period.startDate)
      return start && start <= referenceDate
    })
    .sort((a, b) => {
      const aStart = parseDate(a.start_date || a.startDate)?.getTime() || 0
      const bStart = parseDate(b.start_date || b.startDate)?.getTime() || 0
      return bStart - aStart
    })

  if (pastPeriods[0]?.id) {
    return Number(pastPeriods[0].id)
  }

  const futurePeriods = periods
    .filter((period) => {
      const start = parseDate(period.start_date || period.startDate)
      return start && start > referenceDate
    })
    .sort((a, b) => {
      const aStart = parseDate(a.start_date || a.startDate)?.getTime() || Number.POSITIVE_INFINITY
      const bStart = parseDate(b.start_date || b.startDate)?.getTime() || Number.POSITIVE_INFINITY
      return aStart - bStart
    })

  if (futurePeriods[0]?.id) {
    return Number(futurePeriods[0].id)
  }

  return null
}

export function resolveDefaultPeriodId(rawMonthlyChart, dashboardPayload, periodsList = [], referenceDate = new Date()) {
  const currentPeriodId = resolveCurrentPeriodId(periodsList, referenceDate)
  if (currentPeriodId) {
    return currentPeriodId
  }

  const dashboardCandidates = [
    dashboardPayload?.current_period?.id,
    dashboardPayload?.period?.id,
    dashboardPayload?.latest_period?.id,
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
      const dateSeed = resolvePeriodDate(entry)
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

export function sortContractsForClient(contracts = []) {
  return [...(Array.isArray(contracts) ? contracts : [])].sort((a, b) => {
    const aStart = parseDate(a?.start_date)?.getTime() || 0
    const bStart = parseDate(b?.start_date)?.getTime() || 0
    return bStart - aStart
  })
}

export function getContractDisplayLabel(contract) {
  if (!contract) {
    return 'Unknown contract'
  }

  return (
    formatContractRange(contract) ||
    contract.period_label ||
    contract.label ||
    contract.name ||
    `Contract #${contract.id || 'N/A'}`
  )
}

export function resolveDefaultContractId(contracts = [], periods = [], referenceDate = new Date()) {
  const rows = sortContractsForClient(contracts)
  if (!rows.length) {
    return null
  }

  const active = rows.find((contract) => {
    const start = parseDate(contract?.start_date)
    const end = parseDate(contract?.end_date)
    if (!start || !end) {
      return false
    }

    return referenceDate >= start && referenceDate <= end
  })

  if (active?.id) {
    return Number(active.id)
  }

  const withPeriods = rows.find((contract) => filterPeriodsByContract(periods, rows, contract.id).length > 0)

  if (withPeriods?.id) {
    return Number(withPeriods.id)
  }

  return Number(rows[0].id)
}

export function filterPeriodsByContract(periods = [], contracts = [], contractId) {
  const periodRows = Array.isArray(periods) ? periods : []
  const contractRows = Array.isArray(contracts) ? contracts : []
  const numericContractId = Number(contractId)

  if (!Number.isFinite(numericContractId) || numericContractId <= 0) {
    return periodRows
  }

  const contract = contractRows.find((entry) => Number(entry?.id) === numericContractId)
  const contractStart = parseDate(contract?.start_date)
  const contractEnd = parseDate(contract?.end_date)

  return periodRows.filter((period) => {
    const linkedId = Number(period?.contract_id || period?.mining_contract_id || period?.earning_contract_id)
    if (Number.isFinite(linkedId) && linkedId === numericContractId) {
      return true
    }

    const periodStart = parseDate(period?.start_date || period?.startDate)
    if (!periodStart || !contractStart || !contractEnd) {
      return false
    }

    return periodStart >= contractStart && periodStart <= contractEnd
  })
}

function buildDailyRowsFromTransactions(transactions = []) {
  const byDate = new Map()

  transactions.forEach((entry) => {
    const dateSeed =
      entry?.date ||
      entry?.earned_at ||
      entry?.earnedAt ||
      entry?.created_at ||
      entry?.createdAt ||
      entry?.requested_at ||
      null

    if (!dateSeed) {
      return
    }

    const parsed = parseDate(dateSeed)
    if (!parsed) {
      return
    }

    const key = parsed.toISOString().slice(0, 10)

    if (!byDate.has(key)) {
      byDate.set(key, { btc: 0, revenue: 0 })
    }

    const row = byDate.get(key)
    row.btc += Number(entry?.btc_amount ?? entry?.btc ?? entry?.total_btc_earned ?? 0)
    row.revenue += Number(entry?.revenue ?? entry?.total_revenue ?? entry?.amount ?? entry?.usd ?? 0)
  })

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values], index) => ({
      id: `tx-day-${index}`,
      date,
      btc: Number.isFinite(values.btc) ? values.btc : 0,
      revenue: Number.isFinite(values.revenue) ? values.revenue : 0,
    }))
}

function buildDailyRowsFromPeriodRange(selectedPeriod) {
  const start = parseDate(selectedPeriod?.start_date || selectedPeriod?.startDate)
  const end = parseDate(selectedPeriod?.end_date || selectedPeriod?.endDate)

  if (!start || !end || end < start) {
    return []
  }

  const rows = []
  const cursor = new Date(start)

  while (cursor <= end) {
    rows.push({
      id: `range-day-${rows.length}`,
      date: cursor.toISOString().slice(0, 10),
      btc: 0,
      revenue: 0,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return rows
}

export function buildMonthlyStatusSeriesFromPeriods(periods = []) {
  return (Array.isArray(periods) ? periods : []).map((period, index) => {
    const revenue = Number(period?.total_revenue || 0)
    const status = String(period?.status || '').toLowerCase()
    const decision = String(period?.client_decision || '').toLowerCase()
    let cashedOut = 0
    let stored = Number.isFinite(revenue) ? revenue : 0

    if (status === 'cashed_out' || status === 'paid' || decision === 'cashed_out' || decision === 'cashout') {
      cashedOut = stored
      stored = 0
    }

    return {
      id: period?.id || `period-${index}`,
      label: getPeriodDisplayLabel(period),
      cashedOut,
      stored,
    }
  })
}

export function buildDailyPeriodRows(chartPayload, selectedPeriod = null) {
  const chart = chartPayload?.chart || {}
  const dailyEarnings = Array.isArray(chartPayload?.dailyEarnings) ? chartPayload.dailyEarnings : []

  if (dailyEarnings.length) {
    return dailyEarnings.map((entry, index) => ({
      id: entry?.id || entry?.date || entry?.day || `day-${index}`,
      date: entry?.date || entry?.day || entry?.label || entry?.earned_at || entry?.earnedAt || null,
      btc: Number(entry?.btc ?? entry?.btc_earned ?? entry?.total_btc_earned ?? entry?.btc_amount ?? 0),
      revenue: Number(entry?.revenue ?? entry?.total_revenue ?? entry?.amount ?? entry?.usd ?? 0),
    }))
  }

  const labels = Array.isArray(chart?.labels) ? chart.labels : []
  const dailyRevenue = Array.isArray(chart?.daily_revenue) ? chart.daily_revenue : []
  const dailyBtc = Array.isArray(chart?.daily_btc)
    ? chart.daily_btc
    : Array.isArray(chart?.daily_btc_earned)
      ? chart.daily_btc_earned
      : []

  if (labels.length) {
    return labels.map((label, index) => ({
      id: `day-${index}`,
      date: label,
      btc: Number(dailyBtc[index] ?? 0),
      revenue: Number(dailyRevenue[index] ?? 0),
    }))
  }

  const transactionRows = buildDailyRowsFromTransactions(chartPayload?.transactions)
  if (transactionRows.length) {
    return transactionRows
  }

  return buildDailyRowsFromPeriodRange(selectedPeriod)
}

export function buildDailyRevenueSeriesFromPayload(chartPayload, selectedPeriod = null) {
  return buildDailyPeriodRows(chartPayload, selectedPeriod).map((row, index) => ({
    id: row.id || `daily-${index}`,
    label: row.date,
    value: Number(row.revenue || 0),
  }))
}
