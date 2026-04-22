import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition, { childVariants } from '../../components/PageTransition/PageTransition'
import { API_URL } from '../../config'
import './Contact.css'

export default function Contact() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [tourForm, setTourForm] = useState({ parentName: '', email: '', phone: '', preferredDate: '', childAge: '', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [tourSubmitted, setTourSubmitted] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 600)
    }
  }, [])

  const handleContactChange = (e) => setContactForm({ ...contactForm, [e.target.name]: e.target.value })
  const handleTourChange = (e) => setTourForm({ ...tourForm, [e.target.name]: e.target.value })

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      if (res.ok) setContactSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  const handleTourSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/book-tour`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourForm),
      })
      if (res.ok) setTourSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <PageTransition className="contact-page">
      {/* Hero */}
      <section className="page-hero" aria-label="Contact Us">
        <div className="container">
          <motion.p variants={childVariants} className="section-header__subtitle">
            Reach Out
          </motion.p>
          <motion.h1 variants={childVariants}>
            We'd Love to <span className="text-gradient">Hear From You</span>
          </motion.h1>
          <motion.div variants={childVariants} className="accent-bar" />
          <motion.p variants={childVariants} className="page-hero__desc">
            Whether you have questions, need assistance, or want to visit our campus —
            our doors and hearts are always open.
          </motion.p>
        </div>
      </section>

      {/* Contact Information + Form */}
      <section className="section" aria-labelledby="contact-info-title">
        <div className="container">
          <div className="contact-layout">
            {/* Info Column */}
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 id="contact-info-title">Get in <span className="text-gradient">Touch</span></h2>
              <div className="accent-bar" />

              <div className="contact-info__cards">
                <article className="glass-card contact-info__card">
                  <div className="contact-info__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <h4>Campus Address</h4>
                    <p>Prayas Public School<br />Your Address Line 1<br />City, State — PIN Code</p>
                  </div>
                </article>

                <article className="glass-card contact-info__card">
                  <div className="contact-info__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <h4>Phone</h4>
                    <p>+91 XXXXX XXXXX<br />+91 XXXXX XXXXX</p>
                  </div>
                </article>

                <article className="glass-card contact-info__card">
                  <div className="contact-info__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>info@prayasedu.org<br />admissions@prayasedu.org</p>
                  </div>
                </article>

                <article className="glass-card contact-info__card">
                  <div className="contact-info__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <h4>Office Hours</h4>
                    <p>Monday – Saturday<br />8:00 AM – 4:00 PM</p>
                  </div>
                </article>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {contactSubmitted ? (
                <div className="glass-card contact-success">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll respond within 24 hours.</p>
                  <button className="btn btn--outline" onClick={() => { setContactSubmitted(false); setContactForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="glass-card contact-form" onSubmit={handleContactSubmit} noValidate>
                  <h3 className="contact-form__title">Send Us a Message</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contactName">Your Name *</label>
                      <input type="text" id="contactName" name="name" value={contactForm.name} onChange={handleContactChange} placeholder="Full name" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contactEmail">Email *</label>
                      <input type="email" id="contactEmail" name="email" value={contactForm.email} onChange={handleContactChange} placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contactPhone">Phone</label>
                      <input type="tel" id="contactPhone" name="phone" value={contactForm.phone} onChange={handleContactChange} placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contactSubject">Subject *</label>
                      <select id="contactSubject" name="subject" value={contactForm.subject} onChange={handleContactChange} required>
                        <option value="">Select Subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="admissions">Admissions</option>
                        <option value="academics">Academics</option>
                        <option value="transport">Transport</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactMessage">Message *</label>
                    <textarea id="contactMessage" name="message" value={contactForm.message} onChange={handleContactChange} placeholder="How can we help you?" rows={5} required />
                  </div>
                  <button type="submit" className="btn btn--primary btn--lg contact-form__submit">
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section section--dark" aria-labelledby="map-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-header__subtitle">Find Us</p>
            <h2 id="map-title">Our <span className="text-gradient">Campus Location</span></h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          <motion.div
            className="map-wrapper"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Replace the src with your actual Google Maps embed URL */}
            <iframe
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.0!2d75.8!3d26.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzAwLjAiTiA3NcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Prayas Public School Location"
            />
          </motion.div>
        </div>
      </section>

      {/* Book a Tour */}
      <section className="section" id="tour" aria-labelledby="tour-title">
        <div className="container container--narrow">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-header__subtitle">Experience Prayas</p>
            <h2 id="tour-title">Book a <span className="text-gradient">Campus Tour</span></h2>
            <div className="accent-bar accent-bar--center" />
            <p className="section-header__desc">
              Nothing beats seeing our campus in person. Schedule a visit and let us show you
              what makes Prayas special.
            </p>
          </motion.div>

          {tourSubmitted ? (
            <motion.div
              className="glass-card contact-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h3>Tour Booked!</h3>
              <p>We'll confirm your visit via email within 24 hours. We look forward to welcoming you!</p>
              <button className="btn btn--outline" onClick={() => { setTourSubmitted(false); setTourForm({ parentName: '', email: '', phone: '', preferredDate: '', childAge: '', message: '' }) }}>
                Book Another Tour
              </button>
            </motion.div>
          ) : (
            <motion.form
              className="glass-card tour-form"
              onSubmit={handleTourSubmit}
              noValidate
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tourParentName">Parent / Guardian Name *</label>
                  <input type="text" id="tourParentName" name="parentName" value={tourForm.parentName} onChange={handleTourChange} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="tourEmail">Email *</label>
                  <input type="email" id="tourEmail" name="email" value={tourForm.email} onChange={handleTourChange} placeholder="your@email.com" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tourPhone">Phone *</label>
                  <input type="tel" id="tourPhone" name="phone" value={tourForm.phone} onChange={handleTourChange} placeholder="+91 XXXXX XXXXX" required />
                </div>
                <div className="form-group">
                  <label htmlFor="tourDate">Preferred Date *</label>
                  <input type="date" id="tourDate" name="preferredDate" value={tourForm.preferredDate} onChange={handleTourChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tourChildAge">Child's Age / Class</label>
                  <input type="text" id="tourChildAge" name="childAge" value={tourForm.childAge} onChange={handleTourChange} placeholder="e.g. 6 years / Class 1" />
                </div>
                <div className="form-group">
                  <label htmlFor="tourMessage">Additional Notes</label>
                  <input type="text" id="tourMessage" name="message" value={tourForm.message} onChange={handleTourChange} placeholder="Any specific requests?" />
                </div>
              </div>
              <button type="submit" className="btn btn--primary btn--lg tour-form__submit">
                Schedule Visit
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
