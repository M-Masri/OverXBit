const reasons = [
  {
    title: 'Real-Time Signal Desk',
    text: 'Live signals with clear entries, exits, and risk guidance for every setup.',
    icon: 'signal',
  },
  {
    title: 'Risk-First Framework',
    text: 'Capital management models designed for long-term consistency before fast gains.',
    icon: 'shield',
  },
  {
    title: 'Weekly Performance Reviews',
    text: 'Weekly result reviews and continuous strategy optimization using real data.',
    icon: 'chart',
  },
  {
    title: 'Guidance For Every Level',
    text: 'Structured support for beginners and active traders with clear next steps.',
    icon: 'users',
  },
]

function WhyIcon({ type }) {
  if (type === 'signal') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.2 14.4h1.9l2.3-4.8 2.7 6.2 2.2-5 1.1 2.1H17" />
      </svg>
    )
  }

  if (type === 'shield') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2.5 4.8 4.7v4.4c0 3.4 2.2 6.4 5.2 7.4 3-1 5.2-4 5.2-7.4V4.7L10 2.5Z" />
        <path d="m7.9 9.7 1.5 1.5 2.8-2.8" />
      </svg>
    )
  }

  if (type === 'chart') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 16.2h14" />
        <path d="M5.4 13V9.8" />
        <path d="M9.8 13V6.6" />
        <path d="M14.2 13v-4.5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.8 16v-1.1a2.7 2.7 0 0 0-2.7-2.7H7a2.7 2.7 0 0 0-2.7 2.7V16" />
      <circle cx="9" cy="7" r="2.2" />
      <path d="M17 16v-1.1a2.3 2.3 0 0 0-1.8-2.3" />
      <path d="M13.9 4.9a2.1 2.1 0 0 1 0 4.2" />
    </svg>
  )
}

function WhyChooseSection() {
  return (
    <section id="why" className="pt-16">
      <div className="reason-shell why-shell p-6 sm:p-8 lg:p-10">
        <div className="why-layout grid gap-10 xl:grid-cols-[0.95fr_1.35fr] xl:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Why Overxbit</p>
            <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
              Why Traders
              <span className="text-gradient"> Choose Us?</span>
            </h2>
            <p className="mt-5 max-w-md leading-8 text-slate-300">
              We combine signal precision, disciplined risk models, and continuous
              mentoring so your decisions are consistent in any market cycle.
            </p>
            <button
              type="button"
              className="mt-6 rounded-md bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_rgba(249,115,22,0.28)]"
            >
              Start Now
            </button>
          </div>

          <div className="why-features-grid grid gap-0 md:grid-cols-2">
            {reasons.map((item) => (
              <article key={item.title} className="why-feature px-0 py-5 md:px-6">
                <div className="why-icon" aria-hidden="true">
                  <WhyIcon type={item.icon} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-300">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
