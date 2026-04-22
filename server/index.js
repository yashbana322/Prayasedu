const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const enquiryRouter = require('./routes/enquiry')
const contactRouter = require('./routes/contact')
const donateRouter = require('./routes/donate')

const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 5000

/* ---- Database Connection ---- */
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prayas')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

/* ---- Security Middleware ---- */
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}))

/* ---- Rate Limiting ---- */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', apiLimiter)

/* ---- Body Parsing ---- */
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

/* ---- Health Check ---- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/* ---- Routes ---- */
app.use('/api/enquiry', enquiryRouter)
app.use('/api/contact', contactRouter)
app.use('/api', contactRouter) /* mounts /api/book-tour from contact router */
app.use('/api/donate', donateRouter)

/* ---- 404 Handler ---- */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

/* ---- Global Error Handler ---- */
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

/* ---- Start Server ---- */
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🏫 Prayas Server running on port ${PORT}`)
    console.log(`   Health: http://localhost:${PORT}/api/health\n`)
  })
}

module.exports = app;
