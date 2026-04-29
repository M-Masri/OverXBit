import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import brandLogo from '../assets/OVERXBIT LOGO-04.png'

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
  const [isSticky, setIsSticky] = useState(false)
  // Animation removed

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

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 12)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 pt-2 pb-2 z-50 transition-colors duration-300 ${isSticky ? 'fixed-nav border-b border-white/10 bg-slate-950/80 backdrop-blur-xl' : 'bg-transparent'}`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <div>
          <Link to="/" className="relative inline-flex h-12 w-52 items-center -ml-10">
            <img src={brandLogo} alt="OVERXBIT" className="pointer-events-none absolute left-0 top-1/2 h-38 w-58 -translate-y-1/2 select-none" />
          </Link>
        </div>
        <nav
          className="hidden items-center gap-8 -ml-20 md:flex "
        >
          {navLinks.map((link) => (
            <a
              key={link.hash}
              href={link.href}
              onClick={() => setActiveHash(link.hash)}
              className={`text-sm transition hover:text-white ${activeHash === link.hash ? 'font-semibold text-orange-400' : 'text-slate-400'}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div>
            <Link
              to="/login"
              className="header-cta bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-1.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(251,146,60,0.45)] transition hover:brightness-110"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
