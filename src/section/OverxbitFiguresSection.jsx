import { useEffect, useRef, useState } from 'react'

const figures = [
  { target: 10, suffix: '+', label: 'Years Of Experience' },
  { target: 36, suffix: '+', label: 'Members' },
  { target: 7, suffix: '+', label: 'Countries' },
  { target: 22, suffix: '+', label: 'Research Papers' },
]

function CounterValue({ target, suffix, start, duration = 2600 }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) {
      return
    }

    let animationFrameId
    const animationStart = performance.now()

    const animate = (time) => {
      const elapsed = time - animationStart
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const next = Math.round(target * eased)

      setValue(next)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [duration, start, target])

  return (
    <span>
      {value}
      {suffix}
    </span>
  )
}

function OverxbitFiguresSection() {
  const sectionRef = useRef(null)
  const [startCounters, setStartCounters] = useState(false)

  useEffect(() => {
    const sectionElement = sectionRef.current

    if (!sectionElement) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry.isIntersecting) {
          setStartCounters(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(sectionElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section id="figures" ref={sectionRef} className="pt-16">
      <div className="figures-shell relative overflow-hidden px-6 py-12 sm:px-10 sm:py-14">
        <div className="figures-wave" />
        <div className="figures-orbs" />

        <div className="relative z-10">
          <h2 className="text-center font-display text-4xl text-white sm:text-5xl">
            Overxbit In <span className="text-gradient">Figures</span>
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {figures.map((item) => (
              <article
                key={item.label}
                className="p-5 text-center"
              >
                <p className="text-5xl font-bold text-white">
                  <CounterValue
                    target={item.target}
                    suffix={item.suffix}
                    start={startCounters}
                  />
                </p>
                <p className="mt-3 text-xl text-slate-200">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OverxbitFiguresSection
