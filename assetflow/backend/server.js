const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const yashRoutes = require('./routes/yashRoutes');
const dakshRoutes = require('./routes/dakshRoutes');
const ayushRoutes = require('./routes/ayushRoutes');

// Mount Routes (Mounts the 3 route files once; never touched again)
app.use('/api/yash', yashRoutes);
app.use('/api/daksh', dakshRoutes);
app.use('/api/ayush', ayushRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AssetFlow API' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
