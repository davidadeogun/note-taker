const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/noteRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const path = require('path');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB', error));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use('/api', noteRoutes);
app.use('/api', categoryRoutes);

// Catch-all to serve the frontend app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
