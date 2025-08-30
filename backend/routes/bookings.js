
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ParkingLot = require('../models/ParkingLot');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  const { parkingLotId, vehicleId, startTime, endTime } = req.body;

  try {
    const user = req.user.id;

    // 1. Get the vehicle and parking lot details
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    const parkingLot = await ParkingLot.findById(parkingLotId);
    if (!parkingLot) {
      return res.status(404).json({ msg: 'Parking lot not found' });
    }

    // 2. Calculate total price
    const durationInHours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    let pricePerHour;
    if (vehicle.type === 'car') {
      pricePerHour = parkingLot.spotTypes.find(spot => spot.type === 'regular').pricePerHourCar;
    } else {
      pricePerHour = parkingLot.spotTypes.find(spot => spot.type === 'regular').pricePerHourBike;
    }
    const totalPrice = durationInHours * pricePerHour;

    // 3. Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      parkingLot: parkingLotId,
      status: { $in: ['upcoming', 'ongoing'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (overlappingBookings.length >= 10) { // simplified capacity check
      return res.status(400).json({ msg: 'Parking lot is fully booked for the selected time' });
    }

    // 4. Create and save the new booking
    const newBooking = new Booking({
      user,
      parkingLot: parkingLotId,
      vehicle: vehicleId,
      startTime,
      endTime,
      totalPrice,
      status: 'upcoming',
    });

    const booking = await newBooking.save();

    res.status(201).json(booking);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookings/user
// @desc    Get all bookings for the authenticated user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('parkingLot')
      .populate('vehicle');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookings/user/:status
// @desc    Get user bookings by status
// @access  Private
router.get('/user/:status', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, status: req.params.status })
      .populate('parkingLot')
      .populate('vehicle');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (booking.status !== 'upcoming') {
      return res.status(400).json({ msg: 'Only upcoming bookings can be cancelled' });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'cancelled' } },
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
