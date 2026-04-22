import { useEffect, useRef } from 'react'
import { motion, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import './CustomCursor.css'

export default function CustomCursor() {
  const isHovered = useRef(false)
  const isVisible = useRef(false)
  
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const scale  = useMotionValue(0)
  const opacity = useMotionValue(0)

  const cursorX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.5 })
  const cursorY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.5 })

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX - 16)
      mouseY.set(e.clientY - 16)
      if (!isVisible.current) {
        isVisible.current = true
        opacity.set(1)
        scale.set(1)
      }
    }

    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, input, [role="button"]')
      const nowHovered = !!target
      if (nowHovered !== isHovered.current) {
        isHovered.current = nowHovered
        scale.set(nowHovered ? 2.5 : 1)
      }
    }

    window.addEventListener('mousemove', moveCursor, { passive: true })
    window.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [mouseX, mouseY, scale, opacity])

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          x: cursorX,
          y: cursorY,
          scale,
          opacity,
        }}
      />
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
    </>
  )
}
