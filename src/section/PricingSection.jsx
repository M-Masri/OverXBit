const pricingPlans = [
  {
    price: '$49 USD',
    name: 'Basic Plan',
    desc: 'Start your crypto journey with core tools and reliable daily updates.',
    points: [
      'Access to basic platform features',
      'Market briefings and analytics',
      'Up to 10 team users',
      '20GB storage per user',
      'Chat and email support',
    ],
  },
  {
    price: '$79 USD',
    name: 'Business Plan',
    desc: 'Best for active trading communities that need speed and deeper insights.',
    points: [
      'Everything in Basic',
      'Priority signal board access',
      'Advanced risk tracking',
      'Live strategy sessions',
      'Dedicated support window',
    ],
    featured: true,
  },
  {
    price: '$90 USD',
    name: 'Enterprise Plan',
    desc: 'Built for firms and large teams requiring custom workflows and controls.',
    points: [
      'Everything in Business',
      'Role-based team permissions',
      'Custom security and compliance',
      'API integrations',
      'Account manager access',
    ],
  },
]

function PricingSection() {
  return (
    <section id="pricing" className="pt-16">
      <div className="text-center">
        <h2 className="font-display text-4xl text-white">Pricing Plans for Success</h2>
        <p className="mx-auto mt-3 max-w-3xl text-slate-400">
          Discover the perfect plan for your trading journey with options designed for flexibility and growth.
        </p>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-3xl border p-6 ${
              plan.featured
                ? 'border-orange-300/40 bg-gradient-to-b from-orange-500/16 to-slate-950'
                : 'border-white/10 bg-slate-900/65'
            }`}
          >
            <p className="text-3xl font-bold text-white">{plan.price}</p>
            <p className="mt-1 text-lg font-semibold text-white">{plan.name}</p>
            <p className="mt-3 text-sm text-slate-300">{plan.desc}</p>
            <button className={`mt-5 w-full rounded-full px-4 py-2.5 text-sm font-semibold ${plan.featured ? 'bg-orange-400 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              Get started
            </button>
            <ul className="mt-6 space-y-2 text-sm text-slate-200">
              {plan.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PricingSection
