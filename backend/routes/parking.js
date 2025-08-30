
const express = require('express');
const router = express.Router();
const ParkingLot = require('../models/ParkingLot');

// @route   GET /api/parking
// @desc    Get all parking lots
// @access  Public
router.get('/', async (req, res) => {
  try {
    const parkingLots = await ParkingLot.find();
    res.json(parkingLots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/parking/near
// @desc    Get parking lots near a given location
// @access  Public
router.get('/near', async (req, res) => {
  const { longitude, latitude } = req.query;

  if (!longitude || !latitude) {
    return res.status(400).json({ msg: 'Please provide longitude and latitude' });
  }

  try {
    const parkingLots = await ParkingLot.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 2000, // 2km
        },
      },
    });
    res.json(parkingLots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/parking/:id
// @desc    Get a parking lot by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const parkingLot = await ParkingLot.findById(req.params.id);

    if (!parkingLot) {
      return res.status(404).json({ msg: 'Parking lot not found' });
    }

    res.json(parkingLot);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Parking lot not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
