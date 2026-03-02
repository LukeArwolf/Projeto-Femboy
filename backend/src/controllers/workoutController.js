const { WorkoutLog, Exercise } = require('../models');

exports.logWorkout = async (req, res) => {
    try {
        const { exerciseName, sets, reps, weight, restTime, heartRate, duration } = req.body;
        const log = await WorkoutLog.create({
            exerciseName,
            sets,
            reps,
            weight,
            restTime,
            heartRate,
            duration
        });
        res.status(201).json({ success: true, data: log });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await WorkoutLog.findAll({
            order: [['workoutDate', 'DESC']]
        });
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.seedExercises = async (req, res) => {
    // Rota para popular os exercícios iniciais conforme o pedido do usuário
    const exercises = [
        { name: 'Hip Thrust', category: 'Glúteo', isFixed: true },
        { name: 'Agachamento no Smith', category: 'Glúteo', isFixed: true },
        { name: 'Stiff', category: 'Posterior', isFixed: true },
        { name: 'Cadeira Abdutora', category: 'Glúteo', isFixed: true },
        { name: 'Elevação pélvica unilateral', category: 'Glúteo', isFixed: true },
        // ... outros exercícios conforme o cronograma
    ];
    try {
        await Exercise.bulkCreate(exercises, { ignoreDuplicates: true });
        res.json({ success: true, message: 'Exercises seeded' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
