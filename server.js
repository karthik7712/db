const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

// Use routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use((req, res, next) => {
    console.log(`Request received: ${req.url}`);
    next();
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
