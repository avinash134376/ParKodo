
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['car', 'motorbike'],
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  make: String,
  model: String,
  color: String,
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
