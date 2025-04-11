const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const deviceRoutes = require('./routes/device');
const patientRoutes = require('./routes/patient');
const readingRoutes = require('./routes/reading');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const { authenticateToken, authorizeAdmin } = require('./middleware/authMiddleware');

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Welcome...!!!" })
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', authenticateToken, patientRoutes);
app.use('/api/devices', authenticateToken, authorizeAdmin, deviceRoutes);
app.use('/api/readings', readingRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI, {}).then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server started on port ${process.env.PORT || 3000}`);
    });
}).catch(err => console.error(err));

module.exports = app;
