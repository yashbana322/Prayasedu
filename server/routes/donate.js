const express = require('express')
const router = express.Router()
const Donation = require('../models/Donation')

/* POST /api/donate — Process donation */
router.post('/', async (req, res) => {
  try {
    const { amount, name, email, phone, pan, message } = req.body

    if (!amount || !name || !email) {
      return res.status(400).json({ error: 'Amount, name, and email are required.' })
    }

    if (amount < 100) {
      return res.status(400).json({ error: 'Minimum donation amount is ₹100.' })
    }

    const newDonation = new Donation({
      name, email, phone, pan, message,
      amount: Number(amount)
    });

    const savedDonation = await newDonation.save();
    console.log(`💰 New Donation Saved in DB: ₹${amount} from ${name}`)

    res.status(201).json({
      success: true,
      message: 'Donation recorded. Payment gateway integration pending.',
      donationId: savedDonation._id,
      /*
        In production, return:
        orderId: razorpayOrder.id,
        amount: donation.amount,
        key: process.env.RAZORPAY_KEY_ID,
      */
    })
  } catch (err) {
    console.error('Donation error:', err)
    res.status(500).json({ error: 'Failed to process donation.' })
  }
})

/* GET /api/donate — List donations (admin) */
router.get('/', async (req, res) => {
  try {
    const allDonations = await Donation.find().sort({ createdAt: -1 });
    res.json({ count: allDonations.length, data: allDonations })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations.' })
  }
})

module.exports = router
