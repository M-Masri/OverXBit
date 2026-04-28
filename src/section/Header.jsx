import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { createStaggerContainer, fadeDownVariants, getLoadMotion, hoverSpring, revealVariants } from '../lib/motion'

const navLinks = [
  { label: 'Home', href: '/#home', hash: '#home' },
  { label: 'Services', href: '/#services', hash: '#services' },
  { label: 'Figures', href: '/#figures', hash: '#figures' },
  { label: 'Why Us', href: '/#why', hash: '#why' },
  { label: 'FAQ', href: '/#faq', hash: '#faq' },
  { label: 'Contact', href: '/#contact', hash: '#contact' },
]

function Header() {
  const [activeHash, setActiveHash] = useState('#home')
  const reduceMotion = useReducedMotion()
  const loadMotion = getLoadMotion(reduceMotion)
  const linksContainerVariants = createStaggerContainer(0.1, 0.05)

  useEffect(() => {
    const onHashChange = () => {
      setActiveHash(window.location.hash || '#home')
    }

    onHashChange()
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  return (
    <motion.header
      className="fixed-nav fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
      variants={fadeDownVariants}
      {...loadMotion}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <motion.div variants={revealVariants}>
          <Link to="/" className="font-display text-2xl text-white">
            OVERXBIT
          </Link>
        </motion.div>
        <motion.nav
          className="hidden items-center gap-8 md:flex"
          variants={linksContainerVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          {navLinks.map((link) => (
            <motion.a
              key={link.hash}
              href={link.href}
              onClick={() => setActiveHash(link.hash)}
              variants={revealVariants}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              transition={hoverSpring}
              className={`text-sm transition hover:text-white ${activeHash === link.hash ? 'font-semibold text-white' : 'text-slate-400'}`}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.nav>
        <div className="flex items-center gap-3">
          <motion.div variants={revealVariants}>
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
              transition={hoverSpring}
            >
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(251,146,60,0.45)] transition hover:brightness-110"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
