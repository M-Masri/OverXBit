import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { FaChevronDown, FaUserLarge } from 'react-icons/fa6'
import brandLogo from '../assets/OVERXBIT LOGO-04.png'
import { servicesData } from '../lib/servicesData'
import { clearSession, selectUser } from '../services/authSlice'
import { clearStoredToken } from '../services/sessionStorage'
import { overxApi } from '../services/overxApi'

const navLinks = [
  { label: 'FAQ', to: '/faq', match: '/faq' },
  { label: 'Contact', to: '/contact', match: '/contact' },
]

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(selectUser)
  const hasUserData = Boolean(user)
  const isPortalRoute = location.pathname.startsWith('/portal')
  const [activeHash, setActiveHash] = useState('#home')
  const [isSticky, setIsSticky] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const servicesMenuRef = useRef(null)
  const profileMenuRef = useRef(null)
  // Animation removed

  useEffect(() => {
    setIsProfileMenuOpen(false)

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

      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsServicesOpen(false)
        setIsProfileMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function handlePortalLogout() {
    clearStoredToken()
    dispatch(clearSession())
    dispatch(overxApi.util.resetApiState())
    setIsProfileMenuOpen(false)
    navigate('/login', { replace: true })
  }

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
            className={`text-sm transition hover:text-white ${activeHash === '#home' ? 'font-semibold text-[#70A9DC]' : 'text-slate-400'}`}
          >
            Home
          </Link>

          <div className="relative" ref={servicesMenuRef}>
            <button
              type="button"
              onClick={() => setIsServicesOpen((prev) => !prev)}
              className={`inline-flex items-center gap-2 text-sm transition hover:text-white ${activeHash === '#services' || isServicesOpen ? 'font-semibold text-[#70A9DC]' : 'text-slate-400'}`}
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
              className={`text-sm transition hover:text-white ${activeHash === link.match ? 'font-semibold text-[#70A9DC]' : 'text-slate-400'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={`flex gap-3 ${isPortalRoute ? 'items-start' : 'items-center'} ${isPortalRoute && isProfileMenuOpen ? 'self-start pt-1' : ''}`}>
          {isPortalRoute ? (
            <div className={`relative ${isProfileMenuOpen ? 'w-52 overflow-hidden rounded-2xl border border-[#3b82f6]/30 bg-[rgba(5,14,32,0.97)]' : ''}`} ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className={`group flex w-52 items-center gap-3 px-3 py-2 transition ${isProfileMenuOpen ? 'border-0 border-b border-[#3b82f6]/30 bg-transparent' : 'rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] hover:border-[#3b82f6]/45 hover:bg-[rgba(59,130,246,0.1)]'}`}
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[rgba(59,130,246,0.2)] text-white">
                  <FaUserLarge className="text-sm" />
                </span>

                <span className="min-w-0 text-left">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400">MY PROFILE</span>
                  <span className="mt-1 block max-w-[9rem] truncate text-sm font-medium text-white" title={user?.email || user?.name || 'Client User'}>
                    {user?.email || user?.name || 'Client User'}
                  </span>
                </span>

                <FaChevronDown className="text-[10px] text-slate-400" />
              </button>

              {isProfileMenuOpen ? (
                <div
                  role="menu"
                  className="w-52 space-y-1 bg-transparent p-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      navigate('/portal/profile')
                    }}
                    className="w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-white transition hover:border-[#3b82f6]/45 hover:bg-[rgba(59,130,246,0.18)]"
                  >
                    Edit My Profile
                  </button>
                  <button
                    type="button"
                    onClick={handlePortalLogout}
                    className="w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-[#fecaca] transition hover:border-red-300/35 hover:bg-red-500/15 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <Link
                to={hasUserData ? '/portal/dashboard' : '/login'}
                className="header-cta bg-gradient-to-r from-[#70A9DC] to-[#3D6FA8] px-5 py-1.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(61,111,168,0.45)] transition hover:brightness-110"
              >
                {hasUserData ? 'Dashboard' : 'Login'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
