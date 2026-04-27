import { useEffect, useState } from 'react'

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
    <header className="fixed-nav fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="/" className="font-display text-2xl text-white">
          OVERXBIT
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.hash}
              href={link.href}
              onClick={() => setActiveHash(link.hash)}
              className={`text-sm transition hover:text-white ${activeHash === link.hash ? 'font-semibold text-white' : 'text-slate-400'}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(251,146,60,0.45)] transition hover:brightness-110"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
