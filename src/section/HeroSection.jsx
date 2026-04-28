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
        className="home-app-wrapper"
        initial={reduceMotion ? false : { y: 18, opacity: 0.86 }}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : {
                y: [18, 10, 18],
                opacity: [0.9, 1, 0.9],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 8,
                ease: 'easeInOut',
                repeat: Infinity,
              }
        }
      >
        <motion.div
          className="circle-wrapper"
          initial={reduceMotion ? false : { scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 1,
                  delay: 0.24,
                  ease: motionEase,
                }
          }
        >
          <div className="circle-container">
            <img
              src="https://cdn.prod.website-files.com/673c8623b53e085c22dcde7d/673c8790c213543ea74788a0_Red%20Circle%20No%20Glow.png"
              alt=""
              className="circle-bg-image"
            />
            <img
              src="https://cdn.prod.website-files.com/673c8623b53e085c22dcde7d/673c87ad03ca3526725241f9_Red%20Glow.png"
              alt=""
              className="red-glow"
            />
            <img
              src="https://cdn.prod.website-files.com/673c8623b53e085c22dcde7d/673c878ff9abee9c378d3e76_Glow.png"
              alt=""
              className="white-glow"
            />
            <div className="red-circle-center">
              <div className="red-circle" />
            </div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="relative z-20 text-center pt-20"
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
    </section>
  )
}

export default HeroSection
