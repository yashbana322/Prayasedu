import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import './FluidBackground.css'

export default function FluidBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 100, stiffness: 200, mass: 4 })
  const springY = useSpring(mouseY, { damping: 100, stiffness: 200, mass: 4 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="fluid-wrap" aria-hidden="true">
      <div className="fluid-bg">
        <motion.div 
          className="fluid-blob fluid-blob--interactive"
          style={{ x: springX, y: springY }}
        />
        
        <motion.div 
          className="fluid-blob fluid-blob--auto-1"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1],
            x: ['-5vw', '5vw', '-5vw'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div 
          className="fluid-blob fluid-blob--auto-2"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
            y: ['-5vh', '12vh', '-5vh'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
