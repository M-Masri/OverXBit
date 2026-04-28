import { motion, useReducedMotion } from 'framer-motion'
import { createStaggerContainer, getInViewMotion, hoverSpring, revealVariants } from '../lib/motion'

const journeySteps = [
  {
    step: '01',
    title: 'Choose Your Plan',
    text: 'Select the plan that fits your experience level and trading style.',
  },
  {
    step: '02',
    title: 'Get Onboarded',
    text: 'Get quick access to signal channels and your dashboard with clear guidance.',
  },
  {
    step: '03',
    title: 'Execute With Discipline',
    text: 'Execute trades based on the plan and recommended risk controls.',
  },
  {
    step: '04',
    title: 'Review and Scale',
    text: 'Review your performance and refine the plan to scale sustainably.',
  },
]

function TradingJourneySection() {
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)
  const headingContainer = createStaggerContainer(0.1, 0.02)
  const cardsContainer = createStaggerContainer(0.16, 0.1)

  return (
    <motion.section id="journey" className="pt-16" variants={revealVariants} {...inViewMotion}>
      <div className="journey-shell p-6 sm:p-8 lg:p-10">
        <motion.div
          className="flex flex-wrap items-end justify-between gap-4"
          variants={headingContainer}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
        >
          <motion.div variants={revealVariants}>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-300">How It Works</p>
            <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
              Your Trading Journey in <span className="text-gradient">4 Steps</span>
            </h2>
          </motion.div>
          <motion.button
            variants={revealVariants}
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(249,115,22,0.35)]"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={hoverSpring}
          >
            Start Your Journey
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          variants={cardsContainer}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
        >
          {journeySteps.map((item) => (
            <motion.article
              key={item.step}
              className="surface-card p-5"
              variants={revealVariants}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -6,
                      scale: 1.02,
                      borderColor: 'rgba(251, 146, 60, 0.5)',
                      boxShadow: '0 20px 38px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(249, 115, 22, 0.2)',
                      backgroundColor: 'rgba(22, 24, 33, 0.7)',
                    }
              }
              transition={hoverSpring}
            >
              <p className="text-3xl font-bold text-orange-300">{item.step}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default TradingJourneySection
