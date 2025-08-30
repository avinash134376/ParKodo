const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  features: {
    surveillance: {
      type: Boolean,
      default: false
    },
    evCharging: {
      type: Boolean,
      default: false
    },
    covered: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
