import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FacultyLeadership.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── PLACEHOLDER DATA ─────────────────────────────────────────── */
const MEMBERS = [
  {
    id: 'fl-1',
    name: 'Dr. Ananya Sharma',
    title: 'Principal',
    quote:
      '"Education is not the filling of a pail, but the lighting of a fire. At Prayas, we ignite curiosity and nurture every child\'s innate potential to become tomorrow\'s leaders."',
    img: 'https://picsum.photos/seed/principal1/480/560',
  },
  {
    id: 'fl-2',
    name: 'Mr. Rajiv Mehta',
    title: 'Chairperson, Board of Trustees',
    quote:
      '"Our vision has always been simple — provide world-class education rooted in Indian values. Every decision we make is in service of the children who walk through our gates."',
    img: 'https://picsum.photos/seed/trustee2/480/560',
  },
  {
    id: 'fl-3',
    name: 'Ms. Priya Nair',
    title: 'Vice Principal & Head of Academics',
    quote:
      '"A great school is built on the quiet dedication of its teachers. I am proud of our faculty who go beyond the syllabus to shape hearts and minds every single day."',
    img: 'https://picsum.photos/seed/vp3/480/560',
  },
  {
    id: 'fl-4',
    name: 'Prof. Suresh Iyer',
    title: 'Head of Science & Innovation',
    quote:
      '"We don\'t just teach science — we teach students how to question, hypothesize, and discover. The lab is where textbook theories come alive and confidence is built."',
    img: 'https://picsum.photos/seed/science4/480/560',
  },
  {
    id: 'fl-5',
    name: 'Dr. Kavita Desai',
    title: 'Director of Student Welfare',
    quote:
      '"Every student carries a universe inside them. Our role is to create a safe, nurturing space where they feel seen, heard, and empowered to grow without fear."',
    img: 'https://picsum.photos/seed/welfare5/480/560',
  },
]

/* ─── Smoothstep helper ──────────────────────────────────────────── */
const ss = (e0, e1, x) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

/* ─── SVG clip-path liquid reveal — smooth compound-wave ────────── */
/*
 *  32 sample points on a 3-harmonic compound sine wave,
 *  converted to a smooth cubic-bezier spline via Catmull-Rom.
 *
 *  No discrete teardrops — just a continuously flowing liquid surface;
 *  smooth hills and valleys like mercury or thick honey dripping.
 *
 *  t = 0 → fully hidden  |  t = 1 → perfect flat rectangle
 */
function getDripPath(t) {
  if (t <= 0.003) return 'M 0 0 L 1 0 L 1 0 L 0 0 Z'
  if (t >= 0.993) return 'M 0 0 L 1 0 L 1 1 L 0 1 Z'

  // Smooth amplitude envelope
  const env = ss(0, 0.20, t) * ss(1.0, 0.84, t)
  const AMP = 0.22 * env   // up to 22% of card height

  // ── Sample 32 points — 3-harmonic compound sine ───────────────────
  // Low freq = big slow swells | mid = secondary bumps | high = fine texture
  const N   = 32
  const pts = []
  for (let i = 0; i <= N; i++) {
    const x = i / N
    const y = t
      + AMP * 0.60 * Math.sin(x * Math.PI * 3.2 + 0.40)   // 1.6 cycles
      + AMP * 0.30 * Math.sin(x * Math.PI * 7.5 + 1.85)   // 3.75 cycles
      + AMP * 0.12 * Math.sin(x * Math.PI * 14.3 + 3.10)  // 7.15 cycles
    pts.push([x, Math.max(0, y)])
  }

  // ── Right-to-left traversal for the closing bottom edge ──────────
  const rev = pts.slice().reverse()

  // ── Catmull-Rom → cubic bezier: CP1 = P1+(P2-P0)/6, CP2 = P2-(P3-P1)/6 ─
  let d = `M 0 0 L 1 0 L 1 ${rev[0][1].toFixed(4)}`
  for (let i = 0; i < rev.length - 1; i++) {
    const p0 = rev[Math.max(0, i - 1)]
    const p1 = rev[i]
    const p2 = rev[i + 1]
    const p3 = rev[Math.min(rev.length - 1, i + 2)]

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6

    d += ` C ${cp1x.toFixed(4)} ${cp1y.toFixed(4)}`
       + ` ${cp2x.toFixed(4)} ${cp2y.toFixed(4)}`
       + ` ${p2[0].toFixed(4)} ${p2[1].toFixed(4)}`
  }

  d += ' Z'
  return d
}

/* ─── Single member row ─────────────────────────────────────────── */
function MemberRow({ member, index }) {
  const rowRef   = useRef(null)
  const imgRef   = useRef(null)
  const pathRef  = useRef(null)
  const badgeRef = useRef(null)
  const clipId   = `fl-clip-${member.id}`
  const even     = index % 2 === 0

  useEffect(() => {
    const row   = rowRef.current
    const img   = imgRef.current
    const path  = pathRef.current
    const badge = badgeRef.current
    if (!row || !img || !path || !badge) return

    // ── Initial states ────────────────────────────────────────────
    path.setAttribute('d', getDripPath(0))
    gsap.set(img,   { scale: 1.0 })
    gsap.set(badge, { opacity: 0 })
    gsap.set(row.querySelector('.fl-text'), { opacity: 0, x: even ? -36 : 36 })

    const proxy = { t: 0 }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 80%',
        end:   'top 18%',
        scrub: 1.2,        // deliberate lag — weighty, cinematic
      },
    })

    // ── Clip reveal + image scale: full timeline ──────────────────
    tl.to(proxy, {
      t: 1,
      ease: 'none',
      onUpdate() {
        const p = proxy.t
        // Update drip shape
        path.setAttribute('d', getDripPath(p))
        // Cinematic zoom: 1.00 → 1.05
        img.style.transform = `scale(${(1 + 0.05 * p).toFixed(4)})`
        // Fade badge in once image is 65% revealed
        badge.style.opacity = Math.max(0, (p - 0.65) / 0.2).toFixed(4)
      },
    })

    // ── Text side slides in from 25% through ─────────────────────
    tl.to(
      row.querySelector('.fl-text'),
      { opacity: 1, x: 0, ease: 'power3.out' },
      0.25,
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <article
      ref={rowRef}
      className={`fl-row ${even ? 'fl-row--even' : 'fl-row--odd'}`}
      aria-label={`${member.name}, ${member.title}`}
    >
      {/* ── Text side ────────────────────────────────────────── */}
      <div className="fl-text">
        <span className="fl-index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="fl-name">{member.name}</h2>
        <p  className="fl-title">{member.title}</p>
        <div className="fl-divider" aria-hidden="true" />
        <blockquote className="fl-quote">{member.quote}</blockquote>
      </div>

      {/* ── Image wrapper — clip-path sits here ───────────────── */}
      {/*
        IMPORTANT: The SVG clipPath is applied directly to .fl-card
        so the box-shadow, border, background are ALL clipped with it
        — no white placeholder box ever shows.
        The badge lives in .fl-card-wrap (outside clip) so it's
        always painted over the card at its natural position.
      */}
      <div className="fl-card-wrap">

        {/* Hidden SVG: defines the clip, no layout impact */}
        <svg
          width="0" height="0"
          style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path ref={pathRef} d="M 0 0 L 1 0 L 1 0 L 0 0 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Card — receives clip-path; shadow + border fully hidden when clipped */}
        <div
          className="fl-card"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <img
            ref={imgRef}
            src={member.img}
            alt={member.name}
            className="fl-card__img"
            crossOrigin="anonymous"
            draggable={false}
          />
        </div>

        {/* Badge is OUTSIDE the clip — never hidden, GSAP controls opacity */}
        <div ref={badgeRef} className="fl-card__badge" aria-hidden="true">
          <span>{member.name}</span>
        </div>

      </div>
    </article>
  )
}

/* ─── Section wrapper ───────────────────────────────────────────── */
export default function FacultyLeadership() {
  return (
    <section className="fl-section" aria-label="Faculty and Leadership">

      {/* Subtle hexagon grid */}
      <svg className="fl-hex-pattern" aria-hidden="true">
        <defs>
          <pattern id="fl-hexPat" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon
              points="28,2 52,14 52,38 28,50 4,38 4,14"
              fill="none"
              stroke="rgba(15,23,42,0.035)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fl-hexPat)" />
      </svg>

      {/* Section header */}
      <header className="fl-header container">
        <p className="fl-header__label">The People Behind Prayas</p>
        <h1 className="fl-header__title">
          Faculty &amp; <span className="fl-accent">Leadership</span>
        </h1>
        <div className="fl-header__rule" aria-hidden="true" />
        <p className="fl-header__sub">
          Passionate educators and visionary leaders who make Prayas exceptional.
        </p>
      </header>

      {/* Member rows */}
      <div className="fl-rows container">
        {MEMBERS.map((m, i) => (
          <MemberRow key={m.id} member={m} index={i} />
        ))}
      </div>

    </section>
  )
}
