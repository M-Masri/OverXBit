import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  FaArrowRight,
  FaBitcoin,
  FaCalendarDays,
  FaChartLine,
  FaCircleCheck,
  FaCoins,
  FaDatabase,
  FaGaugeHigh,
  FaHardDrive,
  FaListCheck,
  FaMoneyBillWave,
  FaServer,
  FaShieldHalved,
  FaWallet,
} from 'react-icons/fa6'
import Header from '../section/Header'
import SiteFooter from '../section/SiteFooter'
import { getInViewMotion, revealVariants } from '../lib/motion'

const cycleSteps = [
  {
    title: 'Create Your Account',
    description: 'Register and access your personal mining dashboard.',
  },
  {
    title: 'Choose a Monthly Plan',
    description: 'Select the investment plan that matches your preferred budget.',
  },
  {
    title: 'Join the Mining Pool',
    description: 'Your subscription amount is added to the active mining pool.',
  },
  {
    title: 'Track Your Period',
    description: 'Monitor your current cycle, estimated earnings, and stored balance.',
  },
  {
    title: 'Withdraw or Store Earnings',
    description: 'When the period ends, choose whether to cash out or store your earnings.',
  },
]

const investmentPlans = [
  {
    name: 'Starter Plan',
    summary: 'For new investors who want to start small.',
    cta: 'Start With Starter Plan',
    accent: 'from-[#0ea5e9]/35 via-[#1d4ed8]/20 to-[#0b1226]/95',
    rows: [
      ['Monthly Subscription', '$___'],
      ['Mining Period', '30 Days'],
      ['Pool Access', 'Shared Mining Pool'],
      ['Earnings Type', 'Estimated BTC Mining Rewards'],
      ['End of Period Options', 'Withdraw or Store'],
      ['Dashboard Tracking', 'Included'],
    ],
  },
  {
    name: 'Growth Plan',
    summary: 'For users who want a stronger mining share and better earning potential.',
    cta: 'Choose Growth Plan',
    accent: 'from-[#0ea5e9]/35 via-[#1d4ed8]/20 to-[#0b1226]/95',
    rows: [
      ['Monthly Subscription', '$___'],
      ['Mining Period', '30 Days'],
      ['Pool Access', 'Priority Shared Pool'],
      ['Earnings Type', 'Estimated BTC Mining Rewards'],
      ['End of Period Options', 'Withdraw or Store'],
      ['Dashboard Tracking', 'Included'],
      ['Monthly Report', 'Included'],
    ],
  },
  {
    name: 'Advanced Plan',
    summary: 'For investors looking for a larger mining allocation.',
    cta: 'Invest With Advanced Plan',
    accent: 'from-[#60a5fa]/30 via-[#2563eb]/20 to-[#0b1226]/95',
    rows: [
      ['Monthly Subscription', '$___'],
      ['Mining Period', '30 Days'],
      ['Pool Access', 'Advanced Mining Pool'],
      ['Earnings Type', 'Estimated BTC Mining Rewards'],
      ['End of Period Options', 'Withdraw or Store'],
      ['Dashboard Tracking', 'Included'],
      ['Monthly Report', 'Included'],
      ['Dedicated Support', 'Included'],
    ],
  },
]

const poolMiniCards = [
  {
    title: 'Active Pool Balance',
    detail: 'Total funds currently allocated to the active mining pool.',
    icon: FaWallet,
  },
  {
    title: 'Mining Machines',
    detail: 'Bitcoin mining hardware connected to the system.',
    icon: FaServer,
  },
  {
    title: 'Current Period',
    detail: 'The active 30-day cycle where mining rewards are generated.',
    icon: FaCalendarDays,
  },
  {
    title: 'User Share',
    detail: 'Your estimated share based on your active subscription plan.',
    icon: FaChartLine,
  },
]

const dashboardItems = [
  'Active Plan',
  'Current Period Status',
  'Start Date',
  'End Date',
  'Pool Share',
  'Estimated Earnings',
  'Available Earnings',
  'Stored Balance',
  'Cashout Requests',
  'Transaction History',
]

const whyChooseCards = [
  {
    title: 'Monthly Cycles',
    detail: 'Every investment runs through a clear period with a start and end date.',
    icon: FaCalendarDays,
  },
  {
    title: 'Flexible Earnings Options',
    detail: 'Withdraw your earnings or store them at the end of the period.',
    icon: FaMoneyBillWave,
  },
  {
    title: 'Clear Dashboard',
    detail: 'Track your plan, earnings, and history from one place.',
    icon: FaGaugeHigh,
  },
  {
    title: 'Automated Calculations',
    detail: 'Revenue is calculated based on mining output and BTC price.',
    icon: FaListCheck,
  },
]

const faqItems = [
  {
    q: 'When do I receive my earnings?',
    a: 'Earnings become available after the active mining period is completed.',
  },
  {
    q: 'Can I withdraw before the period ends?',
    a: 'Withdrawals are only available after the period is completed and the earnings are confirmed.',
  },
  {
    q: 'Are profits guaranteed?',
    a: 'No. Mining rewards are variable and depend on Bitcoin mining performance and market conditions.',
  },
  {
    q: 'What happens if I store my earnings?',
    a: 'Stored earnings remain inside your account balance and can be managed from your dashboard.',
  },
  {
    q: 'Can I upgrade my plan?',
    a: 'Yes, users can upgrade their plan depending on the available investment options.',
  },
  {
    q: 'How are earnings calculated?',
    a: 'Earnings are calculated based on mining output, BTC price, pool share, and operational costs.',
  },
]

function Eyebrow({ children }) {
  return <p className="text-xs uppercase tracking-[0.24em] text-[#8ec3ef]">{children}</p>
}

function InvestmentPlanPage() {
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-hidden bg-grid text-slate-100">
      <Header />

      <motion.section className="relative w-full overflow-x-clip overflow-y-hidden" variants={revealVariants} {...inViewMotion}>
        <div className="absolute inset-0">
          <img src="/assets/hero-static.webp" alt="" className="h-full w-full object-cover opacity-30" loading="eager" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_40%,rgba(112,169,220,0.2)_0%,rgba(10,20,44,0.82)_48%,rgba(5,10,24,0.96)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,24,0.92)_0%,rgba(6,14,34,0.72)_55%,rgba(5,10,24,0.94)_100%)]" />

        <div className="relative z-10 mx-auto flex h-[550px] w-full max-w-7xl flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:px-8 sm:pb-20 sm:pt-32">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8EC3EF]">INVESTMENT PLAN</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl">Choose Your Bitcoin Mining Investment Plan</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Start your monthly mining journey by joining a shared Bitcoin mining pool. Subscribe to a plan, track your active period,
            and decide at the end whether to withdraw your earnings or store them for future growth.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#plans" className="inline-flex items-center gap-2 rounded-full border border-[#70A9DC]/45 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-[#70A9DC]/70 hover:bg-white/10">
              View Plans
              <FaArrowRight className="text-xs" />
            </a>
            <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full border border-[#70A9DC]/45 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-[#70A9DC]/70 hover:bg-white/10">
              How It Works
            </a>
          </div>
        </div>
      </motion.section>

      <main className="mx-auto w-full max-w-7xl overflow-x-clip px-5 pb-16 pt-12 -mt-12 sm:px-8 sm:pt-14">

        <section id="how-it-works" className="mt-14 rounded-[1.7rem] p-6 sm:p-8">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">How The Investment <span className='text-gradient'>Cycle Works</span></h2>
          <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-300 sm:text-base">
            Our system is built around a simple monthly mining cycle. Each user subscribes to a plan, and the investment amount is added to the
            mining pool. During the active period, Bitcoin mining machines generate rewards based on mining performance, BTC market price,
            network difficulty, and operational costs.
          </p>
          <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-300 sm:text-base">
            At the end of each period, you can choose to withdraw your available earnings or keep them stored inside your account.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cycleSteps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-white/12 bg-[#071321]/55 p-4">
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[#70a9dc]/45 bg-[#70a9dc]/18 px-2 text-xs font-semibold text-[#b5dbfa]">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="plans" className="mt-14">
          <div className="text-center">
            <Eyebrow>Investment Plans</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Choose Your Monthly <span className='text-gradient'>Mining Plan</span></h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {investmentPlans.map((plan) => (
              <article key={plan.name} className={`rounded-[1.7rem] border border-white/12 bg-gradient-to-br ${plan.accent} p-5`}>
                <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{plan.summary}</p>

                <ul className="mt-5 space-y-2">
                  {plan.rows.map(([label, value]) => (
                    <li key={`${plan.name}-${label}`} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-[#071321]/58 px-3 py-2.5 text-sm">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-right font-semibold text-white">{value}</span>
                    </li>
                  ))}
                </ul>

                <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#70a9dc] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
        </section>


        <section className="mt-14 rounded-[1.7rem] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <Eyebrow>Why Choose This Plan</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Simple, Transparent<br /><span className='text-gradient'>and Easy to Track</span> </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {whyChooseCards.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/12 bg-[#071321]/58 p-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8ec3ef]/45 bg-[#8ec3ef]/12 text-[#bfe2ff]">
                      <item.icon />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* <section className="relative mt-14 overflow-hidden rounded-[2rem] border border-red-300/20 bg-[linear-gradient(155deg,rgba(127,29,29,0.3),rgba(15,23,42,0.96)_55%,rgba(2,6,23,0.98))] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 top-2 h-44 w-44 rounded-full bg-red-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <article>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-300/35 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-red-100">
                <FaShieldHalved />
                Risk Disclosure
              </div>

              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Important Investment Notice</h2>
              <p className="mt-4 text-sm leading-7 text-red-100 sm:text-base">
                Bitcoin mining rewards are not fixed or guaranteed. Earnings may vary depending on BTC market price, mining difficulty, pool performance,
                electricity costs, maintenance, and other operational factors.
              </p>
              <p className="mt-4 text-sm leading-7 text-red-100 sm:text-base">
                Any numbers shown inside the platform should be treated as estimated values unless they are marked as completed and available.
              </p>
            </article>

            <aside className="rounded-2xl border border-red-200/25 bg-[rgba(127,29,29,0.14)] p-4 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-red-200">Key Risk Drivers</p>
              <div className="mt-3 space-y-2 text-sm text-red-100">
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-200" />
                  <p>BTC market volatility and mining difficulty changes.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-200" />
                  <p>Operational costs including electricity and maintenance.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-200" />
                  <p>Pool performance and total active allocation.</p>
                </div>
              </div>
            </aside>
          </div>
        </section> */}

        <section className="mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(120%_90%_at_90%_0%,rgba(14,165,233,0.35),rgba(2,6,23,0.94))] p-7 sm:p-10">
          <Eyebrow>Final Step</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Start Your Mining <span className='text-gradient'>Investment Journey</span></h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
            Choose a plan, join the mining pool, and track your monthly mining performance from your personal dashboard.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#plans" className="inline-flex items-center gap-2 rounded-full bg-[#70a9dc] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
              Choose Investment Plan
            </a>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#70a9dc]/60 hover:bg-white/10">
              Login
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default InvestmentPlanPage
