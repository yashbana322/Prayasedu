import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './LusionSection.css'

gsap.registerPlugin(ScrollTrigger)

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */
const EXPERTISE = [
  { title: 'Academic Excellence', desc: 'Rigorous curriculum, modern pedagogical methods.', icon: '01' },
  { title: 'Creative Arts', desc: 'Unlocking imagination through comprehensive arts programs.', icon: '02' },
  { title: 'Physical Education', desc: 'State-of-the-art facilities fostering athletic prowess.', icon: '03' },
  { title: 'Tech Leadership', desc: 'Pioneering digital literacy and forward-thinking integration.', icon: '04' },
]

/* ──────────────────────────────────────────────
   FluidCanvas2D — 2D Canvas Port of Reference Logic
   ────────────────────────────────────────────── */
const FluidCanvas2D = ({ reducedMotion }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let W, H;
    let animationFrameId;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30fps cap
    let isVisible = true;

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Pause when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    observer.observe(canvas)

    // PRE-RENDER SPRITES FOR BUTTERY SMOOTH 60FPS
    const SHAPES = ['circle', 'square', 'cross', 'triangle', 'diamond'];
    const spriteCaches = {};
    SHAPES.forEach(shape => {
      const s = 24; // High-res base canvas sprite size
      const off = document.createElement('canvas');
      off.width = s; off.height = s;
      const octx = off.getContext('2d');
      octx.fillStyle = '#ffffff';
      octx.translate(s / 2, s / 2);
      
      if (shape === 'circle') {
        octx.beginPath(); octx.arc(0, 0, s * 0.45, 0, Math.PI * 2); octx.fill();
      } else if (shape === 'square') {
        octx.fillRect(-s * 0.4, -s * 0.4, s * 0.8, s * 0.8);
      } else if (shape === 'diamond') {
        octx.beginPath(); octx.moveTo(0, -s * 0.5); octx.lineTo(s * 0.4, 0); octx.lineTo(0, s * 0.5); octx.lineTo(-s * 0.4, 0); octx.fill();
      } else if (shape === 'triangle') {
        octx.beginPath(); octx.moveTo(0, -s * 0.5); octx.lineTo(s * 0.45, s * 0.4); octx.lineTo(-s * 0.45, s * 0.4); octx.fill();
      } else { // cross
        const t = s * 0.14;
        octx.fillRect(-t, -s * 0.45, t * 2, s * 0.9);
        octx.fillRect(-s * 0.45, -t, s * 0.9, t * 2);
      }
      spriteCaches[shape] = off;
    });

    const NUM = 1400; // Reduced from 3800 for performance

    const mouse = { x: W / 2, y: H, vx: 0, vy: 0 };
    let active = false;

    // particle density strictly settled at the bottom like stones
    const particles = Array.from({ length: NUM }, () => {
      // Heavily bias towards the very bottom.
      // Math.random() ** 3 pushes random numbers closer to 0. 
      // So H * (1.0 - low_number) means most particles span the bottom 15% edge
      const py = H * (1.0 - (Math.random() ** 3) * 0.15); 
      const px = Math.random() * W;
      // Increased size of shapes slightly
      const sz = 2.5 + Math.random() * 6.5; 
      return {
        x: px, y: py, ox: px, oy: py,
        vx: 0, vy: 0,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        size: sz,
        alpha: 0.45 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        spd: 0.35 + Math.random() * 0.9,
        str: 0.4 + Math.random() * 0.6,
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 0.04,
      };
    });

    // scatter some remaining ones in the rest of the area
    for (let i = 0; i < 120; i++) {
      const p = particles[i];
      p.ox = p.x = Math.random() * W;
      p.oy = p.y = Math.random() * H * 0.85;
      p.size = 2.0 + Math.random() * 4;
      p.alpha = 0.2 + Math.random() * 0.4;
    }

    // Fast sprite renderer
    // Completely bypasses generic `ctx.save()` and `ctx.restore()` state API bottlenecks
    function drawShape(p) {
      const isCircle = p.shape === 'circle';
      ctx.globalAlpha = p.alpha;
      
      ctx.translate(p.x, p.y);
      if (!isCircle) ctx.rotate(p.rot); // Circles look identical rotated, skip math
      
      ctx.drawImage(spriteCaches[p.shape], -p.size / 2, -p.size / 2, p.size, p.size);
      
      if (!isCircle) ctx.rotate(-p.rot); // Math inversion is lightyears faster than state restore
      ctx.translate(-p.x, -p.y);
    }

    let time = 0;
    function animate(timestamp) {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return; // pause when off-screen
      const elapsed = timestamp - lastTime;
      if (elapsed < FRAME_INTERVAL) return; // 30fps cap
      lastTime = timestamp - (elapsed % FRAME_INTERVAL);
      time += 0.018;

      ctx.globalAlpha = 1.0;
      ctx.clearRect(0, 0, W, H);

      // Cache heavily accessed arrays/constants
      const parts = particles;
      const len = parts.length;
      const isMouseActive = active;
      const mx = mouse.x;
      const my = mouse.y;
      const mvx = mouse.vx;
      const mvy = mouse.vy;

      for (let i = 0; i < len; i++) {
        const p = parts[i];

        // layered fluid noise
        const n1 = Math.sin(p.ox * 0.011 + time * p.spd * 0.5 + p.phase) * Math.cos(p.oy * 0.008 - time * 0.3);
        const n2 = Math.sin(p.ox * 0.006 - p.oy * 0.009 + time * p.spd * 0.4 + p.phase * 1.3);
        const angle = (n1 + n2) * Math.PI * 3;
        const wave = Math.sin(p.ox * 0.007 + time * 0.7 + p.phase) * 1.4 * p.str;

        // fluid drift
        p.vx += Math.cos(angle) * 0.15 * p.str;
        p.vy += Math.sin(angle) * 0.1 * p.str + wave * 0.12;

        // mouse repulsion (Optimized with early boundary check avoiding Math.sqrt)
        if (isMouseActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < 22500) { // 150^2 = 22500 (Radius check)
            const dist = Math.sqrt(distSq);
            const nd = dist || 1;
            const f = Math.pow(1 - dist / 150, 2) * 6;
            p.vx += (dx / nd) * f + mvx * 0.4 * (1 - dist / 150);
            p.vy += (dy / nd) * f + mvy * 0.4 * (1 - dist / 150);
          }
        }

        // spring back to origin
        p.vx += (p.ox - p.x) * 0.022;
        p.vy += (p.oy - p.y) * 0.022;

        // damping
        p.vx *= 0.87;
        p.vy *= 0.87;

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpd;

        drawShape(p);
      }
    }

    const mouseMove = (e) => {
      mouse.vx = e.clientX - mouse.x;
      mouse.vy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      active = true;
    }
    const mouseLeave = () => active = false;

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseleave', mouseLeave);

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseleave', mouseLeave);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    }
  }, [reducedMotion]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }} />;
}

/* ──────────────────────────────────────────────
   DOMCardsGroup — GSAP ScrollTrigger Sequence
   ────────────────────────────────────────────── */
const DOMCardsGroup = ({ sectionRef, reducedMotion }) => {
  const cardRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const mobile = window.innerWidth < 768

    if (reducedMotion) {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const left = mobile ? 50 : 50 + (i - 1.5) * 22
        const bottom = mobile ? 5 + (3 - i) * 15 : 6
        gsap.set(card, {
          left: left + '%', bottom: bottom + '%',
          xPercent: -50, yPercent: 0,
          z: 0, rotationX: 0, rotationY: 0, rotationZ: 0,
          scale: 1, opacity: 1,
        })
      })
      gsap.set('.lusion-final-reveal', { opacity: 1, scale: 1 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    })

    const titles = section.querySelectorAll('.lusion-title-line-inner')
    const reveal = section.querySelector('.lusion-final-reveal')
    const canvasWrap = section.querySelector('.lusion-canvas-wrapper')

    // Init Reveal
    gsap.set(reveal, { opacity: 0, scale: 0.9, yPercent: 0, filter: 'blur(20px)' })
    gsap.set(canvasWrap, { opacity: 0 })

    // Init cards (stacked deck at bottom)
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      gsap.set(card, {
        xPercent: -50, left: '50%', bottom: '-120%',
        z: -80 * (4 - i), rotationX: 40,
        rotationZ: (Math.random() - 0.5) * 12,
        opacity: 1, scale: 1,
      })
    })

    // Phase 1 (0 → 0.25): Fly up to deck stack
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      tl.to(card, {
        bottom: '12%', z: -15 * (4 - i),
        rotationX: 15, ease: 'power3.inOut',
      }, 0.05 + i * 0.04)
    })

    // Phase 2 (0.25 → 0.55): Spread out
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const left = mobile ? 50 : 50 + (i - 1.5) * 23
      const bottom = mobile ? 2 + (3 - i) * 15 : 6
      tl.to(card, {
        left: left + '%', bottom: bottom + '%',
        z: 0, rotationX: 0, rotationY: 720,
        rotationZ: (i - 1.5) * 2, ease: 'power4.out',
      }, 0.25 + i * 0.04)
    })

    // Phase 3 (0.55 → 0.70): Hold down section for reading

    // Phase 4 (0.70 → 0.90): Cards Explode & Disperse
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const exitX = mobile
        ? (i % 2 === 0 ? -120 : 120)
        : (i - 1.5) * 90 + 50
      tl.to(card, {
        left: exitX + '%', bottom: '140%', z: 300,
        scale: 0, opacity: 0,
        rotationX: (Math.random() - 0.5) * 200,
        rotationY: (Math.random() - 0.5) * 200,
        ease: 'power3.in',
      }, 0.70)
    })

    // Title Fades out at explosive start
    tl.to(titles, {
      scale: 0.6, opacity: 0, yPercent: -80, filter: 'blur(10px)',
      ease: 'power3.inOut', stagger: 0.03,
    }, 0.70)

    // Background transition to deep blue starts at 0.65
    tl.to(section, {
      backgroundColor: '#1A39F6',
      ease: 'none',
    }, 0.65)

    // Fade in canvas particles exactly dynamically when text appears
    tl.fromTo(canvasWrap,
      { opacity: 0 },
      { opacity: 1, ease: 'none', immediateRender: false },
      0.70
    )

    // EXACTLY AT 0.70 (same time as cards disperse): Reveal "Let's work together!" text
    tl.fromTo(reveal, 
      { opacity: 0, scale: 1.3, filter: 'blur(24px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power3.out', immediateRender: false }, 
      0.70
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [sectionRef, reducedMotion])

  return (
    <div
      className="lusion-dom-cards-wrapper"
      style={{
        position: 'absolute', inset: 0,
        perspective: '1500px', pointerEvents: 'none', zIndex: 15,
      }}
    >
      {EXPERTISE.map((d, i) => (
        <article
          key={i}
          ref={(el) => (cardRefs.current[i] = el)}
          className="lusion-dom-card"
          onMouseEnter={(e) => {
            if (!reducedMotion) gsap.to(e.currentTarget, { scale: 1.06, duration: 0.3, ease: 'power2.out' })
          }}
          onMouseLeave={(e) => {
            if (!reducedMotion) gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })
          }}
        >
          <div className="lusion-dom-card__icon">{d.icon}</div>
          <h3 className="lusion-dom-card__title">{d.title}</h3>
          <div className="lusion-dom-card__divider" />
          <p className="lusion-dom-card__desc">{d.desc}</p>
        </article>
      ))}
    </div>
  )
}

/* ──────────────────────────────────────────────
   LusionSection — Main Component Wrapper
   ────────────────────────────────────────────── */
export default function LusionSection() {
  const sectionRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const h = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', h)

    const lines = sectionRef.current?.querySelectorAll('.lusion-title-line-inner')
    if (lines && !mq.matches) {
      // Premium 3D flip-up entrance mirroring the cards below
      gsap.fromTo(lines,
        { 
          yPercent: 100, 
          rotationX: 90, 
          transformOrigin: '50% 100%',
          opacity: 0
        },
        {
          yPercent: 0, 
          rotationX: 0,
          opacity: 1,
          duration: 1.4, 
          stagger: 0.15, 
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    } else if (lines) {
      gsap.set(lines, { yPercent: 0, opacity: 1, rotationX: 0 })
    }

    return () => {
      mq.removeEventListener('change', h)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <section
      className="lusion-section"
      ref={sectionRef}
      aria-labelledby="expertise-heading"
    >
      <div className="lusion-sticky-container">
        
        {/* Title */}
        <h2 id="expertise-heading" className="lusion-title">
          <div className="lusion-title-line">
            <div className="lusion-title-line-inner">AREA OF</div>
          </div>
          <div className="lusion-title-line">
            <div className="lusion-title-line-inner">EXPERTISE</div>
          </div>
        </h2>

        {/* Text Reveal sits behind particles (zIndex: 5 set in CSS) */}
        <h2 className="lusion-final-reveal" aria-hidden="true">
          Let's work<br />together!
        </h2>



        {/* GSAP DOM Cards Overlay */}
        <DOMCardsGroup sectionRef={sectionRef} reducedMotion={reducedMotion} />
      </div>
    </section>
  )
}
