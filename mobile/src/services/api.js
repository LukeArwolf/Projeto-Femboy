import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://82.112.245.99:3001/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

export const logWorkout = async (data) => {
    try {
        const resp = await api.post('/workouts/log', data);
        return resp.data;
    } catch (e) {
        console.warn('logWorkout offline:', e.message);
    }
};

export const getLogs = async () => {
    try {
        const resp = await api.get('/workouts/logs');
        return resp.data?.data || [];
    } catch (e) {
        console.warn('getLogs offline:', e.message);
        return [];
    }
};

export const getStreak = async () => {
    try {
        const resp = await api.get('/workouts/streak');
        return resp.data?.streak || 0;
    } catch (e) {
        return 0;
    }
};

export const getStats = async () => {
    try {
        const resp = await api.get('/workouts/stats');
        return resp.data?.data || {};
    } catch (e) {
        return {};
    }
};

export default api;
