import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaChevronDown } from 'react-icons/fa6'
import { buildPeriodGroups, getPeriodDisplayLabel } from '../utils/periodUtils'

function useDropdownPosition(triggerRef, isOpen) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return undefined
    }

    function updatePosition() {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width, 300),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, triggerRef])

  return position
}

export default function PortalPeriodSelect({
  id = 'period-select',
  label = 'Select Period',
  periods = [],
  contracts = [],
  value,
  onChange,
  placeholder = 'Choose period',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const numericValue = Number(value)
  const hasValue = Number.isFinite(numericValue) && numericValue > 0
  const position = useDropdownPosition(triggerRef, isOpen)

  const selectedPeriod = useMemo(
    () => periods.find((period) => Number(period?.id) === numericValue) || null,
    [numericValue, periods]
  )

  const groups = useMemo(() => buildPeriodGroups(periods, contracts), [contracts, periods])
  const selectedLabel = selectedPeriod ? getPeriodDisplayLabel(selectedPeriod) : placeholder

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      const target = event.target
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function handleSelect(periodId) {
    onChange?.(periodId)
    setIsOpen(false)
  }

  const menu = isOpen
    ? createPortal(
        <div
          ref={menuRef}
          role="listbox"
          aria-labelledby={id}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 120,
          }}
          className="max-h-80 overflow-y-auto rounded-[1.1rem] border border-white/12 bg-[#07131a] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          {periods.length ? (
            groups.map((group, groupIndex) => (
              <div key={group.label || `group-${groupIndex}`} className={groupIndex > 0 ? 'mt-2 border-t border-white/8 pt-2' : ''}>
                {group.label ? (
                  <p className="px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">{group.label}</p>
                ) : null}

                {group.periods.map((period) => {
                  const periodId = Number(period.id)
                  const isSelected = hasValue && periodId === numericValue

                  return (
                    <button
                      key={period.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(periodId)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? 'bg-[#2ABBAF]/15 text-white'
                          : 'text-slate-200 hover:bg-white/6 hover:text-white'
                      }`}
                    >
                      <span>{getPeriodDisplayLabel(period)}</span>
                      {isSelected ? <span className="text-[10px] uppercase tracking-[0.14em] text-[#2ABBAF]">Selected</span> : null}
                    </button>
                  )
                })}
              </div>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-slate-400">No periods available.</p>
          )}
        </div>,
        document.body
      )
    : null

  return (
    <div ref={rootRef} className={`relative min-w-[220px] ${className}`.trim()}>
      <label htmlFor={id} className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </label>

      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-white/15 bg-[#0b1a1f] px-3 py-2 text-left text-sm text-white outline-none transition hover:border-white/25 focus:border-[#2ABBAF]"
      >
        <span className={hasValue ? 'text-white' : 'text-slate-400'}>{selectedLabel}</span>
        <FaChevronDown className={`shrink-0 text-xs text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {menu}
    </div>
  )
}
