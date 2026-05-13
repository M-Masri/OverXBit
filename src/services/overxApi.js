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
  tagTypes: ['Auth', 'Dashboard', 'Periods', 'History', 'Methods', 'Profile'],
  endpoints: (builder) => ({
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
  }),
})

export const {
  useGetMeQuery,
  useGetPortalDashboardQuery,
  useGetPortalHistoryQuery,
  useGetPortalMethodsQuery,
  useGetPortalPeriodsQuery,
  useGetPortalProfileQuery,
  useLoginMutation,
  useLogoutMutation,
} = overxApi