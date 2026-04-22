const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const Admission = require('../models/Admission')

/* POST /api/enquiry — Submit admission enquiry */
router.post('/', async (req, res) => {
  try {
    const {
      studentName, dob, gender, classApplying,
      parentName, parentEmail, parentPhone, address,
      previousSchool, percentage, specialNeeds, howHeard, message,
    } = req.body

    /* Validation */
    if (!studentName || !parentName || !parentEmail || !parentPhone || !classApplying) {
      return res.status(400).json({ error: 'Required fields are missing.' })
    }

    const newAdmission = new Admission({
      studentName, dob, gender, classApplying,
      parentName, parentEmail, parentPhone, address,
      previousSchool, percentage, specialNeeds, howHeard, message,
    });

    const savedAdmission = await newAdmission.save();
    console.log(`📋 New Enquiry Saved in DB: ${studentName} → Class ${classApplying}`)

    /* Send notification email (if SMTP is configured) */
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com') {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        await transporter.sendMail({
          from: `"Prayas Admissions" <${process.env.SMTP_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `New Admission Enquiry: ${studentName}`,
          html: `
            <h2>New Admission Enquiry</h2>
            <table style="border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Student:</td><td style="padding: 8px;">${studentName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Class:</td><td style="padding: 8px;">${classApplying}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Parent:</td><td style="padding: 8px;">${parentName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${parentEmail}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${parentPhone}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Previous School:</td><td style="padding: 8px;">${previousSchool || 'N/A'}</td></tr>
            </table>
          `,
        })
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message)
      }
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully.',
      enquiryId: savedAdmission._id,
    })
  } catch (err) {
    console.error('Enquiry error:', err)
    res.status(500).json({ error: 'Failed to process enquiry.' })
  }
})

/* GET /api/enquiry — List all enquiries (admin use) */
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json({ count: admissions.length, data: admissions })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries.' })
  }
})

module.exports = router
