import { FaCheck } from 'react-icons/fa6'

function PortalModuleToggle({ activeModule = 'mining', onChange }) {
  const isTrading = activeModule === 'trading'
  const label = isTrading ? 'Trading' : 'Mining'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isTrading}
      aria-label={`Switch to ${isTrading ? 'mining' : 'trading'} mode`}
      onClick={() => onChange?.(isTrading ? 'mining' : 'trading')}
      className="group relative h-9 w-[6.5rem] shrink-0 rounded-full p-[2px] transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70A9DC] active:scale-[0.98]"
    >
      <span
        aria-hidden="true"
        className="portal-module-toggle-track absolute inset-0 rounded-full transition-colors duration-200"
      />

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 z-[1] -translate-y-1/2 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.35)] transition-all duration-300 ease-out ${
          isTrading ? 'left-2.5 opacity-100' : 'right-2 opacity-100'
        }`}
      >
        {label}
      </span>

      <span
        aria-hidden="true"
        className={`absolute top-1/2 z-[2] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.25,0.64,1)] group-hover:shadow-[0_4px_12px_rgba(15,23,42,0.26)] ${
          isTrading ? 'left-[calc(100%-1.875rem)]' : 'left-[2px]'
        } shadow-[0_2px_8px_rgba(15,23,42,0.22),0_1px_2px_rgba(15,23,42,0.1)]`}
      >
        <span className="absolute inset-[2px] rounded-full bg-gradient-to-b from-white via-white to-slate-100" />
        <FaCheck className="relative text-[9px] text-[#9ca3af]" />
      </span>
    </button>
  )
}

export default PortalModuleToggle
