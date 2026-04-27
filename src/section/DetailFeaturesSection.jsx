const detailFeatures = [
  {
    title: 'Top Management to Help You See the Bigger Picture',
    text: 'From risk control to signal review, every dashboard module is designed for fast decisions and clean execution. You get visibility over entries, exits, and growth metrics in one place.',
    points: [
      'Smart watchlists for BTC, ETH, SOL, XRP',
      'Custom layouts for member types and teams',
      'Automated weekly reports and performance snapshots',
    ],
  },
  {
    title: 'Fast-Reading Charts On the Go',
    text: 'Use compact chart modules and instant alerts to react quickly during volatility. Built for traders who need clarity on desktop and mobile without losing context.',
    points: [
      'One-screen technical overview with trend signals',
      'Entry and stop-loss annotations for each setup',
      'Session summaries for every strategy cycle',
    ],
  },
]

function DetailFeaturesSection() {
  return (
    <section id="features" className="pt-16">
      <div className="text-center">
        <h2 className="font-display text-4xl text-white">Powerful Features</h2>
        <p className="mx-auto mt-3 max-w-3xl text-slate-400">
          Explore the frontier of trading evolution with Overxbit. Every module is focused on speed, transparency, and clear decision support.
        </p>
      </div>
      <div className="mt-10 space-y-6">
        {detailFeatures.map((feature, index) => (
          <article key={feature.title} className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/65 p-6 lg:grid-cols-2 lg:p-8">
            <div className={index % 2 === 0 ? 'order-1' : 'order-1 lg:order-2'}>
              <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-slate-300">{feature.text}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-200">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-300" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className="mt-6 inline-block text-sm font-semibold text-orange-300 hover:text-orange-200">
                See Doc
              </a>
            </div>
            <div className={index % 2 === 0 ? 'order-2' : 'order-2 lg:order-1'}>
              <div className="feature-image-shell" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DetailFeaturesSection
