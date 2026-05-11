import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiGlobe, FiLayers, FiMapPin } from 'react-icons/fi'
import Header from '../section/Header'
import SiteFooter from '../section/SiteFooter'
import { createStaggerContainer, getInViewMotion, hoverSpring, revealVariants } from '../lib/motion'
import { findServiceBySlug } from '../lib/servicesData'

const processDetails = [
  'We begin by understanding your objectives, audience profile, budget, and timeline so every decision starts from a clear strategy.',
  'Next, we build the concept, execution approach, and quality framework to make the service experience cohesive and impactful.',
  'Then we coordinate implementation, monitor performance, and optimize continuously to keep results aligned with your goals.',
]

const fallbackGallery = [
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=80',
]

function ServicePage() {
  const { slug } = useParams()
  const service = findServiceBySlug(slug)
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)
  const cardsContainer = createStaggerContainer(0.1, 0.04)

  if (!service) {
    return <Navigate to="/" replace />
  }

  const galleryImages = [service.image, ...fallbackGallery.filter((image) => image !== service.image)].slice(0, 5)

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
            <img src={service.image} alt={service.title} className="service-ref-hero-image" loading="lazy" />
            <div className="service-ref-hero-overlay" />
            <div className="service-ref-hero-content">
              <p className="service-ref-hero-kicker">Service {service.id}</p>
              <h1 className="font-display text-4xl font-semibold uppercase tracking-[0.04em] text-white sm:text-5xl">
                {service.title}
              </h1>
              <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-100 sm:text-lg">
                {service.tagline}
              </p>
            </div>
          </motion.article>
        </motion.section>

        <motion.section className="service-ref-overview mt-10" variants={revealVariants} {...inViewMotion}>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <article className="service-ref-text-block">
              <p className="service-eyebrow">Service Overview</p>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Built for measurable growth and clean execution</h2>
              <p className="mt-4 text-base leading-8 text-slate-300">{service.intro}</p>
            </article>

            <article className="service-ref-image-card">
              <img src={galleryImages[1]} alt={`${service.title} overview`} className="service-ref-image" loading="lazy" />
              <div className="service-ref-image-overlay" />
            </article>
          </div>
        </motion.section>

        <motion.section id="service-process" className="mt-12" variants={revealVariants} {...inViewMotion}>
          <div className="service-process-shell">
            <article className="service-process-intro mx-auto text-center">
              <p className="service-eyebrow">Service Creation Steps</p>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Our process is structured and outcome-focused</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
                From first consultation to final delivery, we manage every detail to ensure your service execution runs smoothly and exceeds expectations.
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
                <defs>
                  <marker
                    id="serviceTrendArrow"
                    viewBox="0 0 18 16"
                    refX="12"
                    refY="8"
                    markerWidth="10"
                    markerHeight="10"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path
                      d="M1 2.2 L14.5 8 L1 13.8 L4.2 8 Z"
                      fill="rgba(109, 164, 214, 0.98)"
                      strokeLinejoin="round"
                    />
                  </marker>
                </defs>

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
                  markerEnd="url(#serviceTrendArrow)"
                />
              </svg>

              <motion.article className="service-wave-card step-1" variants={revealVariants}>
                <span className="service-wave-point">01</span>
                <span className="service-wave-step-icon" aria-hidden="true">
                  <FiGlobe />
                </span>
                <h3 className="service-wave-step-title">{service.process?.[0] ?? 'Step 1'}</h3>
                <p className="service-wave-step-text">{processDetails[0]}</p>
              </motion.article>

              <motion.article className="service-wave-card step-2" variants={revealVariants}>
                <span className="service-wave-point">02</span>
                <span className="service-wave-step-icon" aria-hidden="true">
                  <FiLayers />
                </span>
                <h3 className="service-wave-step-title">{service.process?.[1] ?? 'Step 2'}</h3>
                <p className="service-wave-step-text">{processDetails[1]}</p>
              </motion.article>

              <motion.article className="service-wave-card step-3" variants={revealVariants}>
                <span className="service-wave-point">03</span>
                <span className="service-wave-step-icon" aria-hidden="true">
                  <FiMapPin />
                </span>
                <h3 className="service-wave-step-title">{service.process?.[2] ?? 'Step 3'}</h3>
                <p className="service-wave-step-text">{processDetails[2]}</p>
              </motion.article>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="mt-12" variants={revealVariants} {...inViewMotion}>
          <div className="service-ref-faq-wrap">
            <h2 className="font-display text-3xl text-white sm:text-4xl">FAQs</h2>

            <div className="mt-6 space-y-3">
              {service.faqs.map((item, index) => (
                <details key={item.q} open={index === 0} className="service-ref-faq-item">
                  <summary className="service-ref-faq-summary cursor-pointer list-none text-sm font-medium text-slate-100">
                    <span>{item.q}</span>
                    <span className="service-ref-faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <p className="service-ref-faq-answer">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default ServicePage
