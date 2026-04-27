const journeySteps = [
  {
    step: '01',
    title: 'Choose Your Plan',
    text: 'Select the plan that fits your experience level and trading style.',
  },
  {
    step: '02',
    title: 'Get Onboarded',
    text: 'Get quick access to signal channels and your dashboard with clear guidance.',
  },
  {
    step: '03',
    title: 'Execute With Discipline',
    text: 'Execute trades based on the plan and recommended risk controls.',
  },
  {
    step: '04',
    title: 'Review and Scale',
    text: 'Review your performance and refine the plan to scale sustainably.',
  },
]

function TradingJourneySection() {
  return (
    <section id="journey" className="pt-16">
      <div className="journey-shell p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-300">How It Works</p>
            <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
              Your Trading Journey in <span className="text-gradient">4 Steps</span>
            </h2>
          </div>
          <button className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(249,115,22,0.35)]">
            Start Your Journey
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {journeySteps.map((item) => (
            <article
              key={item.step}
              className="surface-card p-5"
            >
              <p className="text-3xl font-bold text-orange-300">{item.step}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TradingJourneySection
