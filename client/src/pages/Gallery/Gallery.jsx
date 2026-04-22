import { useState, Suspense, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../../components/PageTransition/PageTransition'
import WebGLGallery from '../../components/WebGLGallery/WebGLGallery'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import IntroAnimation from '../../components/ui/scroll-morph-hero'
import './Gallery.css'

const GALLERY_IMAGES = [
  { src: '/images/gallery/gallery-1.jpg', title: 'Campus Highlights',  tag: 'Campus Life' },
  { src: '/images/gallery/gallery-2.jpg', title: 'Student Activities', tag: 'Events'      },
  { src: '/images/gallery/gallery-3.jpg', title: 'Learning in Action', tag: 'Academics'   },
  { src: '/images/gallery/gallery-4.jpg', title: 'Creative Moments',   tag: 'Programs'    },
  { src: '/images/gallery/gallery-5.jpg', title: 'Sports & Athletics', tag: 'Athletics'   },
  { src: '/images/gallery/gallery-6.jpg', title: 'School Life',        tag: 'Events'      },
  { src: '/images/gallery/gallery-7.jpg', title: 'Our Community',      tag: 'Campus Life' },
  { src: '/images/gallery/gallery-8.jpg', title: 'Prayas Moments',     tag: 'Programs'    },
]

const IMAGES_ONLY = GALLERY_IMAGES.map(g => g.src)
const TOTAL = GALLERY_IMAGES.length

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef    = useRef(null)
  const isNavigating  = useRef(false)   // throttle rapid swipes
  const touchStartX   = useRef(null)
  const touchStartY   = useRef(null)
  const wheelAccum    = useRef(0)       // accumulate deltaX before triggering

  /* ── Navigation helpers ─────────────────────────────────── */
  const navigateTo = useCallback((index) => {
    const next = Math.max(0, Math.min(TOTAL - 1, index))
    setActiveIndex(next)
  }, [])

  const coolNav = useCallback((delta) => {
    /* Throttle: ignore if we just navigated <350 ms ago */
    if (isNavigating.current) return
    isNavigating.current = true
    setTimeout(() => { isNavigating.current = false }, 350)
    setActiveIndex(prev => Math.max(0, Math.min(TOTAL - 1, prev + delta)))
  }, [])

  const handlePrev = useCallback(() => navigateTo(activeIndex - 1), [activeIndex, navigateTo])
  const handleNext = useCallback(() => navigateTo(activeIndex + 1), [activeIndex, navigateTo])

  /* ── Touch / swipe (does NOT block page scroll) ─────────── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    }

    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return
      const dx = e.changedTouches[0].clientX - touchStartX.current
      const dy = e.changedTouches[0].clientY - touchStartY.current
      touchStartX.current = null
      touchStartY.current = null

      /* Only fire if the gesture is clearly more horizontal than vertical */
      if (Math.abs(dx) < 52 || Math.abs(dx) < Math.abs(dy) * 1.4) return
      coolNav(dx < 0 ? 1 : -1)
    }

    /* passive:true — lets the browser handle vertical page scroll normally */
    section.addEventListener('touchstart', onTouchStart, { passive: true })
    section.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      section.removeEventListener('touchstart', onTouchStart)
      section.removeEventListener('touchend',   onTouchEnd)
    }
  }, [coolNav])

  /* ── Wheel (horizontal track-pad swipe) ─────────────────── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onWheel = (e) => {
      /* Only care about horizontal axis; let vertical pass through naturally */
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return

      /* Prevent horizontal browser back/forward but keep vertical free */
      e.preventDefault()

      wheelAccum.current += e.deltaX
      if (Math.abs(wheelAccum.current) > 60) {
        coolNav(wheelAccum.current > 0 ? 1 : -1)
        wheelAccum.current = 0
      }
    }

    /* passive:false so preventDefault works on horizontal-only events */
    section.addEventListener('wheel', onWheel, { passive: false })
    return () => section.removeEventListener('wheel', onWheel)
  }, [coolNav])

  /* ── Keyboard (← →) ─────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); coolNav(-1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); coolNav(+1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [coolNav])

  const active = GALLERY_IMAGES[activeIndex]

  return (
    <PageTransition className="gallery-page">

      {/* ── HERO ──────────────────────────────────────────── */}
      <header className="gallery-hero">
        <div className="container">
          <motion.p
            className="section-header__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            Memories &amp; Milestones
          </motion.p>
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          >
            The Prayas <span className="text-gradient">Gallery</span>
          </motion.h1>
          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          >
            Swipe horizontally or use the arrows to step through moments from
            Prayas Public School. Experience the immersive 3D mesh transitions
            as you explore.
          </motion.p>
        </div>
      </header>

      {/* ── 3D VIEWER ─────────────────────────────────────── */}
      {/*
        KEY FIX: The old hidden overflowX:auto div at z-index 12 was swallowing
        ALL pointer events — including vertical page scroll — causing the
        "scroll getting stuck / uneven / laggy" bugs.
        
        It is completely removed. Navigation is now driven by:
          • Arrow buttons (click)
          • Touch swipe (horizontal dominant only)
          • Trackpad horizontal wheel
          • Keyboard ← →
        
        None of these block vertical page scrolling.
      */}
      <section
        ref={sectionRef}
        className="gallery-3d-section"
        aria-label="3D Gallery Viewer"
        aria-roledescription="carousel"
      >
        {/* WebGL canvas — pointer-events none so it never intercepts input */}
        <div className="gallery-canvas-wrapper" style={{ pointerEvents: 'none' }}>
          <ErrorBoundary
            fallback={
              <div className="gallery-loader">
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  3D viewer unavailable — try refreshing.
                </p>
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="gallery-loader">
                  <span className="gallery-loader__dot" />
                  <span className="gallery-loader__dot" />
                  <span className="gallery-loader__dot" />
                </div>
              }
            >
              <WebGLGallery images={IMAGES_ONLY} activeIndex={activeIndex} />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* ── Arrow buttons ─────────────────────────────── */}
        <button
          className="gallery-edge gallery-edge--left"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Previous image"
        >
          <div className="gallery-edge__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
        </button>

        <button
          className="gallery-edge gallery-edge--right"
          onClick={handleNext}
          disabled={activeIndex === TOTAL - 1}
          aria-label="Next image"
        >
          <div className="gallery-edge__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </button>

        {/* ── Floating caption ──────────────────────────── */}
        <div className="gallery-overlay-ui" style={{ zIndex: 10 }}>
          <div className="gallery-caption">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              >
                <span className="gallery-caption__tag">{active.tag}</span>
                <h2 className="gallery-caption__title">{active.title}</h2>
                <p className="gallery-caption__counter">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(TOTAL).padStart(2, '0')}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Progress scrubber ─────────────────────────── */}
        <div className="gallery-scrubber" aria-label="Gallery navigation progress" style={{ zIndex: 10 }}>
          <div className="gallery-scrubber__track">
            <motion.div
              className="gallery-scrubber__fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: (activeIndex + 1) / TOTAL }}
              transition={{ ease: 'linear', duration: 0.3 }}
            />
          </div>

          {/* Dot tick marks — also act as jump buttons */}
          <div className="gallery-scrubber__ticks" role="tablist" aria-label="Gallery images">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={img.title}
                className={`gallery-scrubber__tick${i === activeIndex ? ' active' : ''}`}
                onClick={() => navigateTo(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SCROLL-MORPH HERO (below carousel — kept as-is) ── */}
      <IntroAnimation />

    </PageTransition>
  )
}
