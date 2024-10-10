// models/User.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  town: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nomineeName: { type: String, required: true },
  sponsorId: { type: String, required: true },
  vigilanceOfficer: { type: String, required: true },
  accountUsername: { type: String, required: true },
  password: { type: String, required: true },
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports=User;