const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // Add basic email format validation (optional but recommended)
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Minimum password length
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'owner'], // Restrict the value to 'customer' or 'owner'
    default: 'customer' // Default role is customer
  },
  // Add other user-related fields as needed (e.g., name, avatarUrl, etc.)
  name: {
    type: String,
    trim: true
  },
  avatarUrl: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const User = mongoose.model('User', userSchema);

module.exports = User;
