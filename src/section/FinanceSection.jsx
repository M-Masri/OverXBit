const quickFeatures = [
  { title: 'Balance', text: 'Track portfolio balance live across your active strategies.' },
  { title: 'Users', text: 'Manage member roles, alerts, and private subscription channels.' },
  { title: 'Create', text: 'Build automated signal templates for crypto and forex setups.' },
  { title: 'AI Sessions', text: 'Get assistant-guided reviews before entering market positions.' },
]

function FinanceSection() {
  return (
    <section className="pt-16">
      <h2 className="text-center font-display text-4xl text-white">Finance for the Modern Business</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
        Tailored financial tools designed to simplify management, reduce risk, and support growth for today&apos;s fast-paced markets.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {quickFeatures.map((item, index) => (
          <article key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/65 p-6">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.text}</p>
            <div className={`feature-thumb mt-5 ${index % 2 === 0 ? 'feature-thumb-warm' : 'feature-thumb-dark'}`} />
          </article>
        ))}
      </div>
    </section>
  )
}

export default FinanceSection
