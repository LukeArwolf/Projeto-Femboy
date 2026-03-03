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

exports.getStreak = async (req, res) => {
    try {
        const { WorkoutLog } = require('../models');
        const { Op } = require('sequelize');
        const logs = await WorkoutLog.findAll({
            attributes: ['workoutDate'],
            order: [['workoutDate', 'DESC']],
        });
        let streak = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < 365; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            const found = logs.some(l => {
                const ld = new Date(l.workoutDate);
                ld.setHours(0, 0, 0, 0);
                return ld.getTime() === day.getTime();
            });
            if (found) streak++;
            else if (i > 0) break;
        }
        res.json({ success: true, streak });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const { WorkoutLog } = require('../models');
        const { Op } = require('sequelize');
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const [total, weekly, monthly] = await Promise.all([
            WorkoutLog.count(),
            WorkoutLog.count({ where: { workoutDate: { [Op.gte]: weekAgo } } }),
            WorkoutLog.count({ where: { workoutDate: { [Op.gte]: monthAgo } } }),
        ]);
        res.json({ success: true, data: { total, weekly, monthly } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
