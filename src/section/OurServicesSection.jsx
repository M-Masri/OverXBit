import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { createStaggerContainer, getInViewMotion, hoverSpring, revealVariants } from '../lib/motion'
import { API_BASE_URL, useGetPublicServicesQuery } from '../services/overxApi'

function resolveCardImageUrl(cardImage) {
  if (!cardImage) {
    return '/assets/hero-static.webp'
  }

  if (/^https?:\/\//i.test(cardImage)) {
    return cardImage
  }

  const apiOrigin = new URL(API_BASE_URL).origin
  const imagePath = String(cardImage).startsWith('/') ? cardImage : `/${cardImage}`
  return `${apiOrigin}${imagePath}`
}

function OurServicesSection() {
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)
  const cardsContainer = createStaggerContainer(0.16, 0.1)
  const { data, isLoading, isFetching } = useGetPublicServicesQuery()
  const services = Array.isArray(data?.services) ? data.services : []

  return (
    <motion.section id="services" className="pt-16" variants={revealVariants} {...inViewMotion}>
      <div className="our-services-shell p-6 sm:p-8 lg:p-10">
        <motion.h2 variants={revealVariants} className="text-center font-display text-4xl text-white sm:text-5xl">
          Our <span className="text-gradient">Services</span>
        </motion.h2>
        <motion.p variants={revealVariants} className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Specialized advisory tracks built for growth, execution, and smarter decisions.
        </motion.p>

        <motion.div
          className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          variants={cardsContainer}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
        >
          {(isLoading || isFetching) && !services.length ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-300">
              Loading services...
            </div>
          ) : null}

          {!isLoading && !isFetching && !services.length ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-300">
              No services available right now.
            </div>
          ) : null}

          {services.map((service, index) => (
            <motion.article
              key={`${service.number || index}-${service.title || 'service'}`}
              className="service-card group relative overflow-hidden bg-gradient-to-br from-[#3B82F6]/35 via-[#0f172a]/90 to-[#020617] p-5 min-h-[220px]"
              variants={revealVariants}
              whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
              transition={hoverSpring}
            >
              <motion.img
                src={resolveCardImageUrl(service.card_image)}
                alt={service.title || 'Service card'}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-slate-900/25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.14),transparent_45%)] opacity-60" />
              <Link
                to={`/services/${service.id || service.number || index + 1}`}
                className="absolute inset-0 z-20"
                aria-label={`Open ${service.title || 'service'} details`}
              />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <p className="text-sm font-semibold tracking-wide text-[#2ABBAF]">{service.number || index + 1}</p>
                <h3 className="text-2xl font-semibold text-white">{service.title || 'Untitled Service'}</h3>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default OurServicesSection
