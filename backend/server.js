const express = require('express');
const cors = require('cors');  // Import cors
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for your frontend's origin
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware to parse JSON requests
app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define the server port
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
