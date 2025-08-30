const express = require('express');
const router = express.Router();

// Export a function that accepts the stripe instance
module.exports = (stripe) => {

  // @route   POST /api/payment/webhook
  // @desc    Handle Stripe webhook events
  // @access  Public (Stripe will send requests here)
  router.post('/webhook', express.raw({
    type: 'application/json'
  }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // Verify webhook signature and parse the event
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET // You'll need to get this from Stripe and add it to your .env
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful:', paymentIntent);
        // TODO: Implement logic to update your database here
        // - Find the booking associated with this paymentIntent (using metadata if you added it)
        // - Update the booking status to 'confirmed'
        // - Potentially update parking availability if not already done
        break;
      // Add other event types you want to handle
      // case 'payment_intent.payment_failed':
      //   const failedPaymentIntent = event.data.object;
      //   console.log('PaymentIntent failed:', failedPaymentIntent);
      //   // TODO: Implement logic for failed payments
      //   break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  });

  return router; // Return the configured router
};