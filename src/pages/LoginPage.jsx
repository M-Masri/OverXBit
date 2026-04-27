import Header from '../section/Header'
import SiteFooter from '../section/SiteFooter'

function LoginPage() {
  return (
    <div className="min-h-screen overflow-x-hidden text-slate-100">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-5 pb-4 pt-28 sm:px-8 sm:pt-32">
        <section className="login-shell grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12 ">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-orange-300">Member Access</p>
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

          <form className="login-form-panel h-[500px] p-6 sm:p-8">
            <h2 className="font-display text-3xl text-white">Sign In</h2>
            <p className="mt-2 text-sm text-slate-400">Use your account credentials to continue.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-200">Email</label>
                <input className="login-input mt-2" type="email" placeholder="you@example.com" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200">Password</label>
                <input className="login-input mt-2" type="password" placeholder="Enter your password" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-900" />
                Remember me
              </label>
              <a href="#" className="text-sm text-orange-300 hover:text-orange-200">
                Forgot password?
              </a>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.06em] text-white shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition hover:brightness-110"
            >
              Login
            </button>

            <p className="mt-5 text-center text-sm text-slate-400">
              New to Overxbit? <a href="#" className="text-orange-300 hover:text-orange-200">Create account</a>
            </p>
          </form>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default LoginPage
