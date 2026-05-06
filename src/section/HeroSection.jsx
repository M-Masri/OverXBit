import { Suspense, lazy } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { createStaggerContainer, getLoadMotion, hoverSpring, motionEase, revealVariants } from '../lib/motion'

const HeroEarth3D = lazy(() => import('./HeroEarth3D'))

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
        className="hero-earth-layer"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : {
                opacity: [0.85, 1, 0.9],
                scale: [1.03, 1, 1.03],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 12,
                ease: 'easeInOut',
                repeat: Infinity,
              }
        }
      >
        <Suspense fallback={<div className="hero-earth-canvas" />}>
          <HeroEarth3D />
        </Suspense>
        <div className="hero-earth-stars" />
        <div className="hero-earth-glow" />
        <div className="hero-earth-core" />
      </motion.div>
      <motion.div
        className="relative z-20 text-center pt-20 pointer-events-none"
        variants={heroTextContainer}
        {...loadMotion}
      >
        <motion.h1
          variants={heroTitleVariants}
          className="mx-auto mt-3 max-w-4xl font-display text-4xl leading-[1.1] text-white sm:text-6xl"
        >
          Welcome To OVERXBIT
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
         Smart strategies. Trusted results,
          <br className="hidden sm:block" />
          Wealth that works. This is smart growth redefined.
        </motion.p>
        <motion.div variants={revealVariants} className="mt-9 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
          <motion.button
            className="rounded-full bg-gradient-to-r from-[#2ABBAF] to-[#2ABBAF] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(42,187,175,0.5)] transition hover:brightness-110"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={hoverSpring}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
