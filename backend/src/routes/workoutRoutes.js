const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.post('/log', workoutController.logWorkout);
router.get('/logs', workoutController.getLogs);
router.post('/seed', workoutController.seedExercises);
router.get('/streak', workoutController.getStreak);
router.get('/stats', workoutController.getStats);

module.exports = router;
