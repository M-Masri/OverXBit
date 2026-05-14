import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import brandLogo from '../assets/OVERXBIT LOGO-04.png'
import { servicesData } from '../lib/servicesData'
import { selectUser } from '../services/authSlice'

const navLinks = [
  { label: 'FAQ', to: '/faq', match: '/faq' },
  { label: 'Contact', to: '/contact', match: '/contact' },
]

function Header() {
  const user = useSelector(selectUser)
  const hasUserData = Boolean(user)
  const [activeHash, setActiveHash] = useState('#home')
  const [isSticky, setIsSticky] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const servicesMenuRef = useRef(null)
  const location = useLocation()
  // Animation removed

  useEffect(() => {
    if (location.pathname === '/') {
      setActiveHash(location.hash || '#home')
      return
    }

    if (location.pathname.startsWith('/services/')) {
      setActiveHash('#services')
      return
    }

    setActiveHash(location.pathname)
  }, [location.hash, location.pathname])

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

  useEffect(() => {
    const onPointerDown = (event) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
        setIsServicesOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsServicesOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
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
          <Link
            to="/#home"
            onClick={() => {
              setActiveHash('#home')
              setIsServicesOpen(false)
            }}
            className={`text-sm transition hover:text-white ${activeHash === '#home' ? 'font-semibold text-[#2ABBAF]' : 'text-slate-400'}`}
          >
            Home
          </Link>

          <div className="relative" ref={servicesMenuRef}>
            <button
              type="button"
              onClick={() => setIsServicesOpen((prev) => !prev)}
              className={`inline-flex items-center gap-2 text-sm transition hover:text-white ${activeHash === '#services' || isServicesOpen ? 'font-semibold text-[#2ABBAF]' : 'text-slate-400'}`}
              aria-haspopup="menu"
              aria-expanded={isServicesOpen}
            >
              Services
              <span className={`text-[10px] transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isServicesOpen && (
              <div className="absolute left-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                {servicesData.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    onClick={() => {
                      setIsServicesOpen(false)
                      setActiveHash('#services')
                    }}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.match}
              to={link.to}
              onClick={() => {
                setActiveHash(link.match)
                setIsServicesOpen(false)
              }}
              className={`text-sm transition hover:text-white ${activeHash === link.match ? 'font-semibold text-[#2ABBAF]' : 'text-slate-400'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div>
            <Link
              to={hasUserData ? '/portal/dashboard' : '/login'}
              className="header-cta bg-gradient-to-r from-[#2ABBAF] to-[#2ABBAF] px-5 py-1.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(42,187,175,0.45)] transition hover:brightness-110"
            >
              {hasUserData ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
