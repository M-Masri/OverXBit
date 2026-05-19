import Header from '../section/Header'
import SiteFooter from '../section/SiteFooter'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsAuthenticated, selectSessionReady, setCredentials } from '../services/authSlice'
import { useLoginMutation } from '../services/overxApi'
import { setStoredToken } from '../services/sessionStorage'

function getErrorMessage(error) {
  return error?.data?.message || error?.message || 'Unable to sign in with these credentials.'
}

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const sessionReady = useSelector(selectSessionReady)
  const [login, { isLoading: authBusy }] = useLoginMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (sessionReady && isAuthenticated) {
    return <Navigate to="/portal/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const response = await login({ email, password }).unwrap()
      const token = response?.data?.token || ''

      if (!token) {
        throw new Error('The API did not return an access token.')
      }

      setStoredToken(token)
      dispatch(
        setCredentials({
          token,
          user: response?.data?.user || null,
        }),
      )
      navigate('/portal/dashboard', { replace: true })
    } catch (nextError) {
      setError(getErrorMessage(nextError))
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-hidden text-slate-100">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-5 pb-4 pt-28 sm:px-8 sm:pt-32">
        <section className="login-shell grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12 ">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#70A9DC]">Member Access</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl">
              Welcome Back to
              <br />
              <span className="text-gradient">Overxbit</span>
            </h1>
            <p className="mt-5 max-w-md leading-8 text-slate-300">
              Sign in to access premium trading signals, performance analytics, and your
              private member dashboard.
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <p className="login-bullet">Real-time signal stream with entry and exit levels.</p>
              <p className="login-bullet">Risk-managed strategy updates every week.</p>
              <p className="login-bullet">Direct support from our trading team.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form-panel h-[500px] p-6 sm:p-8">
            <h2 className="font-display text-3xl text-white">Sign In</h2>
            <p className="mt-2 text-sm text-slate-400">Use your account credentials to continue.</p>

            {error ? (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-200">Email</label>
                <input className="login-input mt-2" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200">Password</label>
                <div className="relative mt-2">
                  <input
                    className="login-input pr-11"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                          d="M10.48 10.47a2.2 2.2 0 003.06 3.06"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.88 5.09A11.8 11.8 0 0112 4.9c5.24 0 9.03 3.29 10.5 7.1a11.7 11.7 0 01-3.13 4.36"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.22 6.23A12.22 12.22 0 001.5 12c1.47 3.81 5.26 7.1 10.5 7.1 1.83 0 3.51-.4 5.02-1.08"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path
                          d="M1.5 12C2.97 8.19 6.76 4.9 12 4.9S21.03 8.19 22.5 12c-1.47 3.81-5.26 7.1-10.5 7.1S2.97 15.81 1.5 12z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={authBusy}
              className="mt-9 w-full rounded-xl bg-gradient-to-r from-[#70A9DC] to-[#3D6FA8] px-6 py-3 text-sm font-semibold uppercase tracking-[0.06em] text-white shadow-[0_12px_30px_rgba(61,111,168,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authBusy ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default LoginPage
