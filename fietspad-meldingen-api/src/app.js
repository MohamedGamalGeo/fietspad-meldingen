// const express = require("express");
// const cors = require('cors');
// const bodyParser = require("body-parser");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const locationRoutes = require('./routes/locationRoutes');

// // Initialize app
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to database
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use('/api/locations', locationRoutes);

// module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const connectDB = require("./config/db");


const locationRoutes = require('./routes/locationRoutes');
const authRoutes = require("./routes/authRoutes");


const app = express();

// Middleware
//app.use(cors());
//app.use(bodyParser.json());
//app.use('/api/locations', locationRoutes);
//app.use("/api/auth", authRoutes);



// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static folder for uploads
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// // Routes
app.use("/api/auth", authRoutes);
app.use('/api', locationRoutes);

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Connect to database
connectDB();

// Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;