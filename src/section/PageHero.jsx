import { motion, useReducedMotion } from 'framer-motion'
import { createStaggerContainer, getLoadMotion } from '../lib/motion'

function HeroRimHighlight({ begin = '0s', duration = '4.2s', baseOpacity = 0.95 }) {
  return (
    <g opacity={baseOpacity}>
      <rect x="-40" y="-1.35" width="80" height="2.7" rx="999" fill="url(#page-hero-rim-trail)" filter="url(#page-hero-rim-blur)" />
      <rect x="-34" y="-1.05" width="68" height="2.1" rx="999" fill="url(#page-hero-rim-streak)" transform="rotate(-12)" filter="url(#page-hero-rim-blur)" />
      <rect x="-28" y="-0.75" width="56" height="1.5" rx="999" fill="url(#page-hero-rim-ray)" transform="rotate(10)" filter="url(#page-hero-rim-blur)" />
      <animateMotion dur={duration} begin={begin} repeatCount="indefinite" rotate="auto" calcMode="linear" keyPoints="1;0" keyTimes="0;1">
        <mpath href="#page-hero-earth-rim-path" />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;0.14;0.9;1;0.62;0"
        keyTimes="0;0.16;0.42;0.58;0.78;1"
        calcMode="spline"
        keySplines="0.32 0 0.18 1;0.32 0 0.18 1;0.32 0 0.18 1;0.32 0 0.18 1;0.32 0 0.18 1"
        dur={duration}
        begin={begin}
        repeatCount="indefinite"
      />
    </g>
  )
}

function PageHero({ id, eyebrow, title, titleHighlight, description, children }) {
  const reduceMotion = useReducedMotion()
  const loadMotion = getLoadMotion(reduceMotion)
  const heroMotionEase = [0.16, 1, 0.3, 1]

  const heroMediaVariants = {
    hidden: { opacity: 0, scale: 1.06, y: 16, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.7, ease: heroMotionEase },
    },
  }

  const heroOverlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.35, ease: heroMotionEase } },
  }

  const heroCopyVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.25, ease: heroMotionEase } },
  }

  const heroCtaVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.3, ease: heroMotionEase } },
  }

  const heroTitleVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.35, ease: heroMotionEase } },
  }

  const heroTextContainer = createStaggerContainer(0.18, 0.16)

  return (
    <section id={id} className="hero-shell relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden">
      <motion.div className="absolute inset-0 z-10 pointer-events-none" variants={heroMediaVariants} {...loadMotion}>
        <img
          src="/assets/hero-static.webp"
          alt=""
          className="block h-full w-full object-cover object-bottom"
          style={{
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 74%, rgba(0, 0, 0, 0.82) 84%, rgba(0, 0, 0, 0.28) 94%, rgba(0, 0, 0, 0) 100%)',
            maskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 74%, rgba(0, 0, 0, 0.82) 84%, rgba(0, 0, 0, 0.28) 94%, rgba(0, 0, 0, 0) 100%)',
          }}
          loading="eager"
        />
      </motion.div>

      <div className="absolute inset-0 z-[14] pointer-events-none overflow-hidden">
        <svg className="h-full w-full" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <path id="page-hero-earth-rim-path" d="M 122 361 C 245 272, 390 226, 540 229 C 650 232, 750 257, 866 318" />
            <linearGradient id="page-hero-rim-trail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255, 226, 170, 0)" />
              <stop offset="24%" stopColor="rgba(255, 226, 170, 0.38)" />
              <stop offset="50%" stopColor="rgba(255, 240, 204, 0.94)" />
              <stop offset="76%" stopColor="rgba(255, 226, 170, 0.38)" />
              <stop offset="100%" stopColor="rgba(255, 249, 236, 0)" />
            </linearGradient>
            <linearGradient id="page-hero-rim-streak" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255, 245, 220, 0)" />
              <stop offset="30%" stopColor="rgba(255, 245, 220, 0.54)" />
              <stop offset="50%" stopColor="rgba(255, 250, 242, 1)" />
              <stop offset="70%" stopColor="rgba(255, 232, 184, 0.92)" />
              <stop offset="100%" stopColor="rgba(255, 250, 242, 0)" />
            </linearGradient>
            <linearGradient id="page-hero-rim-ray" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,250,242,0)" />
              <stop offset="26%" stopColor="rgba(255,245,220,0.4)" />
              <stop offset="50%" stopColor="rgba(255,250,242,1)" />
              <stop offset="74%" stopColor="rgba(255,232,184,0.88)" />
              <stop offset="100%" stopColor="rgba(255,250,242,0)" />
            </linearGradient>
            <filter id="page-hero-rim-blur" x="-260%" y="-300%" width="620%" height="700%">
              <feGaussianBlur stdDeviation="4.8" />
            </filter>
          </defs>

          {reduceMotion ? (
            <g opacity="0.46" transform="translate(840 132)">
              <rect x="-40" y="-1.35" width="80" height="2.7" rx="999" fill="url(#page-hero-rim-trail)" filter="url(#page-hero-rim-blur)" />
              <rect x="-34" y="-1.05" width="68" height="2.1" rx="999" fill="url(#page-hero-rim-streak)" transform="rotate(-12)" filter="url(#page-hero-rim-blur)" />
              <rect x="-28" y="-0.75" width="56" height="1.5" rx="999" fill="url(#page-hero-rim-ray)" transform="rotate(10)" filter="url(#page-hero-rim-blur)" />
            </g>
          ) : (
            <HeroRimHighlight />
          )}
        </svg>
      </div>

      <motion.div
        className="absolute inset-x-0 top-0 z-[15] h-[58%] bg-gradient-to-b from-black/92 via-black/54 to-transparent pointer-events-none"
        variants={heroOverlayVariants}
        {...loadMotion}
      />

      <motion.div
        className="absolute inset-x-0 top-[17%] z-20 flex justify-center px-4 text-center pointer-events-none sm:top-[18%]"
        variants={heroTextContainer}
        {...loadMotion}
      >
        <div>
          {eyebrow ? (
            <motion.p variants={heroCopyVariants} className="text-xs uppercase tracking-[0.24em] text-[#8EC3EF]">
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.h1
            variants={heroTitleVariants}
            className={`mx-auto max-w-4xl font-display text-3xl leading-[1.05] text-white sm:text-5xl lg:text-[3.75rem] ${eyebrow ? 'mt-3' : ''}`}
          >
            <span className="block">{title}</span>
            {titleHighlight ? (
              <motion.span
                className="mt-2 block text-gradient sm:mt-3"
                initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 1.2, delay: 0.5, ease: heroMotionEase }
                }
              >
                {titleHighlight}
              </motion.span>
            ) : null}
          </motion.h1>

          {description ? (
            <motion.p variants={heroCopyVariants} className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white sm:text-lg">
              {description}
            </motion.p>
          ) : null}

          {children ? (
            <motion.div variants={heroCtaVariants} className="mt-7 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              {children}
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </section>
  )
}

export default PageHero
