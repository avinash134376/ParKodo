const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

const stripe = require('stripe'); // Import the stripe library

// Import routes
const authRoutes = require('./routes/auth'); // Authentication routes
const paymentRoutes = require('./routes/payment'); // Payment routes
const bookingRoutes = require('./routes/bookings'); // Booking routes
const webhookRoutes = require('./routes/webhook'); // Webhook routes
const parkingRoutes = require('./routes/parking'); // Parking routes
const vehicleRoutes = require('./routes/vehicles'); // Vehicle routes

// Import Mongoose after dotenv so environment variables are loaded
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000; // Use port from environment variable or default to 5000

// Initialize Stripe with the secret key from environment variables
// The Stripe instance can be accessed in routes where it's passed or imported.
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
// Stripe webhook requires the raw body, so we use express.raw() for this specific path
// It must be placed before express.json()
app.use('/webhook', express.raw({ type: 'application/json' }));

// Mount webhook routes at a specific path (e.g., /webhook)
app.use('/webhook', webhookRoutes(stripeInstance));
// MongoDB Connection
const uri = process.env.MONGODB_URI; // Get MongoDB connection string from environment variable
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes
// Mount the authRoutes at the /api/auth path for authentication related routes
app.use('/api/auth', authRoutes);
// Mount the bookingRoutes at the /api/bookings path for booking related routes
app.use('/api/bookings', bookingRoutes);
// Mount the paymentRoutes at the /api/payment path for payment related routes
// Pass the Stripe instance to the payment router so it can be used to interact with the Stripe API
app.use('/api/payment', paymentRoutes(stripeInstance));
// Mount the parkingRoutes at the /api/parking path for parking related routes
app.use('/api/parking', parkingRoutes);
// Mount the vehicleRoutes at the /api/vehicles path for vehicle related routes
app.use('/api/vehicles', vehicleRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
