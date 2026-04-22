import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import NavbarCanvas from './NavbarCanvas'
import './Navbar.css'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  {
    path: '/about',
    label: 'About',
    mega: true,
    children: [
      { path: '/about',              label: 'Our Story',    desc: 'History, vision & mission' },
      { path: '/about#values',       label: 'Core Values',  desc: 'What we stand for' },
      { path: '/about#achievements', label: 'Achievements', desc: 'Milestones & recognition' },
    ],
  },
  { path: '/meet-us', label: 'Leadership & Faculty' },
  {
    path: '/admissions',
    label: 'Admissions',
    mega: true,
    children: [
      { path: '/admissions',          label: 'Overview',     desc: 'Admission process & eligibility' },
      { path: '/admissions#fees',     label: 'Fee Structure', desc: 'Transparent fee breakdown' },
      { path: '/admissions#enquiry',  label: 'Enquiry Form', desc: 'Start your application' },
    ],
  },
  { path: '/donate',    label: 'Philanthropy' },
  { path: '/gallery',   label: 'Gallery'      },
  { path: '/reach-out', label: 'Contact'      },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMega, setActiveMega] = useState(null)
  const megaRef  = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close menus on route change */
  useEffect(() => {
    setMobileOpen(false)
    setActiveMega(null)
  }, [location.pathname])

  /* Close mega on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setActiveMega(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── Navigate instantly ── */
  const go = (path) => {
    setActiveMega(null)
    setMobileOpen(false)
    if (path === location.pathname) return
    navigate(path)
  }

  return (
    <header
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      role="banner"
    >
      <NavbarCanvas />
      <nav className="navbar__inner container" aria-label="Main navigation" ref={megaRef}>

        {/* Logo */}
        <button
          className="navbar__logo"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          onClick={() => go('/', 'Home')}
          aria-label="Prayas Public School Home"
        >
          <span className="navbar__logo-icon">P</span>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">Prayas</span>
            <span className="navbar__logo-tagline">Public School</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <ul className="navbar__links" role="menubar">
          {NAV_LINKS.map((link) => (
            <li
              key={link.label}
              className={`navbar__item ${link.mega ? 'navbar__item--has-mega' : ''}`}
              role="none"
            >
              {link.mega ? (
                <>
                  <div className="navbar__mega-trigger">
                    <button
                      className={`navbar__link navbar__link--mega ${
                        location.pathname === link.path ? 'navbar__link--active' : ''
                      }`}
                      onClick={() => go(link.path, link.label)}
                      role="menuitem"
                    >
                      {link.label}
                    </button>
                    <button
                      className={`navbar__chevron-btn ${activeMega === link.label ? 'navbar__chevron-btn--open' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveMega(activeMega === link.label ? null : link.label)
                      }}
                      aria-expanded={activeMega === link.label}
                      aria-haspopup="true"
                      aria-label={`Toggle ${link.label} submenu`}
                    >
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <AnimatePresence>
                    {activeMega === link.label && (
                      <motion.div
                        className="mega-menu"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        role="menu"
                      >
                        <div className="mega-menu__grid">
                          {link.children.map((child) => (
                            <button
                              key={child.path + child.label}
                              className="mega-menu__item"
                              role="menuitem"
                              onClick={() => go(child.path.split('#')[0], child.label)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                            >
                              <span className="mega-menu__item-label">{child.label}</span>
                              <span className="mega-menu__item-desc">{child.desc}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault()
                    go(link.path, link.label)
                  }}
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="navbar__cta"
          onClick={() => go('/admissions', 'Admissions')}
        >
          Apply Now
        </button>

        {/* Mobile Toggle */}
        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ul className="mobile-menu__links">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    className={`mobile-menu__link${location.pathname === link.path ? ' mobile-menu__link--active' : ''}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                    onClick={() => go(link.path, link.label)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  className="navbar__cta mobile-menu__cta"
                  style={{ border: 'none', cursor: 'pointer' }}
                  onClick={() => go('/admissions', 'Admissions')}
                >
                  Apply Now
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
