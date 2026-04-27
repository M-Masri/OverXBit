const faq = [
  'What is this platform used for?',
  'Is my financial data secure?',
  'Can I connect multiple accounts?',
  'Does it support small trading teams?',
  'How quickly can I get started?',
]

function CtaFaqSection() {
  return (
    <section className="pt-16">
      <div className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/65 p-6 lg:grid-cols-[1fr_1.1fr] lg:p-8">
        <div>
          <h2 className="font-display text-4xl text-white">Transform Your Work with Overxbit</h2>
          <p className="mt-3 max-w-md text-slate-300">
            Gain access to exclusive resources, networking opportunities, and guided strategies for sustainable growth.
          </p>
          <form className="mt-6 flex gap-2">
            <input
              type="email"
              placeholder="Enter email here"
              className="w-full rounded-full border border-white/15 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <button className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3 text-sm font-semibold text-white">
              Get Started
            </button>
          </form>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <h3 className="text-2xl font-semibold text-white">FAQ</h3>
          <div className="mt-4 space-y-2">
            {faq.map((q) => (
              <details key={q} className="rounded-xl border border-white/10 bg-slate-900/75 p-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-slate-200">{q}</summary>
                <p className="mt-3 text-sm text-slate-400">
                  We provide fast onboarding, secure account setup, and support for your subscription workflow.
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaFaqSection
