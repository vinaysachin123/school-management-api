const express = require('express');
const cors = require('cors');
require('dotenv').config();

const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', schoolRoutes);
app.use('/', schoolRoutes); // Support requests without the /api prefix


// Health check endpoint
app.get('/', (req, res) => {
    res.send('School Management API is running.');
});

// Start server
const startServer = async () => {

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
