import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition, { childVariants } from '../../components/PageTransition/PageTransition'
import { API_URL } from '../../config'
import './Admissions.css'

const FEE_DATA = {
  'Pre-Primary': [
    { item: 'Admission Fee (One-time)', amount: '₹15,000' },
    { item: 'Tuition Fee (Annual)', amount: '₹48,000' },
    { item: 'Development Fund', amount: '₹8,000' },
    { item: 'Activity & Lab Charges', amount: '₹6,000' },
    { item: 'Transport (Optional)', amount: '₹12,000 – ₹18,000' },
  ],
  'Primary (I–V)': [
    { item: 'Admission Fee (One-time)', amount: '₹20,000' },
    { item: 'Tuition Fee (Annual)', amount: '₹60,000' },
    { item: 'Development Fund', amount: '₹10,000' },
    { item: 'Activity & Lab Charges', amount: '₹8,000' },
    { item: 'Transport (Optional)', amount: '₹12,000 – ₹18,000' },
  ],
  'Middle (VI–VIII)': [
    { item: 'Admission Fee (One-time)', amount: '₹25,000' },
    { item: 'Tuition Fee (Annual)', amount: '₹72,000' },
    { item: 'Development Fund', amount: '₹12,000' },
    { item: 'Science & Computer Lab', amount: '₹10,000' },
    { item: 'Transport (Optional)', amount: '₹14,000 – ₹20,000' },
  ],
  'Secondary (IX–XII)': [
    { item: 'Admission Fee (One-time)', amount: '₹30,000' },
    { item: 'Tuition Fee (Annual)', amount: '₹84,000' },
    { item: 'Development Fund', amount: '₹15,000' },
    { item: 'Lab & Project Charges', amount: '₹12,000' },
    { item: 'Transport (Optional)', amount: '₹14,000 – ₹20,000' },
  ],
}

const STEPS = [
  { id: 1, label: 'Student Info' },
  { id: 2, label: 'Parent / Guardian' },
  { id: 3, label: 'Academic Details' },
  { id: 4, label: 'Review & Submit' },
]

const INITIAL_FORM = {
  studentName: '',
  dob: '',
  gender: '',
  classApplying: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  address: '',
  previousSchool: '',
  percentage: '',
  specialNeeds: '',
  howHeard: '',
  message: '',
}

export default function Admissions() {
  const [activeFeeTab, setActiveFeeTab] = useState(Object.keys(FEE_DATA)[0])
  const [isAnnual, setIsAnnual] = useState(true)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  /* Scroll to section from hash */
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 600)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch {
      alert('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <PageTransition className="admissions-page">
      {/* Hero */}
      <section className="page-hero" aria-label="Admissions">
        <div className="container">
          <motion.p variants={childVariants} className="section-header__subtitle">
            Admissions 2026-27
          </motion.p>
          <motion.h1 variants={childVariants}>
            Your Child's <span className="text-gradient">Journey Starts Here</span>
          </motion.h1>
          <motion.div variants={childVariants} className="accent-bar" />
          <motion.p variants={childVariants} className="page-hero__desc">
            Transparent, straightforward, and welcoming — our admissions process is designed
            to make your family feel at home from day one.
          </motion.p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-header__subtitle">How It Works</p>
            <h2 id="process-title">Admission <span className="text-gradient">Process</span></h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          <div className="process-steps">
            {[
              { num: '01', title: 'Submit Enquiry', desc: 'Fill out the enquiry form below with student and parent details.' },
              { num: '02', title: 'Campus Visit', desc: 'Schedule a guided tour to experience our campus and meet our team.' },
              { num: '03', title: 'Assessment', desc: 'Students participate in a friendly interaction and aptitude assessment.' },
              { num: '04', title: 'Enrollment', desc: 'Complete the admission formalities and welcome your child to the Prayas family.' },
            ].map((s, i) => (
              <motion.div
                key={s.num}
                className="glass-card process-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className="process-step__num">{s.num}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="section section--dark" id="fees" aria-labelledby="fees-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-header__subtitle">Transparent Pricing</p>
            <h2 id="fees-title">Fee <span className="text-gradient">Structure</span></h2>
            <div className="accent-bar accent-bar--center" />
            <p className="section-header__desc">
              Clear, upfront fee details for all academic levels. No hidden charges.
            </p>
          </motion.div>

          <div className="fee-tabs" role="tablist" aria-label="Fee categories">
            {Object.keys(FEE_DATA).map(tab => (
              <button
                key={tab}
                className={`fee-tab ${activeFeeTab === tab ? 'fee-tab--active' : ''}`}
                onClick={() => setActiveFeeTab(tab)}
                role="tab"
                aria-selected={activeFeeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="fee-toggle-container">
            <span className={`fee-toggle-label ${!isAnnual ? 'fee-toggle-label--active' : ''}`}>Monthly</span>
            <button 
              className={`glass-toggle ${isAnnual ? 'glass-toggle--right' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual or monthly fees"
            >
              <motion.div 
                className="glass-toggle__thumb"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`fee-toggle-label ${isAnnual ? 'fee-toggle-label--active' : ''}`}>Annually<span className="discount-badge">Save 10%</span></span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeeTab}
              className="glass-card fee-table-wrapper"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              role="tabpanel"
            >
              <table className="fee-table" aria-label={`Fee structure for ${activeFeeTab}`}>
                <thead>
                  <tr>
                    <th>Fee Component</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {FEE_DATA[activeFeeTab].map(row => {
                    let displayItem = row.item;
                    let displayAmount = row.amount;

                    if (!isAnnual && row.item.includes('Tuition Fee')) {
                      displayItem = 'Tuition Fee (Monthly)';
                      const annualValue = parseInt(row.amount.replace(/\D/g, ''), 10);
                      const monthlyValue = Math.round(annualValue / 12);
                      displayAmount = `₹${monthlyValue.toLocaleString('en-IN')}`;
                    } else if (!isAnnual && !row.item.includes('One-time')) {
                        // Some optional items can be listed as monthly equivalent if desired
                    }

                    return (
                      <tr key={row.item}>
                        <td>{displayItem}</td>
                        <td className="fee-amount">{displayAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="fee-actions">
                <button className="btn btn--outline" onClick={() => alert('PDF download will be configured with your assets.')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </button>
                <p className="fee-note">
                  * Fees are subject to annual revision. Transport charges vary by route distance.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section" id="enquiry" aria-labelledby="enquiry-title">
        <div className="container container--narrow">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-header__subtitle">Start Your Application</p>
            <h2 id="enquiry-title">Admission <span className="text-gradient">Enquiry</span></h2>
            <div className="accent-bar accent-bar--center" />
          </motion.div>

          {submitted ? (
            <motion.div
              className="glass-card enquiry-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="enquiry-success__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3>Enquiry Submitted Successfully!</h3>
              <p>Thank you for your interest in Prayas Public School. Our admissions team will contact you within 24-48 hours.</p>
              <button className="btn btn--primary" onClick={() => { setSubmitted(false); setFormData(INITIAL_FORM); setStep(1) }}>
                Submit Another Enquiry
              </button>
            </motion.div>
          ) : (
            <div className="glass-card enquiry-form-wrapper">
              {/* Step Progress */}
              <div className="enquiry-progress" aria-label="Form progress">
                {STEPS.map(s => (
                  <div
                    key={s.id}
                    className={`enquiry-progress__step ${
                      step === s.id ? 'enquiry-progress__step--active' : ''
                    } ${step > s.id ? 'enquiry-progress__step--done' : ''}`}
                  >
                    <div className="enquiry-progress__num">
                      {step > s.id ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : s.id}
                    </div>
                    <span className="enquiry-progress__label">{s.label}</span>
                  </div>
                ))}
              </div>

              <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
                <AnimatePresence mode="wait">
                  {/* Step 1: Student Info */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      className="enquiry-step"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="form-group">
                        <label htmlFor="studentName">Student's Full Name *</label>
                        <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter student's full name" required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="dob">Date of Birth *</label>
                          <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="gender">Gender *</label>
                          <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="classApplying">Class Applying For *</label>
                        <select id="classApplying" name="classApplying" value={formData.classApplying} onChange={handleChange} required>
                          <option value="">Select Class</option>
                          <option value="nursery">Nursery</option>
                          <option value="lkg">LKG</option>
                          <option value="ukg">UKG</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={`class-${i + 1}`}>Class {i + 1}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Parent Info */}
                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      className="enquiry-step"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="form-group">
                        <label htmlFor="parentName">Parent / Guardian Name *</label>
                        <input type="text" id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Enter parent's full name" required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="parentEmail">Email Address *</label>
                          <input type="email" id="parentEmail" name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="your@email.com" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="parentPhone">Phone Number *</label>
                          <input type="tel" id="parentPhone" name="parentPhone" value={formData.parentPhone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="address">Residential Address</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your residential address" rows={3} />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Academic */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      className="enquiry-step"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="form-group">
                        <label htmlFor="previousSchool">Previous School Name</label>
                        <input type="text" id="previousSchool" name="previousSchool" value={formData.previousSchool} onChange={handleChange} placeholder="Enter previous school name" />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="percentage">Last Exam Percentage / Grade</label>
                          <input type="text" id="percentage" name="percentage" value={formData.percentage} onChange={handleChange} placeholder="e.g. 92% or A+" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="howHeard">How did you hear about us?</label>
                          <select id="howHeard" name="howHeard" value={formData.howHeard} onChange={handleChange}>
                            <option value="">Select Option</option>
                            <option value="word-of-mouth">Word of Mouth</option>
                            <option value="social-media">Social Media</option>
                            <option value="newspaper">Newspaper</option>
                            <option value="website">Website</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="specialNeeds">Special Requirements (if any)</label>
                        <textarea id="specialNeeds" name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} placeholder="Mention any learning needs, medical conditions, or special requirements" rows={3} />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <motion.div
                      key="step-4"
                      className="enquiry-step"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="review-title">Review Your Information</h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-label">Student Name</span>
                          <span className="review-value">{formData.studentName || '—'}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Date of Birth</span>
                          <span className="review-value">{formData.dob || '—'}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Class Applying</span>
                          <span className="review-value">{formData.classApplying || '—'}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Parent Name</span>
                          <span className="review-value">{formData.parentName || '—'}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Email</span>
                          <span className="review-value">{formData.parentEmail || '—'}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Phone</span>
                          <span className="review-value">{formData.parentPhone || '—'}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Previous School</span>
                          <span className="review-value">{formData.previousSchool || '—'}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-label">Last Grade</span>
                          <span className="review-value">{formData.percentage || '—'}</span>
                        </div>
                      </div>
                      {formData.message && (
                        <div className="review-item review-item--full">
                          <span className="review-label">Message</span>
                          <span className="review-value">{formData.message}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="enquiry-nav">
                  {step > 1 && (
                    <button type="button" className="btn btn--ghost" onClick={prevStep}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                      Previous
                    </button>
                  )}
                  <div style={{ flex: 1 }} />
                  {step < STEPS.length ? (
                    <button type="button" className="btn btn--primary" onClick={nextStep}>
                      Next Step
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  ) : (
                    <button type="submit" className="btn btn--primary" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Enquiry'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
