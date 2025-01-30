
// models/LocationImage.js
const mongoose = require('mongoose');

const ReportsSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  option:{type: String, required: true},
  image: {
    filename: { type: String, required: true },
    path: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['unsolved', 'solved'], default: 'unsolved' },
});

const Reports = mongoose.model('Reports', ReportsSchema);

module.exports = Reports;
