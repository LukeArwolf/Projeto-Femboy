const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const workoutRoutes = require('./routes/workoutRoutes');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workouts', workoutRoutes);
app.get('/health', (req, res) => res.json({ status: 'OK', server: 'Fitness C2' }));

// Sync Database and Start Server
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });
