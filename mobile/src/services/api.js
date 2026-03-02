import axios from 'axios';

const API_URL = 'http://82.112.245.99:3000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

export const logWorkout = async (data) => {
    try {
        const response = await api.post('/workouts/log', data);
        return response.data;
    } catch (error) {
        console.error('Error logging workout:', error);
        throw error;
    }
};

export default api;
