
const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

// @route   POST /api/vehicles
// @desc    Add a new vehicle
// @access  Private
router.post('/', auth, async (req, res) => {
  const { type, licensePlate, make, model, color } = req.body;

  try {
    const newVehicle = new Vehicle({
      user: req.user.id,
      type,
      licensePlate,
      make,
      model,
      color,
    });

    const vehicle = await newVehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/vehicles
// @desc    Get all vehicles for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user.id });
    res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/vehicles/:id
// @desc    Delete a vehicle
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    // Check if the user owns the vehicle
    if (vehicle.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await vehicle.remove();

    res.json({ msg: 'Vehicle removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
