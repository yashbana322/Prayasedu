import { useState, useRef, lazy, Suspense, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import PageTransition, { childVariants } from '../../components/PageTransition/PageTransition'
import WebGLBackground from '../../components/WebGLBackground/WebGLBackground'
const LusionArc = lazy(() => import('../../components/LusionArc/LusionArc'))
const LusionSection = lazy(() => import('../../components/LusionSection/LusionSection'))
import './Home.css'

const STATS = [
  { number: '25+', label: 'Years of Excellence' },
  { number: '2500+', label: 'Students Enrolled' },
  { number: '150+', label: 'Expert Faculty' },
  { number: '98%', label: 'Board Pass Rate' },
]

const PILLARS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    ),
    title: 'Academic Excellence',
    desc: 'Rigorous CBSE curriculum enhanced with experiential learning, critical thinking frameworks, and personalized mentorship.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/><path d="M8 12h.01"/><path d="M16 12h.01"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/></svg>
    ),
    title: 'Holistic Development',
    desc: 'A balanced approach nurturing mind, body, and spirit through arts, athletics, mindfulness, and community service.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
    title: 'Values & Character',
    desc: 'Building ethical leaders through integrity, empathy, and responsibility — values that define every Praysian.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: 'Future-Ready Skills',
    desc: 'STEM labs, digital literacy, entrepreneurship programs, and global exchange partnerships prepare students for tomorrow.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Prayas didn\'t just educate our daughter — they shaped her into a confident, compassionate leader. We couldn\'t have chosen a better school.',
    name: 'Meera & Rajesh Sharma',
    role: 'Parents of Class XII Student',
  },
  {
    quote: 'The teachers here go beyond the textbooks. They truly care about every student\'s growth and make learning an exciting journey.',
    name: 'Ananya Verma',
    role: 'Alumna, Batch of 2024',
  },
  {
    quote: 'From academics to co-curriculars, Prayas provides an environment where children discover their passions and reach their full potential.',
    name: 'Dr. Sunil Kapoor',
    role: 'Parent & Education Advocate',
  },
]

function Magnetic({ children }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e) => {
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const { x, y } = position
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

function ImageReveal({ src, alt, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      style={{ overflow: 'hidden', position: 'relative', borderRadius: '12px' }}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        initial={{ scale: 1.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay }}
      />
    </motion.div>
  )
}

function AnimatedSnakeLine({ scrollProgress }) {
  const pathLength = useSpring(scrollProgress, { damping: 40, stiffness: 120 })
  
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '150%', pointerEvents: 'none', zIndex: 0 }}>
      <svg 
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 0 12px rgba(37, 99, 235, 0.4))' }}
      >
        <motion.path
          d="M -100 400 C 200 100, 400 700, 600 300 S 800 500, 1100 200"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="32"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength, opacity: 0.8 }}
        />
        <motion.path
          d="M -100 300 C 300 -100, 700 800, 1100 100"
          fill="none"
          stroke="var(--color-accent)" 
          strokeWidth="12"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength, opacity: 0.3 }}
        />
      </svg>
    </div>
  )
}

export default function Home() {
  const heroRef      = useRef(null)
  const arcWrapperRef = useRef(null)
  const { scrollY } = useScroll()
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  return (
    <PageTransition className="home-page">
      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="hero" aria-label="Welcome to Prayas Public School" style={{ position: 'relative' }}>
        <WebGLBackground />
        <AnimatedSnakeLine scrollProgress={heroScroll} />

        <div className="container hero__content" style={{ zIndex: 10, position: 'relative' }}>
          <motion.div variants={childVariants} className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            Admissions Open 2026-27
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          >
            <h1 className="hero__title">
              Nurturing <span className="text-gradient">Excellence</span>,<br />
              Inspiring Futures
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="hero__subtitle"
          >
            At Prayas Public School, we don't just teach — we ignite curiosity, build character,
            and empower every child to become a leader of tomorrow.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            className="hero__actions"
          >
            <Magnetic>
              <Link to="/admissions" className="btn btn--primary btn--lg">
                Begin Your Journey
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/about" className="btn btn--outline btn--lg">
                Discover Our Story
              </Link>
            </Magnetic>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={childVariants} className="hero__stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <span className="hero__stat-number">{stat.number}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll" aria-hidden="true">
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ===== PILLARS SECTION ===== */}
      <section className="section pillars" aria-labelledby="pillars-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-header__subtitle">Our Foundation</p>
            <h2 id="pillars-title" className="section-header__title">
              The Four Pillars of <span className="text-gradient">Prayas</span>
            </h2>
            <div className="accent-bar accent-bar--center" />
            <p className="section-header__desc">
              Every aspect of our institution is built upon these core principles
              that guide our approach to nurturing young minds.
            </p>
          </motion.div>

          <div className="pillars__grid">
            {PILLARS.map((pillar, i) => (
              <motion.article
                key={pillar.title}
                className="glass-card pillars__card"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }}
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.1 }}
                style={{ transformPerspective: 1000, position: 'relative', overflow: 'hidden' }}
              >
                <div className="pillars__icon">{pillar.icon}</div>
                <h3 className="pillars__title">{pillar.title}</h3>
                <p className="pillars__desc">{pillar.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAMPUS SECTION ===== */}
      <section className="section section--dark campus" aria-labelledby="campus-title">
        <div className="container">
          <div className="campus__layout">
            <motion.div
              className="campus__content"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <p className="section-header__subtitle" style={{ textAlign: 'left' }}>Our Campus</p>
              <h2 id="campus-title">
                Where Learning <span className="text-gradient">Comes Alive</span>
              </h2>
              <div className="accent-bar" />
              <p>
                Spread across acres of lush greenery, our state-of-the-art campus features
                smart classrooms, advanced science and computer labs, a multi-sport complex,
                performing arts centre, and tranquil reading gardens.
              </p>
              <ul className="campus__features">
                <li>Smart Classrooms with Interactive Technology</li>
                <li>Olympic-Standard Sports Complex</li>
                <li>Advanced STEM & Robotics Lab</li>
                <li>Performing Arts Auditorium (500+ seating)</li>
                <li>Library with 15,000+ Volumes</li>
                <li>Safe, CCTV-Monitored Environment</li>
              </ul>
              <Link to="/reach-out#tour" className="btn btn--primary">
                Book a Campus Tour
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </motion.div>

            <motion.div
              className="campus__visual"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Replace with your campus images */}
              <div className="campus__image-grid">
                <ImageReveal 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
                  alt="Students smiling" 
                  className="campus__img campus__img--large" 
                  delay={0.2} 
                />
                <ImageReveal 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2064&auto=format&fit=crop" 
                  alt="Classroom" 
                  className="campus__img" 
                  delay={0.4} 
                />
                <ImageReveal 
                  src="https://images.unsplash.com/photo-1427504494785-319ce83d5272?q=80&w=2070&auto=format&fit=crop" 
                  alt="Campus building" 
                  className="campus__img" 
                  delay={0.6} 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== AREA OF EXPERTISE (LUSION SECTION) ===== */}
      <Suspense fallback={<div style={{ height: '60vh' }} />}>
        <LusionSection />
      </Suspense>

      {/* ===== TESTIMONIALS + CTA wrapper (arc spans both) ===== */}
      <div ref={arcWrapperRef} style={{ position: 'relative' }}>
        {/* Lusion-style pink scroll-drawn arc — spans testimonials → CTA */}
        <Suspense fallback={null}>
          <LusionArc color="#ec4899" wrapperRef={arcWrapperRef} />
        </Suspense>

        {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials" aria-labelledby="testimonials-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-header__subtitle">Voices of Trust</p>
            <h2 id="testimonials-title" className="section-header__title">
              What Our <span className="text-gradient">Community</span> Says
            </h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          <div className="testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.blockquote
                key={t.name}
                className="glass-card testimonials__card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -5, rotate: i % 2 === 0 ? 1 : -1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.15 }}
              >
                <svg className="testimonials__quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="var(--color-gold-500)" opacity="0.3"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                <p className="testimonials__text">{t.quote}</p>
                <footer className="testimonials__author">
                  <span className="testimonials__name">{t.name}</span>
                  <span className="testimonials__role">{t.role}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section cta-section" aria-label="Call to action" style={{ position: 'relative' }}>
        <div className="container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Shape Your Child's Future?</h2>
            <p>
              Join the Prayas family — where every student is valued, every dream nurtured,
              and every milestone celebrated.
            </p>
            <div className="cta-card__actions">
              <Link to="/admissions#enquiry" className="btn btn--primary btn--lg">
                Start Application
              </Link>
              <Link to="/reach-out" className="btn btn--outline btn--lg">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </div>{/* end arc wrapper */}
    </PageTransition>
  )
}
