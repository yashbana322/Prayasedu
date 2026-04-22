import { motion } from 'framer-motion'
import PageTransition, { childVariants } from '../../components/PageTransition/PageTransition'
import './About.css'

const TIMELINE = [
  { year: '1998', title: 'The Founding', desc: 'Prayas Public School was established with a vision to create an institution that combines academic rigor with holistic development.' },
  { year: '2004', title: 'CBSE Affiliation', desc: 'Received full CBSE affiliation, marking a major milestone in our commitment to nationally recognized education standards.' },
  { year: '2010', title: 'Campus Expansion', desc: 'Inaugurated our expanded campus with state-of-the-art science labs, sports complex, and performing arts centre.' },
  { year: '2016', title: 'Digital Transformation', desc: 'Introduced smart classrooms, 1:1 device programs, and integrated AI-assisted learning platforms.' },
  { year: '2022', title: 'Excellence Award', desc: 'Recognized as one of the top CBSE schools for academic excellence and innovative teaching methodologies.' },
  { year: '2025', title: 'Global Partnerships', desc: 'Launched international exchange programs and collaborative STEM initiatives with partner schools worldwide.' },
]

const VALUES = [
  { icon: '🎯', title: 'Excellence', desc: 'We pursue the highest standards in teaching, learning, and personal development.' },
  { icon: '💡', title: 'Innovation', desc: 'Embracing new ideas, technologies, and pedagogies to keep education relevant and exciting.' },
  { icon: '🤝', title: 'Integrity', desc: 'Building trust through honesty, fairness, and ethical conduct in every interaction.' },
  { icon: '🌱', title: 'Growth', desc: 'Fostering continuous improvement and a love for lifelong learning.' },
  { icon: '🌍', title: 'Inclusivity', desc: 'Celebrating diversity and ensuring every student feels valued, heard, and supported.' },
  { icon: '❤️', title: 'Compassion', desc: 'Leading with empathy and kindness, creating a warm and nurturing environment.' },
]

export default function About() {
  return (
    <PageTransition className="about-page">
      {/* ===== PAGE HERO ===== */}
      <section className="page-hero" aria-label="About Prayas Public School">
        <div className="container">
          <motion.p variants={childVariants} className="section-header__subtitle">
            Our Story
          </motion.p>
          <motion.h1 variants={childVariants}>
            A Legacy of <span className="text-gradient">Transforming Lives</span>
          </motion.h1>
          <motion.div variants={childVariants} className="accent-bar" />
          <motion.p variants={childVariants} className="page-hero__desc">
            For over two decades, Prayas Public School has been a beacon of educational excellence —
            shaping young minds, building strong character, and creating future leaders who make a difference.
          </motion.p>
        </div>
      </section>

      {/* ===== VISION & MISSION ===== */}
      <section className="section" aria-labelledby="vision-title">
        <div className="container">
          <div className="vision-grid">
            <motion.article
              className="glass-card vision-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="vision-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3>Our Vision</h3>
              <p>
                To be a world-class educational institution that nurtures ethical, innovative, and
                compassionate global citizens who lead with purpose and transform the world around them.
              </p>
            </motion.article>

            <motion.article
              className="glass-card vision-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="vision-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide a stimulating, inclusive, and safe learning environment that
                fosters academic excellence, critical thinking, creativity, and strong
                moral values — empowering each student to achieve their fullest potential.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="section section--dark" aria-labelledby="timeline-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-header__subtitle">Our Journey</p>
            <h2 id="timeline-title" className="section-header__title">
              Milestones That <span className="text-gradient">Define Us</span>
            </h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          <div className="timeline">
            <div className="timeline__line" aria-hidden="true" />
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                className={`timeline__item ${i % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="timeline__dot" aria-hidden="true" />
                <article className="glass-card timeline__card">
                  <span className="timeline__year">{item.year}</span>
                  <h3 className="timeline__title">{item.title}</h3>
                  <p className="timeline__desc">{item.desc}</p>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="section" id="values" aria-labelledby="values-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-header__subtitle">Our Guiding Principles</p>
            <h2 id="values-title" className="section-header__title">
              Core <span className="text-gradient">Values</span>
            </h2>
            <div className="accent-bar accent-bar--center" />
            <p className="section-header__desc">
              These six pillars form the moral compass of every decision, every classroom,
              and every interaction at Prayas.
            </p>
          </motion.div>

          <div className="values-grid">
            {VALUES.map((v, i) => (
              <motion.article
                key={v.title}
                className="glass-card values-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className="values-card__icon" aria-hidden="true">{v.icon}</span>
                <h4 className="values-card__title">{v.title}</h4>
                <p className="values-card__desc">{v.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS ===== */}
      <section className="section section--dark" id="achievements" aria-labelledby="achievements-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-header__subtitle">Recognition</p>
            <h2 id="achievements-title" className="section-header__title">
              Awards & <span className="text-gradient">Achievements</span>
            </h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          <div className="achievements-grid">
            {[
              { title: 'Best CBSE School Award', year: '2022', org: 'National Education Council' },
              { title: 'Green Campus Certification', year: '2021', org: 'Environmental Board of India' },
              { title: 'Innovation in Education', year: '2023', org: 'EdTech Summit India' },
              { title: 'Sports Excellence Trophy', year: '2024', org: 'State Athletic Association' },
            ].map((a, i) => (
              <motion.article
                key={a.title}
                className="glass-card achievement-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="achievement-card__trophy" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.24 7 20v1h10v-1c0-.76-.85-1.25-2.03-1.79C14.47 17.98 14 17.55 14 17v-2.34"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </div>
                <h4>{a.title}</h4>
                <p className="achievement-card__year">{a.year}</p>
                <p className="achievement-card__org">{a.org}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
