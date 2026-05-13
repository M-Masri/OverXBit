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
            <p className="text-xs uppercase tracking-[0.22em] text-[#2ABBAF]">Member Access</p>
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
                <input className="login-input mt-2" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-900" />
                Remember me
              </label>
              <a href="#" className="text-sm text-[#2ABBAF] hover:text-[#2ABBAF]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={authBusy}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#2ABBAF] to-[#2ABBAF] px-6 py-3 text-sm font-semibold uppercase tracking-[0.06em] text-white shadow-[0_12px_30px_rgba(42,187,175,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
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
