
const mongoose = require('mongoose');

const ParkingSpotSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['regular', 'valet', 'covered', 'self-park'],
    required: true,
  },
  pricePerHourCar: {
    type: Number,
    required: true,
  },
  pricePerHourBike: {
    type: Number,
    required: true,
  },
  availableSpotsCar: {
    type: Number,
    default: 0,
  },
  availableSpotsMotorbike: {
    type: Number,
    default: 0,
  },
});

const ParkingLotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  features: {
    surveillance: { type: Boolean, default: false },
    evCharging: { type: Boolean, default: false },
    covered: { type: Boolean, default: false },
  },
  spotTypes: [ParkingSpotSchema],
});

ParkingLotSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ParkingLot', ParkingLotSchema);
