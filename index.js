const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/db');
const blogRoutes = require('./routes/blogRoutes');
const controlPanelRoutes = require('./routes/controlPanelRoutes');
const projectRoutes = require('./routes/projectRoutes');
const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const allowedOrigins = require('./config/allowedOrigins');

const app = express();

// Middleware
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));
app.use('/files', express.static(path.join(__dirname, 'uploads', 'files')));

// Connect to MongoDB database
db();

// CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Routes
app.use('/api', blogRoutes);
app.use('/control-panel', controlPanelRoutes);
app.use('/api', projectRoutes);
app.use('/api', newsRoutes);
app.use('/api', authRoutes);
app.use('/api', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running');
});