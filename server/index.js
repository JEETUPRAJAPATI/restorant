const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const apiRoutes = require('./routes/simple');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection with MongoDB Memory Server for development
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('./utils/seedData');

// Start in-memory MongoDB instance for development/testing
async function startServer() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    console.log(`Using in-memory MongoDB server at ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    
    // Seed initial demo data
    await seedData();
    
    // Start the Express server after DB connection
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// API routes
app.use('/api', apiRoutes);

// Root route for API status check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Restaurant Events API is running',
    version: '1.0.0',
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status,
    message: err.message || 'Internal server error',
  });
});

// Start server
startServer();

module.exports = app;
