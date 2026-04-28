import { motion, useReducedMotion } from 'framer-motion'
import { createStaggerContainer, getInViewMotion, motionEase, revealVariants } from '../lib/motion'

function ChairmanSection() {
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)

  const mediaVariants = {
    hidden: {
      opacity: 0,
      x: -40,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.78,
        ease: motionEase,
      },
    },
  }

  const textVariants = {
    hidden: {
      opacity: 0,
      x: 40,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.78,
        ease: motionEase,
      },
    },
  }

  const textContainer = createStaggerContainer(0.1, 0.1)

  return (
    <motion.section id="chairman" className="pt-16" variants={revealVariants} {...inViewMotion}>
      <div className="chairman-shell p-6 sm:p-8 lg:p-10">
        <motion.h2 variants={revealVariants} className="text-center font-display text-4xl text-white sm:text-5xl">
          A Message From The <span className="text-gradient">Chairman</span>
        </motion.h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <motion.div className="chairman-media relative overflow-hidden rounded-2xl p-2" variants={mediaVariants}>
            <img
              src="https://overxbit.com/static/images/ceo/miro-img-msg.jpg"
              alt="Miro M. Fallahi"
              className="h-[440px] w-full rounded-2xl object-cover"
            />
            <div className="chairman-ring" />
          </motion.div>

          <motion.article variants={textContainer} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}>
            <motion.h3 variants={textVariants} className="text-4xl font-semibold text-white">Miro M. Fallahi</motion.h3>
            <motion.p variants={textVariants} className="mt-2 text-xl text-orange-300">Founder - Chairman</motion.p>

            <motion.div variants={textVariants} className="mt-6 space-y-5 text-lg leading-9 text-slate-300">
              <p>
                In a world that&apos;s evolving faster than ever, technology is rewriting the
                rules of finance. At the heart of this transformation lies cryptocurrency,
                a powerful force reshaping how we store, trade, and grow value. What once
                seemed like a distant innovation is now becoming the foundation of the
                future economy.
              </p>
              <p>
                Crypto isn&apos;t just about trading or mining. It&apos;s about freedom,
                transparency, and the empowerment of individuals across the globe. We&apos;re
                building more than a company, we&apos;re building a movement that connects
                people to the future of money.
              </p>
              <p>
                Whether you&apos;re a seasoned investor or just beginning your journey,
                there&apos;s never been a better time to be part of this revolution.
              </p>
              <p>Join our family now, and let&apos;s shape the future together.</p>
            </motion.div>

            <motion.button
              variants={textVariants}
              transition={{ duration: 0.7, ease: motionEase, delay: 0.16 }}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="mt-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(249,115,22,0.45)] transition hover:brightness-110"
              style={{ transformOrigin: 'center' }}
            >
              Become A Member
            </motion.button>
          </motion.article>
        </div>
      </div>
    </motion.section>
  )
}

export default ChairmanSection
