const express = require('express');
const cors = require('cors');
require('dotenv').config();

const topicsRouter = require('./routes/topics');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/topics', topicsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'DevOps Tracker API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});