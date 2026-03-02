import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import WorkoutScreen from './src/screens/WorkoutScreen';
import { registerForPushNotificationsAsync, scheduleWorkoutAlarm } from './src/utils/notifications';

const MOCK_EXERCISE = {
    name: 'Hip Thrust',
    sets: 4,
    reps: 10,
    restTime: 60,
};

export default function App() {
    useEffect(() => {
        registerForPushNotificationsAsync().then(() => scheduleWorkoutAlarm());
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <WorkoutScreen exercise={MOCK_EXERCISE} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
});
