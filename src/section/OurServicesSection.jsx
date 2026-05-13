import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { createStaggerContainer, getInViewMotion, hoverSpring, revealVariants } from '../lib/motion'
import { servicesData } from '../lib/servicesData'

function OurServicesSection() {
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)
  const cardsContainer = createStaggerContainer(0.16, 0.1)

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
          {servicesData.map((service) => (
            <motion.article
              key={service.id}
              className={`service-card group relative overflow-hidden bg-gradient-to-br ${service.tint} p-5 min-h-[220px]`}
              variants={revealVariants}
              whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
              transition={hoverSpring}
            >
              <motion.img
                src={service.image}
                alt={service.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-slate-900/25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.14),transparent_45%)] opacity-60" />
              <Link to={`/services/${service.slug}`} className="absolute inset-0 z-20" aria-label={`Open ${service.title} details`} />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <p className="text-sm font-semibold tracking-wide text-[#2ABBAF]">{service.id}</p>
                <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default OurServicesSection
