import { motion, useReducedMotion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { createStaggerContainer, getInViewMotion, hoverSpring, revealVariants } from '../lib/motion'
import brandLogo from '../assets/OVERXBIT LOGO-04.png'

const socialLinks = [
  {
    label: 'Instagram',
    href: '#',
    icon: FaInstagram,
  },
  {
    label: 'YouTube',
    href: '#',
    icon: FaYoutube,
  },
  {
    label: 'Facebook',
    href: '#',
    icon: FaFacebookF,
  },
  {
    label: 'X',
    href: '#',
    icon: FaXTwitter,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: FaLinkedinIn,
  },
]

function SiteFooter() {
  const reduceMotion = useReducedMotion()
  const inViewMotion = getInViewMotion(reduceMotion)
  const columnsContainer = createStaggerContainer(0.1, 0.04)
  const socialsContainer = createStaggerContainer(0.08, 0.02)

  return (
    <motion.footer className="footer-shell mt-16 overflow-hidden" variants={revealVariants} {...inViewMotion}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
  

      <motion.div
        className="grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-start"
        variants={columnsContainer}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
      >
        <motion.div variants={revealVariants}>
          <div className="relative h-16 w-56 -ml-10">
            <img
              src={brandLogo}
              alt="OVERXBIT"
              className="pointer-events-none absolute left-0 top-1/2 h-28 w-auto -translate-y-1/2 select-none"
            />
          </div>
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
            {socialLinks.map((item) => (
              <motion.a
                key={item.label}
                className="footer-social"
                href={item.href}
                aria-label={item.label}
                variants={revealVariants}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }}
                transition={hoverSpring}
              >
                <item.icon className="footer-social-icon" aria-hidden="true" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={revealVariants} className='mt-3'>
          <p className="footer-heading">Company</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">About</a></li>
            <li><a className="footer-link" href="#">Our Services</a></li>
            <li><a className="footer-link" href="#">Pricing</a></li>
            <li><a className="footer-link" href="#">Docs</a></li>
          </ul>
        </motion.div>

        <motion.div variants={revealVariants} className='mt-3'>
          <p className="footer-heading">Support</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">Account</a></li>
            <li><a className="footer-link" href="#faq">FAQ</a></li>
            <li><a className="footer-link" href="#contact">Contact</a></li>
            <li><a className="footer-link" href="#">Help Center</a></li>
          </ul>
        </motion.div>

        <motion.div variants={revealVariants} className='mt-3'>
          <p className="footer-heading">Legal</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">Privacy Policy</a></li>
            <li><a className="footer-link" href="#">Terms of Service</a></li>
            <li><a className="footer-link" href="#">Cookies</a></li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.div variants={revealVariants} className="border-t border-white/10 py-4 text-center text-sm text-slate-500">
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
