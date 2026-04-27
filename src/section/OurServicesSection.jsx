const services = [
  {
    id: '01',
    title: 'Sales Consultancy',
    tint: 'from-orange-500/45 via-orange-300/15 to-slate-900/75',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: '02',
    title: 'Management Consultancy',
    tint: 'from-sky-500/35 via-blue-400/10 to-slate-900/75',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: '03',
    title: 'Project Consultancy',
    tint: 'from-cyan-500/35 via-sky-400/10 to-slate-900/75',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: '04',
    title: 'Financial Consultancy',
    tint: 'from-indigo-500/35 via-blue-400/10 to-slate-900/75',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: '05',
    title: 'Investment Solutions',
    tint: 'from-orange-500/35 via-amber-400/10 to-slate-900/75',
    image:
      'https://images.unsplash.com/photo-1642543348745-7f316f8f4f3c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: '06',
    title: 'Digital Currency',
    tint: 'from-cyan-500/35 via-blue-400/10 to-slate-900/75',
    image:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1400&q=80',
  },
]

function OurServicesSection() {
  return (
    <section id="services" className="pt-16">
      <div className="our-services-shell p-6 sm:p-8 lg:p-10">
        <h2 className="text-center font-display text-4xl text-white sm:text-5xl">
          Our <span className="text-gradient">Services</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Specialized advisory tracks built for growth, execution, and smarter decisions.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className={`service-card group relative overflow-hidden bg-gradient-to-br ${service.tint} p-5 min-h-[220px]`}
            >
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-slate-900/25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.14),transparent_45%)] opacity-60" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <p className="text-sm font-semibold tracking-wide text-orange-300">{service.id}</p>
                <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurServicesSection
