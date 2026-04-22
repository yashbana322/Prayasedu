import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition, { childVariants } from '../../components/PageTransition/PageTransition'
import './Donate.css'

const IMPACT_STORIES = [
  {
    title: 'Scholarship for 50 Underprivileged Students',
    desc: 'Your contributions enabled 50 deserving students from low-income families to access quality education at Prayas, changing their lives forever.',
    metric: '50 Students',
    year: '2024',
  },
  {
    title: 'New STEM Lab Infrastructure',
    desc: 'Donor funding helped us build a cutting-edge STEM and Robotics lab, enabling hands-on learning in AI, coding, and engineering.',
    metric: '₹25L Raised',
    year: '2023',
  },
  {
    title: 'Sports Complex Upgrade',
    desc: 'Community generosity transformed our sports facilities with a synthetic track, indoor gymnasium, and professional coaching equipment.',
    metric: '3 New Facilities',
    year: '2022',
  },
]

const DONATION_TIERS = [
  { amount: 5000, label: '₹5,000', impact: 'Sponsors one student\'s books and uniform for a year' },
  { amount: 10000, label: '₹10,000', impact: 'Funds a full semester scholarship for one student' },
  { amount: 25000, label: '₹25,000', impact: 'Equips a classroom with modern learning tools' },
  { amount: 50000, label: '₹50,000', impact: 'Supports the annual science & innovation fair' },
]

export default function Donate() {
  const [selectedTier, setSelectedTier] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '', pan: '', message: '' })

  const handleDonorChange = (e) => {
    setDonorInfo({ ...donorInfo, [e.target.name]: e.target.value })
  }

  const handleDonate = (e) => {
    e.preventDefault()
    const amount = selectedTier ?? Number(customAmount)
    if (!amount || amount < 100) {
      alert('Please select or enter a valid donation amount.')
      return
    }
    // Payment gateway integration placeholder
    alert(`Thank you! Payment gateway integration for ₹${amount.toLocaleString()} will be connected here. Your generosity transforms lives.`)
  }

  return (
    <PageTransition className="donate-page">
      {/* Hero */}
      <section className="page-hero" aria-label="Philanthropy">
        <div className="container">
          <motion.p variants={childVariants} className="section-header__subtitle">
            Philanthropy
          </motion.p>
          <motion.h1 variants={childVariants}>
            Invest in <span className="text-gradient">Tomorrow's Leaders</span>
          </motion.h1>
          <motion.div variants={childVariants} className="accent-bar" />
          <motion.p variants={childVariants} className="page-hero__desc">
            Every contribution to Prayas Public School creates ripples of change —
            opening doors for deserving students and building a brighter future for all.
          </motion.p>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="section" aria-labelledby="impact-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-header__subtitle">Your Impact</p>
            <h2 id="impact-title">Stories of <span className="text-gradient">Transformation</span></h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          <div className="impact-grid">
            {IMPACT_STORIES.map((story, i) => (
              <motion.article
                key={story.title}
                className="glass-card impact-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="impact-card__header">
                  <span className="impact-card__metric">{story.metric}</span>
                  <span className="impact-card__year">{story.year}</span>
                </div>
                <h3 className="impact-card__title">{story.title}</h3>
                <p className="impact-card__desc">{story.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="section section--dark" aria-labelledby="trust-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-header__subtitle">Trust & Integrity</p>
            <h2 id="trust-title">Your <span className="text-gradient">Trust</span>, Our Responsibility</h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          <div className="trust-grid">
            {[
              { icon: '🔒', title: 'SSL Encrypted', desc: 'All transactions are secured with 256-bit SSL encryption.' },
              { icon: '📋', title: '80G Tax Benefit', desc: 'All donations are eligible for 80G tax exemption under Income Tax Act.' },
              { icon: '📊', title: 'Annual Reports', desc: 'Published annual impact reports showing exactly how funds are utilized.' },
              { icon: '✅', title: 'Registered Trust', desc: 'Prayas is a registered educational trust, fully compliant with all regulations.' },
            ].map((t, i) => (
              <motion.div
                key={t.title}
                className="glass-card trust-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className="trust-card__icon">{t.icon}</span>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="section" aria-labelledby="donate-form-title">
        <div className="container container--narrow">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-header__subtitle">Make a Difference</p>
            <h2 id="donate-form-title">Choose Your <span className="text-gradient">Contribution</span></h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          <div className="glass-card donate-form-wrapper">
            {/* Donation Tiers */}
            <div className="donate-tiers">
              {DONATION_TIERS.map(tier => (
                <button
                  key={tier.amount}
                  className={`donate-tier ${selectedTier === tier.amount ? 'donate-tier--active' : ''}`}
                  onClick={() => { setSelectedTier(tier.amount); setCustomAmount('') }}
                >
                  <span className="donate-tier__amount">{tier.label}</span>
                  <span className="donate-tier__impact">{tier.impact}</span>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="donate-custom">
              <label htmlFor="customAmount">Or enter a custom amount</label>
              <div className="donate-custom__input">
                <span className="donate-custom__prefix">₹</span>
                <input
                  type="number"
                  id="customAmount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(null) }}
                  placeholder="Enter amount"
                  min="100"
                />
              </div>
            </div>

            <hr className="donate-divider" />

            {/* Donor Information */}
            <form className="donate-form" onSubmit={handleDonate}>
              <h3 className="donate-form__title">Donor Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="donorName">Full Name *</label>
                  <input type="text" id="donorName" name="name" value={donorInfo.name} onChange={handleDonorChange} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="donorEmail">Email *</label>
                  <input type="email" id="donorEmail" name="email" value={donorInfo.email} onChange={handleDonorChange} placeholder="your@email.com" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="donorPhone">Phone</label>
                  <input type="tel" id="donorPhone" name="phone" value={donorInfo.phone} onChange={handleDonorChange} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label htmlFor="donorPan">PAN Number (for 80G)</label>
                  <input type="text" id="donorPan" name="pan" value={donorInfo.pan} onChange={handleDonorChange} placeholder="ABCDE1234F" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="donorMessage">Message (optional)</label>
                <textarea id="donorMessage" name="message" value={donorInfo.message} onChange={handleDonorChange} placeholder="Share a message or dedicate your donation" rows={3} />
              </div>

              <button type="submit" className="btn btn--primary btn--lg donate-submit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Donate {selectedTier ? `₹${selectedTier.toLocaleString()}` : customAmount ? `₹${Number(customAmount).toLocaleString()}` : 'Now'}
              </button>

              <p className="donate-secure-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secured with 256-bit SSL encryption. Your data is safe.
              </p>
            </form>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
