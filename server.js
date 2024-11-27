const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const registrationRoutes = require('./routes/registration');
const paymentRoutes = require('./routes/payment');
const eventRoutes = require('./routes/eventCategory');
const dotenv = require("dotenv");
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.3', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/category', eventRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
