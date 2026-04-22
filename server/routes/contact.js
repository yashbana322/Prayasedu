const express = require('express')
const router = express.Router()

const messages = []
const tourBookings = []

/* POST /api/contact — Submit contact form */
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Required fields are missing.' })
    }

    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name, email, phone, subject, message,
      submittedAt: new Date().toISOString(),
    }

    messages.push(entry)
    console.log(`💬 New Contact: ${name} — ${subject}`)

    res.status(201).json({ success: true, message: 'Message sent successfully.' })
  } catch (err) {
    console.error('Contact error:', err)
    res.status(500).json({ error: 'Failed to process message.' })
  }
})

/* POST /api/book-tour — Book a campus tour */
router.post('/book-tour', (req, res) => {
  try {
    const { parentName, email, phone, preferredDate, childAge, message } = req.body

    if (!parentName || !email || !phone || !preferredDate) {
      return res.status(400).json({ error: 'Required fields are missing.' })
    }

    const booking = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      parentName, email, phone, preferredDate, childAge, message,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    }

    tourBookings.push(booking)
    console.log(`🗓️ New Tour Booking: ${parentName} — ${preferredDate}`)

    res.status(201).json({ success: true, message: 'Tour booking submitted.' })
  } catch (err) {
    console.error('Tour booking error:', err)
    res.status(500).json({ error: 'Failed to process booking.' })
  }
})

module.exports = router
