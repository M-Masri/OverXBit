import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { createStaggerContainer, getInViewMotion, revealVariants } from '../lib/motion'

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
  const [openItems, setOpenItems] = useState({})
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)
  const faqContainer = createStaggerContainer(0.16, 0.1)

  const toggleItem = (question) => {
    setOpenItems((prev) => ({
      ...prev,
      [question]: !prev[question],
    }))
  }

  return (
    <motion.section id="faq" className="pt-16" variants={revealVariants} {...inViewMotion}>
      <div className="faq-shell p-6 sm:p-8 lg:p-10">
        <motion.h2 variants={revealVariants} className="text-center font-display text-4xl text-white sm:text-5xl">
          Frequently Asked <span className="text-gradient">Questions</span>
        </motion.h2>
        <motion.div
          className="mx-auto mt-10 grid max-w-4xl gap-3"
          variants={faqContainer}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
        >
          {faqItems.map((item) => (
            <motion.article key={item.q} className="faq-item surface-card p-5" variants={revealVariants}>
              <button
                type="button"
                className="faq-summary w-full cursor-pointer list-none text-left text-lg font-semibold text-white"
                aria-expanded={Boolean(openItems[item.q])}
                onClick={() => toggleItem(item.q)}
              >
                <span>{item.q}</span>
                <motion.span
                  className="faq-icon"
                  aria-hidden="true"
                  animate={openItems[item.q] ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openItems[item.q] ? (
                  <motion.div
                    key={`${item.q}-content`}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="mt-3 leading-8 text-slate-300">{item.a}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default FaqSection
