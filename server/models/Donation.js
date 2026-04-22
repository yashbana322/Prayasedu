const { Schema, model } = require('mongoose');

const donationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  phone: { type: String },
  pan: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending_payment', 'completed', 'failed'], default: 'pending_payment' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Donation', donationSchema);
