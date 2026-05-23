import { Navigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiGlobe, FiLayers, FiMapPin } from 'react-icons/fi'
import Header from '../section/Header'
import SiteFooter from '../section/SiteFooter'
import { createStaggerContainer, getInViewMotion, hoverSpring, revealVariants } from '../lib/motion'
import { API_BASE_URL, useGetPublicServiceByIdQuery } from '../services/overxApi'

const stepIcons = [FiGlobe, FiLayers, FiMapPin]

function ServicePage() {
  const { slug } = useParams()
  const numericSlug = Number(slug)
  const serviceId = Number.isFinite(numericSlug) && numericSlug > 0 ? numericSlug : null

  const serviceQuery = useGetPublicServiceByIdQuery(serviceId, { skip: !serviceId })
  const service = serviceQuery.data?.service || null

  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)
  const cardsContainer = createStaggerContainer(0.1, 0.04)

  if (!serviceId) {
    return <Navigate to="/" replace />
  }

  function resolveImageUrl(image) {
    if (!image) {
      return ''
    }

    if (/^https?:\/\//i.test(image)) {
      return image
    }

    const apiOrigin = new URL(API_BASE_URL).origin
    const imagePath = String(image).startsWith('/') ? image : `/${image}`
    return `${apiOrigin}${imagePath}`
  }

  const heroImage = resolveImageUrl(service?.overview_image)
  const steps = Array.isArray(service?.steps) ? service.steps : []
  const faqs = Array.isArray(service?.faqs) ? service.faqs : []
  const isServiceLoading = serviceQuery.isLoading || serviceQuery.isFetching
  const errorMessage = serviceQuery.error?.data?.message || serviceQuery.error?.message || 'Unable to load service details right now.'

  if (isServiceLoading && !service) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-grid text-slate-100 overflow-y-hidden">
        <Header />

        <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-5 pb-16 pt-28 sm:px-8 sm:pt-32 ">
          <div className="portal-loader" />
        </main>

        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-grid text-slate-100 overflow-y-hidden">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32 ">
        <motion.section className="service-ref-hero" variants={revealVariants} {...inViewMotion}>
          <motion.article
            className="service-ref-hero-media"
            whileHover={reduceMotion ? undefined : { y: -3 }}
            transition={hoverSpring}
          >
            {heroImage ? <img src={heroImage} alt={service?.title || 'Service'} className="service-ref-hero-image" loading="lazy" /> : null}
            <div className="service-ref-hero-overlay" />
            <div className="service-ref-hero-content">
              {service?.number ? <p className="service-ref-hero-kicker">Service {service.number}</p> : null}
              <h1 className="font-display text-4xl font-semibold uppercase tracking-[0.04em] text-white sm:text-5xl">
                {service?.title || ''}
              </h1>
              <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-100 sm:text-lg">
                {service?.tagline || ''}
              </p>
            </div>
          </motion.article>
        </motion.section>

        {serviceQuery.error ? (
          <section className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {errorMessage}
          </section>
        ) : null}

        <motion.section className="service-ref-overview mt-10" variants={revealVariants} {...inViewMotion}>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <article className="service-ref-text-block">
              <p className="service-eyebrow">Service Overview</p>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">{service?.overview_title || ''}</h2>
              <p className="mt-4 text-base leading-8 text-slate-300">{service?.overview_description || ''}</p>
            </article>

            <article className="service-ref-image-card">
              {heroImage ? <img src={heroImage} alt={`${service?.title || 'Service'} overview`} className="service-ref-image" loading="lazy" /> : null}
              <div className="service-ref-image-overlay" />
            </article>
          </div>
        </motion.section>

        <motion.section id="service-process" className="mt-12" variants={revealVariants} {...inViewMotion}>
          <div className="service-process-shell">
            <article className="service-process-intro mx-auto text-center">
              <p className="service-eyebrow">Service Creation Steps</p>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">{service?.process_title || ''}</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
                {service?.process_description || ''}
              </p>
            </article>

            <motion.div
              className="service-wave-roadmap"
              variants={cardsContainer}
              initial={reduceMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
            >
              <svg className="service-wave-line" viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M20 238 L66 224 L95 205 L121 219 L145 192 L164 208 L183 176 L200 198 L219 170 L238 206 L258 182 L290 158 L321 208 L355 182 L389 151 L416 166 L444 135 L476 110 L500 128 L520 102 L537 125 L557 95 L587 151 L624 113 L662 84 L700 54 L736 79 L768 47 L807 61 L842 39 L874 27 L918 19 L952 12"
                  fill="none"
                  stroke="rgba(109, 164, 214, 0.28)"
                  strokeWidth="8.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 238 L66 224 L95 205 L121 219 L145 192 L164 208 L183 176 L200 198 L219 170 L238 206 L258 182 L290 158 L321 208 L355 182 L389 151 L416 166 L444 135 L476 110 L500 128 L520 102 L537 125 L557 95 L587 151 L624 113 L662 84 L700 54 L736 79 L768 47 L807 61 L842 39 L874 27 L918 19 L952 12"
                  fill="none"
                  stroke="rgba(109, 164, 214, 0.95)"
                  strokeWidth="6.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {steps.map((step, index) => {
                const Icon = stepIcons[index] || FiMapPin
                return (
                  <motion.article key={`${step.title}-${index}`} className={`service-wave-card step-${index + 1}`} variants={revealVariants}>
                    <span className="service-wave-step-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3 className="service-wave-step-title">{step.title}</h3>
                    <p className="service-wave-step-text">{step.description}</p>
                  </motion.article>
                )
              })}
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="mt-12" variants={revealVariants} {...inViewMotion}>
          <div className="service-ref-faq-wrap">
            <h2 className="font-display text-3xl text-white sm:text-4xl">FAQs</h2>

            <div className="mt-6 space-y-3">
              {faqs.length ? faqs.map((item, index) => (
                <details key={`${item.question}-${index}`} open={index === 0} className="service-ref-faq-item">
                  <summary className="service-ref-faq-summary cursor-pointer list-none text-sm font-medium text-slate-100">
                    <span>{item.question}</span>
                    <span className="service-ref-faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <p className="service-ref-faq-answer">{item.answer}</p>
                </details>
              )) : (
                <p className="text-sm text-slate-300">No FAQs available for this service yet.</p>
              )}
            </div>
          </div>
        </motion.section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default ServicePage
