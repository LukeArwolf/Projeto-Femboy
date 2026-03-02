const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' }
});

const Exercise = sequelize.define('Exercise', {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING }, // Glúteo, Quadríceps, etc.
    description: { type: DataTypes.TEXT },
    gifUrl: { type: DataTypes.STRING },
    isFixed: { type: DataTypes.BOOLEAN, defaultValue: true } // SIM (true) vs NÃO (false)
});

const WorkoutLog = sequelize.define('WorkoutLog', {
    exerciseName: { type: DataTypes.STRING, allowNull: false },
    sets: { type: DataTypes.INTEGER },
    reps: { type: DataTypes.INTEGER },
    weight: { type: DataTypes.FLOAT },
    restTime: { type: DataTypes.INTEGER }, // Segundos
    heartRate: { type: DataTypes.INTEGER }, // Batimentos do Watch
    duration: { type: DataTypes.INTEGER }, // Duração total do exercício em segundos
    workoutDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = { User, Exercise, WorkoutLog };
