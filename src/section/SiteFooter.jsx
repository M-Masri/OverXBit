import { motion, useReducedMotion } from 'framer-motion'
import { createStaggerContainer, getInViewMotion, hoverSpring, revealVariants } from '../lib/motion'

function SiteFooter() {
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)
  const newsletterContainer = createStaggerContainer(0.12, 0.08)
  const columnsContainer = createStaggerContainer(0.1, 0.04)
  const socialsContainer = createStaggerContainer(0.08, 0.02)

  return (
    <motion.footer className="footer-shell mt-16 overflow-hidden" variants={revealVariants} {...inViewMotion}>
      <div className="mx-auto w-full max-w-[1400px]">
      <motion.div
        className="footer-newsletter grid gap-6 px-6 py-8 md:grid-cols-[1.1fr_1fr] md:items-center md:px-10"
        variants={newsletterContainer}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
      >
        <motion.div variants={revealVariants}>
          <h3 className="font-display text-4xl leading-[1.05] text-white sm:text-5xl">
            Subscribe to our
            <br />
            <span className="text-white">newsletter</span>
          </h3>
          <p className="mt-4 max-w-md text-sm text-orange-100/85">
            Be the first to receive updates, market insights, and practical trading tips.
          </p>
        </motion.div>

        <motion.form className="footer-newsletter-form" variants={revealVariants}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <motion.input
              type="email"
              className="footer-newsletter-input"
              placeholder="Enter your email"
              whileFocus={reduceMotion ? undefined : { scale: 1.01 }}
              transition={hoverSpring}
            />
            <motion.button
              type="button"
              className="footer-newsletter-button"
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={hoverSpring}
            >
              Subscribe
            </motion.button>
          </div>
          <p className="mt-3 text-xs text-orange-100/80">
            By subscribing, you agree to our privacy policy and terms.
          </p>
        </motion.form>
      </motion.div>

      <motion.div
        className="grid gap-8 px-6 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10"
        variants={columnsContainer}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
      >
        <motion.div variants={revealVariants}>
          <p className="font-display text-2xl text-white">OVERXBIT</p>
          <p className="mt-3 max-w-sm leading-7 text-slate-400">
            Your trusted destination for strategic trading execution, reliable market research,
            and long-term performance growth.
          </p>

          <motion.div
            className="mt-6 flex gap-2"
            variants={socialsContainer}
            initial={reduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
          >
            <motion.a className="footer-social" href="#" aria-label="Instagram" variants={revealVariants} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }} transition={hoverSpring}>
              IG
            </motion.a>
            <motion.a className="footer-social" href="#" aria-label="YouTube" variants={revealVariants} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }} transition={hoverSpring}>
              YT
            </motion.a>
            <motion.a className="footer-social" href="#" aria-label="Facebook" variants={revealVariants} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }} transition={hoverSpring}>
              FB
            </motion.a>
            <motion.a className="footer-social" href="#" aria-label="X" variants={revealVariants} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }} transition={hoverSpring}>
              X
            </motion.a>
            <motion.a className="footer-social" href="#" aria-label="LinkedIn" variants={revealVariants} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }} transition={hoverSpring}>
              IN
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div variants={revealVariants}>
          <p className="footer-heading">Company</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">About</a></li>
            <li><a className="footer-link" href="#">Our Services</a></li>
            <li><a className="footer-link" href="#">Pricing</a></li>
            <li><a className="footer-link" href="#">Docs</a></li>
          </ul>
        </motion.div>

        <motion.div variants={revealVariants}>
          <p className="footer-heading">Support</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">Account</a></li>
            <li><a className="footer-link" href="#faq">FAQ</a></li>
            <li><a className="footer-link" href="#contact">Contact</a></li>
            <li><a className="footer-link" href="#">Help Center</a></li>
          </ul>
        </motion.div>

        <motion.div variants={revealVariants}>
          <p className="footer-heading">Legal</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">Privacy Policy</a></li>
            <li><a className="footer-link" href="#">Terms of Service</a></li>
            <li><a className="footer-link" href="#">Cookies</a></li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.div variants={revealVariants} className="border-t border-white/10 px-6 py-4 text-center text-sm text-slate-500 md:px-10">
        © 2026 OVERXBIT. All rights reserved. Developed by{' '}
        <a
          href="https://www.sawatech.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link text-orange-300 hover:text-orange-200"
        >
          SawaTech
        </a>
      </motion.div>
      </div>
    </motion.footer>
  )
}

export default SiteFooter
