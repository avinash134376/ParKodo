const express = require('express');
const auth = require('../middleware/auth'); // Import authentication middleware
const Booking = require('../models/Booking'); // Import the Booking model to get booking details

module.exports = function(stripe) { // Export a function that accepts the stripe instance
  const router = express.Router();

  // @route   POST /api/payment/create-payment-intent
  // @desc    Create a Stripe Payment Intent
  // @access  Private (User)
  router.post('/create-payment-intent', auth, async (req, res) => { // Apply auth middleware
    const { bookingId } = req.body; // Assuming bookingId is sent from frontend

    try {
      // Find the booking to get the amount and currency
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ msg: 'Booking not found' });
      }

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalCost * 100), // Stripe requires amount in cents
        currency: 'usd', // Or the currency of your application
        metadata: { bookingId: booking._id.toString(), userId: req.user.id }, // Optional metadata
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error.message);
      res.status(500).send('Server Error');
    }
  });

  return router; // Return the configured router
};
