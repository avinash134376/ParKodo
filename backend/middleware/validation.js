const { check, validationResult } = require('express-validator');

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- Validation checks for specific routes ---

// Validation for user signup
const validateSignup = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  // Optional: Validate role if provided
  check('role', 'Invalid role').optional().isIn(['customer', 'owner']),
];

// Validation for user login
const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

// Validation for adding a parking location
const validateParking = [
  check('name', 'Parking name is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty(),
  check('latitude', 'Valid latitude is required').isFloat({ min: -90, max: 90 }),
  check('longitude', 'Valid longitude is required').isFloat({ min: -180, max: 180 }),
  check('capacity', 'Capacity must be a positive integer').isInt({ gt: 0 }),
  check('pricePerHour', 'Price per hour must be a non-negative number').isFloat({ min: 0 }),
  // Optional: Validate features (can be more detailed if needed)
  check('features', 'Features must be an object').optional().isObject(),
];

// Validation for creating a booking
const validateBooking = [
  check('parkingId', 'Parking ID is required').isMongoId(),
  check('startTime', 'Start time is required and must be a valid date').isISO8601().toDate(),
  // Optional: Validate endTime or duration
  check('endTime', 'End time must be a valid date').optional().isISO8601().toDate(),
  check('duration', 'Duration must be a positive number').optional().isFloat({ gt: 0 }),
  // Ensure either endTime or duration is provided if startTime is present
  check('endTime').custom((value, { req }) => {
    if (req.body.startTime && !value && !req.body.duration) {
      throw new Error('Either endTime or duration is required when startTime is provided');
    }
    return true;
  }),
  check('duration').custom((value, { req }) => {
    if (req.body.startTime && !value && !req.body.endTime) {
      throw new Error('Either endTime or duration is required when startTime is provided');
    }
    return true;
  }),
  check('vehicle', 'Vehicle details are required').not().isEmpty(),
];

// Validation for validating a MongoDB ObjectId in URL parameters
const validateObjectId = (idParamName) => [
  check(idParamName, `Invalid ${idParamName} format`).isMongoId(), // Use check and dynamic fieldName
];


module.exports = {
  handleValidationErrors,
  validateSignup,
  validateLogin,
  validateParking,
  validateBooking,
  validateObjectId, // Export the function
};
