const express = require('express');
const { check, validationResult } = require('express-validator');  // Import validationResult
const userController = require('../controllers/userController');
const router = express.Router();

// POST route to create a new user with validation
router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('email', 'Email must be valid').isEmail(),
    check('password', 'Password must be 6 characters or longer').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Validate the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Use the controller to create the user
      await userController.createUser(req, res);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
