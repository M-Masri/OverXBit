import { useCallback, useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const EMBEDDED_CSS = `
.cascade-slider_container {
  position: relative;
  max-width: 1120px;
  height: 430px;
  margin: 0 auto;
  z-index: 20;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
}

.cascade-slider_slides {
  position: relative;
  height: 100%;
}

.cascade-slider_item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%) scale(0.3);
  transition: all 0.8s ease;
  opacity: 0;
  z-index: 1;
  cursor: grab;
}

.cascade-slider_item.now {
  cursor: default;
}

.cascade-slider_item:active {
  cursor: grabbing;
}

.cascade-slider_card {
  width: 210px;
  height: 310px;
}

.cascade-slider_item.next {
  left: 50%;
  transform: translateY(-50%) translateX(-120%) scale(0.6);
  opacity: 1;
  z-index: 4;
}

.cascade-slider_item.prev {
  left: 50%;
  transform: translateY(-50%) translateX(20%) scale(0.6);
  opacity: 1;
  z-index: 4;
}

.cascade-slider_item.now {
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%) scale(1);
  opacity: 1;
  z-index: 5;
}

.cascade-slider_item.next2 {
  transform: translateY(-50%) translateX(-150%) scale(0.37);
  opacity: 1;
  z-index: 1;
}

.cascade-slider_item.prev2 {
  transform: translateY(-50%) translateX(50%) scale(0.37);
  opacity: 1;
  z-index: 2;
}

.cascade-slider_arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  cursor: pointer;
  z-index: 6;
  transform: translate(0, -50%);
  width: 42px;
  height: 42px;
  transition: all 0.3s ease;
}

@media screen and (max-width: 575px) {
  .cascade-slider_arrow-left {
    left: 5px;
  }

  .cascade-slider_arrow-right {
    right: 5px;
  }
}

@media screen and (min-width: 576px) {
  .cascade-slider_arrow-left {
    left: -4%;
  }

  .cascade-slider_arrow-right {
    right: -4%;
  }
}

.cascade-slider_slides img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  display: block;
  transition: filter 0.8s ease;
}

.cascade-slider_item:not(.now) img {
  filter: grayscale(0.95);
}

@media screen and (min-width: 414px) {
  .cascade-slider_container {
    height: 450px;
  }

  .cascade-slider_card {
    width: 230px;
    height: 330px;
  }
}

@media screen and (min-width: 576px) {
  .cascade-slider_container {
    height: 500px;
  }

  .cascade-slider_card {
    width: 250px;
    height: 360px;
  }
}

@media screen and (min-width: 768px) {
  .cascade-slider_item.next {
    transform: translateY(-50%) translateX(-125%) scale(0.6);
  }

  .cascade-slider_item.prev {
    transform: translateY(-50%) translateX(25%) scale(0.6);
  }

  .cascade-slider_card {
    width: 250px;
    height: 360px;
  }
}

@media screen and (min-width: 991px) {
  .cascade-slider_item.next {
    transform: translateY(-50%) translateX(-115%) scale(0.55);
    z-index: 4;
  }

  .cascade-slider_item.prev {
    transform: translateY(-50%) translateX(15%) scale(0.55);
    z-index: 4;
  }

  .cascade-slider_item.next2 {
    transform: translateY(-50%) translateX(-150%) scale(0.37);
    z-index: 1;
  }

  .cascade-slider_item.prev2 {
    transform: translateY(-50%) translateX(50%) scale(0.37);
    z-index: 2;
  }

  .cascade-slider_card {
    width: 280px;
    height: 400px;
  }

  .cascade-slider_container {
    height: 560px;
  }
}

@media screen and (min-width: 1100px) {
  .cascade-slider_item.next {
    transform: translateY(-50%) translateX(-130%) scale(0.55);
  }

  .cascade-slider_item.prev {
    transform: translateY(-50%) translateX(30%) scale(0.55);
  }

  .cascade-slider_item.next2 {
    transform: translateY(-50%) translateX(-180%) scale(0.37);
  }

  .cascade-slider_item.prev2 {
    transform: translateY(-50%) translateX(80%) scale(0.37);
  }

  .cascade-slider_card {
    width: 300px;
    height: 430px;
  }

  .cascade-slider_container {
    height: 600px;
  }
}
`

function getSlideClasses(index, activeIndex, total, visibleCount) {
  const diff = index - activeIndex
  if (diff === 0) return 'now'
  if (diff === 1 || diff === -total + 1) return 'next'
  if (visibleCount === 5 && (diff === 2 || diff === -total + 2)) return 'next2'
  if (diff === -1 || diff === total - 1) return 'prev'
  if (visibleCount === 5 && (diff === -2 || diff === total - 2)) return 'prev2'
  return ''
}

function ThreeDCarousel({
  slides = [],
  itemCount = 5,
  autoplay = false,
  delay = 3,
  pauseOnHover = true,
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const autoplayIntervalRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const swipeThreshold = 50
  const total = slides.length

  const navigate = useCallback(
    (direction) => {
      if (total <= 1) return
      setActiveIndex((current) => {
        if (direction === 'next') {
          return (current + 1) % total
        }
        return (current - 1 + total) % total
      })
    },
    [total]
  )

  const startAutoplay = useCallback(() => {
    if (autoplay && total > 1) {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current)
      }
      autoplayIntervalRef.current = window.setInterval(() => {
        navigate('next')
      }, delay * 1000)
    }
  }, [autoplay, delay, navigate, total])

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
      autoplayIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [startAutoplay, stopAutoplay])

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      stopAutoplay()
    }
  }

  const handleStart = (clientX) => {
    setIsDragging(true)
    setStartX(clientX)
    stopAutoplay()
  }

  const handleEnd = useCallback(
    (clientX) => {
      if (!isDragging) return

      const distance = clientX - startX
      if (Math.abs(distance) > swipeThreshold) {
        if (distance < 0) {
          navigate('next')
        } else {
          navigate('prev')
        }
      }

      setIsDragging(false)
      setStartX(0)
    },
    [isDragging, navigate, startX]
  )

  const handleExit = (event) => {
    if (autoplay && pauseOnHover) {
      startAutoplay()
    }
    if (isDragging) {
      handleEnd(event.clientX)
    }
  }

  const onMouseDown = (event) => handleStart(event.clientX)
  const onMouseUp = (event) => {
    handleEnd(event.clientX)
    startAutoplay()
  }

  const onTouchStart = (event) => handleStart(event.touches[0].clientX)
  const onTouchEnd = (event) => {
    handleEnd(event.changedTouches[0].clientX)
    startAutoplay()
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EMBEDDED_CSS }} />

      <div
        className={`cascade-slider_container ${className} bg-transparent`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleExit}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cascade-slider_slides">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`cascade-slider_item ${getSlideClasses(index, activeIndex, total, itemCount)}`}
              data-slide-number={index}
            >
              <a href={slide.href || '#'}>
                <div className="cascade-slider_card relative overflow-hidden rounded-[26px] border border-white/10 bg-[rgba(6,12,24,0.86)] p-1.5 shadow-[0_12px_32px_rgba(2,6,23,0.34)]">
                  <img
                    src={slide.src}
                    alt={slide.alt || `Slide ${index + 1}`}
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = `https://placehold.co/350x200/4F46E5/ffffff?text=Slide%20${index + 1}`
                    }}
                  />
                  {(slide.title || slide.subtitle) && (
                    <div className="absolute inset-x-5 bottom-4 rounded-xl bg-[rgba(6,12,24,0.86)] px-3 py-2 text-center shadow-[0_10px_24px_rgba(2,6,23,0.24)] backdrop-blur-[2px]">
                      {slide.title && <h3 className="text-sm font-semibold text-white">{slide.title}</h3>}
                      {slide.subtitle && <p className="mt-0.5 text-[11px] font-medium text-white">{slide.subtitle}</p>}
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <span
              className="cascade-slider_arrow cascade-slider_arrow-left rounded-full bg-black/35 p-2 text-white transition-colors duration-300 hover:bg-black/60"
              onClick={(event) => {
                event.stopPropagation()
                navigate('prev')
              }}
              data-action="prev"
            >
              <FiChevronLeft size={26} />
            </span>
            <span
              className="cascade-slider_arrow cascade-slider_arrow-right rounded-full bg-black/35 p-2 text-white transition-colors duration-300 hover:bg-black/60"
              onClick={(event) => {
                event.stopPropagation()
                navigate('next')
              }}
              data-action="next"
            >
              <FiChevronRight size={26} />
            </span>
          </>
        )}
      </div>
    </>
  )
}

export default ThreeDCarousel
