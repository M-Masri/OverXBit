import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaChevronDown } from 'react-icons/fa6'
import { getContractDisplayLabel, sortContractsForClient } from '../utils/periodUtils'

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
        width: Math.max(rect.width, 320),
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

export default function PortalContractSelect({
  id = 'contract-select',
  label = 'Select Contract',
  contracts = [],
  value,
  onChange,
  placeholder = 'Choose contract',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const numericValue = Number(value)
  const hasValue = Number.isFinite(numericValue) && numericValue > 0
  const position = useDropdownPosition(triggerRef, isOpen)
  const options = useMemo(() => sortContractsForClient(contracts), [contracts])

  const selectedContract = useMemo(
    () => options.find((contract) => Number(contract?.id) === numericValue) || null,
    [numericValue, options]
  )

  const selectedLabel = selectedContract ? getContractDisplayLabel(selectedContract) : placeholder

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

  function handleSelect(contractId) {
    onChange?.(contractId)
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
          className="max-h-72 overflow-y-auto rounded-[1.1rem] border border-white/12 bg-[#07131a] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          {options.length ? (
            options.map((contract) => {
              const contractId = Number(contract.id)
              const isSelected = hasValue && contractId === numericValue

              return (
                <button
                  key={contract.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(contractId)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? 'bg-[#2ABBAF]/15 text-white'
                      : 'text-slate-200 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  <span>{getContractDisplayLabel(contract)}</span>
                  {isSelected ? <span className="text-[10px] uppercase tracking-[0.14em] text-[#2ABBAF]">Selected</span> : null}
                </button>
              )
            })
          ) : (
            <p className="px-3 py-2 text-sm text-slate-400">No contracts available.</p>
          )}
        </div>,
        document.body
      )
    : null

  return (
    <div ref={rootRef} className={`relative min-w-[280px] ${className}`.trim()}>
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
