const faqItems = [
  {
    q: 'Is this subscription suitable for beginners?',
    a: 'Yes. We provide a clear beginner path with foundational guidance and execution support.',
  },
  {
    q: 'How many signals will I receive per week?',
    a: 'It depends on market conditions, but we typically publish structured daily opportunities on active assets.',
  },
  {
    q: 'Does the service include risk management?',
    a: 'Absolutely. Every setup includes stop-loss levels, targets, and suggested risk exposure.',
  },
  {
    q: 'How can I communicate with the team?',
    a: 'Through support channels, the private member community, and weekly follow-up sessions.',
  },
]

function FaqSection() {
  return (
    <section id="faq" className="pt-16">
      <div className="faq-shell p-6 sm:p-8 lg:p-10">
        <h2 className="text-center font-display text-4xl text-white sm:text-5xl">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-3">
          {faqItems.map((item) => (
            <details key={item.q} className="faq-item surface-card p-5">
              <summary className="faq-summary cursor-pointer list-none text-lg font-semibold text-white">
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 leading-8 text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
