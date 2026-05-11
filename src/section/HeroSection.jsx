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
    <section id="home" className="hero-shell relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
        <img
          src="/assets/hero-static.webp"
          alt=""
          className="block w-full h-auto object-bottom"
          loading="eager"
        />
      </div>

      <div className="absolute inset-x-0 bottom-[14%] z-[14] h-[60%] pointer-events-none overflow-hidden">
        <svg className="h-full w-full" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <path
              id="hero-earth-rim-path"
              d="M 1066 382 C 1058 374, 1036 334, 994 286 C 936 226, 860 172, 754 108 C 700 82, 652 66, 608 58 C 570 53, 534 51, 500 50 C 466 50, 430 53, 392 58 C 348 64, 300 79, 246 101 C 140 168, 64 220, 6 280 C -36 330, -58 370, -66 378"
            />
            <linearGradient id="hero-rim-trail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255, 226, 170, 0)" />
              <stop offset="24%" stopColor="rgba(255, 226, 170, 0.38)" />
              <stop offset="50%" stopColor="rgba(255, 240, 204, 0.94)" />
              <stop offset="76%" stopColor="rgba(255, 226, 170, 0.38)" />
              <stop offset="100%" stopColor="rgba(255, 249, 236, 0)" />
            </linearGradient>
            <linearGradient id="hero-rim-streak" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255, 245, 220, 0)" />
              <stop offset="30%" stopColor="rgba(255, 245, 220, 0.54)" />
              <stop offset="50%" stopColor="rgba(255, 250, 242, 1)" />
              <stop offset="70%" stopColor="rgba(255, 232, 184, 0.92)" />
              <stop offset="100%" stopColor="rgba(255, 250, 242, 0)" />
            </linearGradient>
            <linearGradient id="hero-rim-ray" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,250,242,0)" />
              <stop offset="26%" stopColor="rgba(255,245,220,0.4)" />
              <stop offset="50%" stopColor="rgba(255,250,242,1)" />
              <stop offset="74%" stopColor="rgba(255,232,184,0.88)" />
              <stop offset="100%" stopColor="rgba(255,250,242,0)" />
            </linearGradient>
            <filter id="hero-rim-blur" x="-260%" y="-300%" width="620%" height="700%">
              <feGaussianBlur stdDeviation="4.8" />
            </filter>
          </defs>

          <g opacity={reduceMotion ? 0.45 : 1}>
            <g>
              <rect
                x="-90"
                y="-2.6"
                width="180"
                height="5.2"
                rx="999"
                fill="url(#hero-rim-trail)"
                filter="url(#hero-rim-blur)"
              />
              <rect
                x="-78"
                y="-2.1"
                width="156"
                height="4.2"
                rx="999"
                fill="url(#hero-rim-streak)"
                transform="rotate(-16)"
                filter="url(#hero-rim-blur)"
              />
              <rect
                x="-72"
                y="-1.3"
                width="144"
                height="2.6"
                rx="999"
                fill="url(#hero-rim-ray)"
                transform="rotate(14)"
                filter="url(#hero-rim-blur)"
              />
              <rect
                x="-72"
                y="-1"
                width="144"
                height="2"
                rx="999"
                fill="url(#hero-rim-ray)"
                transform="rotate(-30)"
                filter="url(#hero-rim-blur)"
              />
              <rect
                x="-62"
                y="-1.1"
                width="124"
                height="2.2"
                rx="999"
                fill="url(#hero-rim-ray)"
                transform="rotate(-14)"
                filter="url(#hero-rim-blur)"
              />
              <rect
                x="-62"
                y="-1"
                width="124"
                height="2"
                rx="999"
                fill="url(#hero-rim-ray)"
                transform="rotate(30)"
                filter="url(#hero-rim-blur)"
              />
              {!reduceMotion && (
                <>
                  <animateMotion dur="20s" repeatCount="indefinite" rotate="auto" calcMode="linear" keyPoints="1;0.5;0.5" keyTimes="0;0.1885;1">
                    <mpath href="#hero-earth-rim-path" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;0.72;1;0.74;0;0"
                    keyTimes="0;0.026;0.078;0.1365;0.1885;1"
                    dur="20s"
                    repeatCount="indefinite"
                  />
                </>
              )}
              {reduceMotion && <animateMotion dur="0.001s" fill="freeze" path="M 840 132 L 840 132" />}
            </g>
          </g>
        </svg>
      </div>

      <div className="absolute inset-x-0 top-0 z-[15] h-[58%] bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none" />
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center pointer-events-none"
        variants={heroTextContainer}
        {...loadMotion}
      >
        <div>
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
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
