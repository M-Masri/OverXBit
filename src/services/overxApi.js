import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://overx.sawatech.ae/api').replace(/\/$/, '')

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token

    headers.set('Accept', 'application/json')

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
  responseHandler: async (response) => {
    const text = await response.text()

    if (!text) {
      return null
    }

    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  },
})

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.data?.message) {
    return {
      error: {
        ...result.error,
        message: result.error.data.message,
      },
    }
  }

  return result
}

function unwrapResult(result) {
  if (result.error) {
    return { error: result.error }
  }

  return { data: result.data }
}

export const overxApi = createApi({
  reducerPath: 'overxApi',
  baseQuery,
  tagTypes: [
    'Auth',
    'Dashboard',
    'Periods',
    'History',
    'Methods',
    'Profile',
    'Chart',
    'Services',
    'TradingDashboard',
    'TradingPeriods',
    'TradingHistory',
    'TradingContracts',
    'TradingChart',
  ],
  endpoints: (builder) => ({
    getPublicServices: builder.query({
      query: () => '/services',
      transformResponse: (response) => {
        const rows = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []
        return {
          services: rows.map((service) => ({
            id: service?.id,
            number: service?.number,
            title: service?.title,
            card_image: service?.card_image,
          })),
        }
      },
      providesTags: ['Services'],
    }),
    getPublicServiceById: builder.query({
      query: (serviceId) => `/services/${serviceId}`,
      transformResponse: (response) => ({
        service: response?.data || null,
      }),
      providesTags: (_result, _error, serviceId) => [{ type: 'Services', id: String(serviceId) }],
    }),
    submitContact: builder.mutation({
      query: (payload) => ({
        url: '/contact',
        method: 'POST',
        body: payload,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'Dashboard', 'Periods', 'History', 'Methods', 'Profile'],
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/change-password',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query({
      query: () => '/me',
      providesTags: ['Auth'],
    }),
    getPortalDashboard: builder.query({
      query: () => '/client/dashboard',
      transformResponse: (response) => ({
        dashboard: response?.data || null,
      }),
      providesTags: ['Dashboard'],
    }),
    getPortalPeriods: builder.query({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const [periodsResult, pendingResult] = await Promise.all([
          fetchWithBQ('/client/earning-periods'),
          fetchWithBQ('/client/earning-periods/pending'),
        ])

        const periods = unwrapResult(periodsResult)
        if (periods.error) {
          return { error: periods.error }
        }

        const pending = unwrapResult(pendingResult)
        if (pending.error) {
          return { error: pending.error }
        }

        return {
          data: {
            periods: periods.data?.data || [],
            periodsMeta: periods.data?.meta || null,
            pendingPeriods: pending.data?.data || [],
          },
        }
      },
      providesTags: ['Periods'],
    }),
    getPortalPeriodsChart: builder.query({
      query: () => '/client/earning-periods/chart',
      transformResponse: (response) => ({
        chart: response?.data || response?.chart || response || [],
      }),
      providesTags: ['Chart'],
    }),
    getPortalSinglePeriodChart: builder.query({
      query: (earningPeriodId) => `/client/earning-periods/${earningPeriodId}/chart`,
      transformResponse: (response) => ({
        period: response?.data?.period || null,
        chart: response?.data?.chart || {},
        dailyEarnings: response?.data?.daily_earnings || [],
        transactions: response?.data?.transactions || [],
        storedEarning: response?.data?.stored_earning || null,
      }),
      providesTags: (_result, _error, earningPeriodId) => [{ type: 'Chart', id: `period-${earningPeriodId}` }],
    }),
    requestPeriodCashout: builder.mutation({
      query: ({ earning_period_id, token }) => ({
        url: `/client/earning-periods/${earning_period_id}/request-cashout`,
        method: 'POST',
        body: {
          earning_period_id,
          token,
        },
      }),
      invalidatesTags: ['Periods', 'Dashboard', 'History'],
    }),
    requestPeriodStore: builder.mutation({
      query: ({ earning_period_id, token }) => ({
        url: `/client/earning-periods/${earning_period_id}/request-store`,
        method: 'POST',
        body: {
          earning_period_id,
          token,
        },
      }),
      invalidatesTags: ['Periods', 'Dashboard', 'History'],
    }),
    downloadAllPeriodReports: builder.mutation({
      query: ({ token }) => ({
        url: '/client/earning-periods/report',
        method: 'GET',
        params: token ? { token } : undefined,
      }),
    }),
    downloadPeriodReport: builder.mutation({
      query: ({ earning_period_id, token }) => ({
        url: `/client/earning-periods/${earning_period_id}/report`,
        method: 'GET',
        params: token ? { token } : undefined,
      }),
    }),
    getPortalHistory: builder.query({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const [transactionsResult, cashoutsResult, storedResult] = await Promise.all([
          fetchWithBQ('/client/transactions'),
          fetchWithBQ('/client/cashouts'),
          fetchWithBQ('/client/stored-earnings'),
        ])

        const transactions = unwrapResult(transactionsResult)
        if (transactions.error) {
          return { error: transactions.error }
        }

        const cashouts = unwrapResult(cashoutsResult)
        if (cashouts.error) {
          return { error: cashouts.error }
        }

        const stored = unwrapResult(storedResult)
        if (stored.error) {
          return { error: stored.error }
        }

        return {
          data: {
            transactions: transactions.data?.data || [],
            transactionsMeta: transactions.data?.meta || null,
            cashouts: cashouts.data?.data || [],
            cashoutsMeta: cashouts.data?.meta || null,
            storedEarnings: stored.data?.data || [],
            storedMeta: stored.data?.meta || null,
          },
        }
      },
      providesTags: ['History'],
    }),
    getPortalMethods: builder.query({
      query: () => '/client/cashout-details',
      transformResponse: (response) => ({
        methods: response?.data || [],
      }),
      providesTags: ['Methods'],
    }),
    createPortalCashoutDetails: builder.mutation({
      query: (payload) => ({
        url: '/client/cashout-details',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Methods'],
    }),
    getPortalProfile: builder.query({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const [profileResult, contractsResult] = await Promise.all([
          fetchWithBQ('/client/profile'),
          fetchWithBQ('/client/contracts'),
        ])

        const profile = unwrapResult(profileResult)
        if (profile.error) {
          return { error: profile.error }
        }

        const contracts = unwrapResult(contractsResult)
        if (contracts.error) {
          return { error: contracts.error }
        }

        return {
          data: {
            profile: profile.data?.data || null,
            contracts: contracts.data?.data || [],
            contractsMeta: contracts.data?.meta || null,
          },
        }
      },
      providesTags: ['Profile'],
    }),
    updatePortalProfile: builder.mutation({
      query: (payload) => ({
        url: '/client/profile',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Profile', 'Dashboard'],
    }),
    getTradingContracts: builder.query({
      query: (params = {}) => ({
        url: '/client/trading-contracts',
        params,
      }),
      transformResponse: (response) => ({
        contracts: response?.data || [],
        contractsMeta: response?.meta || null,
      }),
      providesTags: ['TradingContracts'],
    }),
    getTradingContractById: builder.query({
      query: (contractId) => `/client/trading-contracts/${contractId}`,
      transformResponse: (response) => ({
        contract: response?.data || null,
      }),
      providesTags: (_result, _error, contractId) => [{ type: 'TradingContracts', id: String(contractId) }],
    }),
    getTradingEarnings: builder.query({
      query: (params = {}) => ({
        url: '/client/trading-earnings',
        params,
      }),
      transformResponse: (response) => ({
        earnings: response?.data || [],
        earningsMeta: response?.meta || null,
      }),
      providesTags: ['TradingContracts'],
    }),
    getTradingPeriods: builder.query({
      async queryFn(params = {}, _api, _extraOptions, fetchWithBQ) {
        const queryString = new URLSearchParams(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
        ).toString()
        const periodsPath = queryString ? `/client/trading-periods?${queryString}` : '/client/trading-periods'
        const [periodsResult, pendingResult] = await Promise.all([
          fetchWithBQ(periodsPath),
          fetchWithBQ('/client/trading-periods/pending'),
        ])

        const periods = unwrapResult(periodsResult)
        if (periods.error) {
          return { error: periods.error }
        }

        const pending = unwrapResult(pendingResult)
        if (pending.error) {
          return { error: pending.error }
        }

        return {
          data: {
            periods: periods.data?.data || [],
            periodsMeta: periods.data?.meta || null,
            pendingPeriods: pending.data?.data || [],
          },
        }
      },
      providesTags: ['TradingPeriods'],
    }),
    getTradingPeriodById: builder.query({
      query: (periodId) => `/client/trading-periods/${periodId}`,
      transformResponse: (response) => ({
        period: response?.data || null,
      }),
      providesTags: (_result, _error, periodId) => [{ type: 'TradingPeriods', id: String(periodId) }],
    }),
    getTradingPeriodsChart: builder.query({
      query: () => '/client/trading-periods/chart',
      transformResponse: (response) => ({
        chart: response?.data || {},
      }),
      providesTags: ['TradingChart'],
    }),
    getTradingStoredBalance: builder.query({
      query: () => '/client/trading-stored-balance',
      transformResponse: (response) => ({
        storedBalance: response?.data?.stored_balance ?? 0,
      }),
      providesTags: ['TradingDashboard'],
    }),
    getTradingHistory: builder.query({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const [cashoutsResult, storedResult] = await Promise.all([
          fetchWithBQ('/client/trading-cashouts'),
          fetchWithBQ('/client/trading-stored-earnings'),
        ])

        const cashouts = unwrapResult(cashoutsResult)
        if (cashouts.error) {
          return { error: cashouts.error }
        }

        const stored = unwrapResult(storedResult)
        if (stored.error) {
          return { error: stored.error }
        }

        return {
          data: {
            cashouts: cashouts.data?.data || [],
            cashoutsMeta: cashouts.data?.meta || null,
            storedEarnings: stored.data?.data || [],
            storedMeta: stored.data?.meta || null,
          },
        }
      },
      providesTags: ['TradingHistory'],
    }),
    requestTradingCashout: builder.mutation({
      query: ({ trading_period_id, cashout_details_id }) => ({
        url: `/client/trading-periods/${trading_period_id}/request-cashout`,
        method: 'POST',
        body: cashout_details_id ? { cashout_details_id } : {},
      }),
      invalidatesTags: ['TradingPeriods', 'TradingDashboard', 'TradingHistory', 'TradingChart'],
    }),
    requestTradingStore: builder.mutation({
      query: ({ trading_period_id }) => ({
        url: `/client/trading-periods/${trading_period_id}/request-store`,
        method: 'POST',
      }),
      invalidatesTags: ['TradingPeriods', 'TradingDashboard', 'TradingHistory', 'TradingChart'],
    }),
  }),
})

export const {
  useGetPublicServicesQuery,
  useGetPublicServiceByIdQuery,
  useSubmitContactMutation,
  useCreatePortalCashoutDetailsMutation,
  useChangePasswordMutation,
  useGetMeQuery,
  useGetPortalDashboardQuery,
  useGetPortalHistoryQuery,
  useGetPortalMethodsQuery,
  useGetPortalSinglePeriodChartQuery,
  useGetPortalPeriodsQuery,
  useGetPortalPeriodsChartQuery,
  useGetPortalProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useDownloadAllPeriodReportsMutation,
  useDownloadPeriodReportMutation,
  useRequestPeriodCashoutMutation,
  useRequestPeriodStoreMutation,
  useUpdatePortalProfileMutation,
  useGetTradingContractsQuery,
  useGetTradingContractByIdQuery,
  useGetTradingEarningsQuery,
  useGetTradingPeriodsQuery,
  useGetTradingPeriodByIdQuery,
  useGetTradingPeriodsChartQuery,
  useGetTradingStoredBalanceQuery,
  useGetTradingHistoryQuery,
  useRequestTradingCashoutMutation,
  useRequestTradingStoreMutation,
} = overxApi