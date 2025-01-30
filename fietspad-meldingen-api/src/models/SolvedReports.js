
// models/LocationImage.js
const mongoose = require('mongoose');

const SolvedReportsSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  option:{type: String, required: true},
  image: {
    filename: { type: String, required: true },
    path: { type: String, required: true },
  },
  solvedAt: { type: Date, default: Date.now },
});

const SolvedReports = mongoose.model('SolvedReports', SolvedReportsSchema);

module.exports = SolvedReports;
