import { motion, useReducedMotion } from 'framer-motion'
import { createStaggerContainer, getLoadMotion, hoverSpring, motionEase, revealVariants } from '../lib/motion'

function HeroSection() {
  const reduceMotion = useReducedMotion()
  const loadMotion = getLoadMotion(reduceMotion)

  const heroTitleVariants = {
    hidden: {
      opacity: 0,
      y: 35,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: motionEase,
      },
    },
  }

  const heroTextContainer = createStaggerContainer(0.12, 0.22)

  return (
    <section id="home" className="hero-shell h-[500px] relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden px-6 pb-20 pt-12 sm:px-10 sm:pt-16">
      <div className="hero-noise" />
      <motion.div
        className="hero-orb"
        initial={reduceMotion ? false : { y: 0, scale: 1, opacity: 0.72 }}
        animate={
          reduceMotion
            ? { opacity: 0.72 }
            : {
                y: [-4, 8, -4],
                scale: [1, 1.02, 1],
                opacity: [0.68, 0.82, 0.68],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 9,
                ease: 'easeInOut',
                repeat: Infinity,
              }
        }
      />
      <motion.div
        className="relative z-10 text-center"
        variants={heroTextContainer}
        {...loadMotion}
      >
        <motion.h1
          variants={heroTitleVariants}
          className="mx-auto mt-3 max-w-4xl font-display text-4xl leading-[1.1] text-white sm:text-6xl"
        >
          Precision Trading Signals
          <br />
          <motion.span
            className="text-gradient"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.7,
                    delay: 0.34,
                    ease: motionEase,
                  }
            }
          >
            Built For Consistent Growth.
          </motion.span>
        </motion.h1>
        <motion.p variants={revealVariants} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white">
          Join Overxbit to access real-time market signals, clear risk management,
          <br className="hidden sm:block" />
          and expert guidance designed for disciplined performance.
        </motion.p>
        <motion.div variants={revealVariants} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            className="rounded-full border border-white/15 bg-white/[0.06] px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={hoverSpring}
          >
            Explore Plans
          </motion.button>
          <motion.button
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(249,115,22,0.5)] transition hover:brightness-110"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={hoverSpring}
          >
            Join Now
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="hero-arc" />
    </section>
  )
}

export default HeroSection
