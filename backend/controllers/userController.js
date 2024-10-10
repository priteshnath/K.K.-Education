// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Create a new user
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    streetAddress,
    town,
    state,
    pincode,
    phone,
    email,
    nomineeName,
    sponsorId,
    vigilanceOfficer,
    accountUsername,
    password,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      streetAddress,
      town,
      state,
      pincode,
      phone,
      email,
      nomineeName,
      sponsorId,
      vigilanceOfficer,
      accountUsername,
      password: hashedPassword, // Store hashed password
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};