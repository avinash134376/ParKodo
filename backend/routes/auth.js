const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Import bcrypt
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/User'); // Import the User model
// Import validation middleware
const { validateSignup, validateLogin, handleValidationErrors } = require('../middleware/validation');
const auth = require('../middleware/auth'); // Import authentication middleware


// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', validateSignup, handleValidationErrors, async (req, res) => {
  const {
    username,
    email,
    password,
    role
  } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({
      $or: [{
        email
      }, {
        username
      }]
    });

    if (user) {
      return res.status(400).json({
        msg: 'User already exists'
      });
    }

    // Create new user instance
    user = new User({
      username,
      email,
      password, // Password will be hashed before saving
      role: role || 'customer' // Default role to 'customer' if not provided
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role // Include user role in the token
      }
    };

    // Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Get JWT secret from environment variable
      {
        expiresIn: '1h' // Token expires in 1 hour (you can adjust this)
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          token
        }); // Send the token in the response
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  const {
    email,
    password
  } = req.body; // Assuming login is primarily by email

  try {
    // Find user by email
    let user = await User.findOne({
      email
    });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        msg: 'Invalid Credentials'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // Check if passwords match
    if (!isMatch) {
      return res.status(400).json({
        msg: 'Invalid Credentials'
      });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role // Include user role in the token
      }
    };

    // Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Get JWT secret from environment variable
      {
        expiresIn: '1h' // Token expires in 1 hour (you can adjust this)
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          token
        }); // Send the token in the response
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/auth/me
// @desc    Get authenticated user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Get user ID from auth middleware (req.user.id)
    const user = await User.findById(req.user.id).select('-password'); // Select all fields except the password

    // If user somehow not found (shouldn't happen with auth middleware)
    if (!user) {
      return res.status(404).json({
        msg: 'User not found'
      });
    }

    res.json(user); // Return user profile

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
