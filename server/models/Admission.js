const { Schema, model } = require('mongoose');

const admissionSchema = new Schema({
  studentName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  classApplying: { type: String, required: true },
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String, required: true },
  address: { type: String },
  previousSchool: { type: String },
  percentage: { type: String },
  specialNeeds: { type: String },
  howHeard: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new', 'pending', 'reviewed', 'accepted', 'rejected'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Admission', admissionSchema);
