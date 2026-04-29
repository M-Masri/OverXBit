import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { createStaggerContainer, getInViewMotion, revealVariants } from '../lib/motion'

const faqItems = [
  {
    q: 'What is Bitcoin?',
    a: 'Bitcoin is a decentralized digital currency that operates on blockchain technology. It is not controlled by any government or bank and aims to solve challenges such as slow transactions, lack of transparency, and higher fees',
  },
  {
    q: 'What services does Over X Bit offer?',
    a: 'Over X Bit offers professional Bitcoin mining and trading services. They ensure secure transactions using advanced tools, conduct in-depth market analysis for strategic trading, and provide expert guidance to maximize earning opportunities.',
  },
  {
    q: 'How does blockchain technology work?',
    a: 'All Bitcoin transactions are recorded on a public blockchain ledger. Each transaction is encrypted with cryptographic algorithms and linked together in blocks, making them tamper-resistant and verifiable.',
  },
  {
    q: 'What is the difference between Bitcoin mining and Bitcoin trading?',
    a: 'Bitcoin mining generates new Bitcoins by validating transactions, requiring powerful hardware and high energy consumption, and offers a fixed ROI through mining rewards. Bitcoin trading involves buying and selling on the market, requiring strong market analysis and risk management skills, with no fixed ROI as profits depend entirely on the chosen strategy.',
  },
  {
    q: 'How does Over X Bit ensure secure transactions?',
    a: 'Over X Bit ensures every trade or payment is encrypted and protected using advanced blockchain tools. They oversee the transaction process from broadcast to confirmation for reliability and speed.',
  },
  {
    q: 'What are the key features and benefits of Bitcoin?',
    a: 'Bitcoin offers decentralization, global accessibility, transparency, and low transaction costs. It is globally accepted, requires no conversion, and allows fast cross-border transfers.',
  },
  {
    q: 'What is the history and growth of Bitcoin?',
    a: 'Bitcoin was launched in 2009 as the first decentralized digital currency. It has grown from a few cents in value to a trillion-dollar asset class, with rising demand for digital assets and growing acceptance for payments by global businesses.',
  },
  {
    q: 'What are the current market trends for Bitcoin?',
    a: "As of 2025, over 560 million people (~6.8% of the global population) own cryptocurrency, with projections suggesting it could exceed 8% by 2025. Bitcoin's market cap surpassed $1.35 trillion, and daily trading volume averaged $96 billion.",
  },
  {
    q: 'Why should you partner with Over X Bit?',
    a: 'Over X Bit offers attractive ROI, capital security with a minimum 3 years investment, and dual revenue streams from mining and trading.',
  },
  {
    q: 'What are the real-world applications of Bitcoin?',
    a: 'Bitcoin can be used for borderless, fast, and cost-efficient transactions, as a store of value and a tradable digital asset, and for business integration such as payments, remittances, and global transfers.',
  },
  {
    q: 'What are the current investment challenges in Bitcoin?',
    a: 'Challenges include highly volatile prices, complex technical setup for mining operations, no guaranteed ROI from trading activities, and security risks if wallets and transactions are not managed properly.',
  },
  {
    q: 'How does Over X Bit help investors and traders?',
    a: 'Over X Bit provides professional Bitcoin mining operations with predictable ROI, secure trading support, full transparency backed by blockchain technology, and clear timelines with guaranteed capital return at maturity.',
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
          className="mx-auto mt-10 max-w-6xl columns-1 gap-5 lg:columns-2"
          variants={faqContainer}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
        >
          {faqItems.map((item) => (
            <motion.article
              key={item.q}
              className="faq-item surface-card mb-3 break-inside-avoid p-5"
              variants={revealVariants}>
              <button
                type="button"
                className="faq-summary w-full cursor-pointer list-none text-left text-md font-semibold text-white"
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
