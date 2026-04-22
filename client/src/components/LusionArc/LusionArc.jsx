import { motion, useScroll, useSpring } from 'framer-motion'

/*
  Lusion-style scroll-drawn arc.
  Mounts inside a wrapper that spans Testimonials + CTA.
  Starts drawing as soon as the testimonials header enters view,
  completes before the user scrolls past the CTA.
*/
export default function LusionArc({ color = '#ec4899', wrapperRef }) {
  const { scrollYProgress } = useScroll({
    target:  wrapperRef,
    // start: when wrapper top hits bottom of screen (95%)
    // end: when wrapper bottom reaches 70% of screen
    offset:  ['start 95%', 'end 70%'],
  })

  // Smooth spring — identical to AnimatedSnakeLine
  const pathLength = useSpring(scrollYProgress, { damping: 40, stiffness: 120 })

  /*
    Path inside 1000x600 viewbox (stretched by preserveAspectRatio="none").
    Starts top-right (1100, -100) — offscreen,
    sweeps down to bottom-left (-100, 300)
  */
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'visible' }}>
      <svg 
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible', filter: `drop-shadow(0 0 12px ${color}66)` }}
      >
        {/* Main thick stroke */}
        <motion.path
          d="M 1100 -100 C 1000 400, 600 800, 200 600 C -50 480, -150 200, -150 0"
          fill="none"
          stroke={color}
          strokeWidth="32"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength, opacity: 0.9 }}
        />
        {/* Thin echo stroke */}
        <motion.path
          d="M 1200 -50 C 1050 450, 650 850, 250 650 C 0 530, -100 250, -100 50"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength, opacity: 0.3 }}
        />
      </svg>
    </div>
  )
}
