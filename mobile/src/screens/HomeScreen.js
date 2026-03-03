import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, StatusBar
} from 'react-native';
import { WORKOUT_SCHEDULE } from '../data/exercises';
import { getStreak } from '../services/api';

const { width } = Dimensions.get('window');

const COLORS = {
    bg: '#070711',
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.08)',
    primary: '#00ff88',
    secondary: '#7c3aed',
    accent: '#ff6b6b',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.45)',
    statBg: 'rgba(124, 58, 237, 0.1)',
};

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function HomeScreen({ navigation }) {
    const [streak, setStreak] = useState(0);
    const [todayWorkout, setTodayWorkout] = useState(null);
    const [completedToday, setCompletedToday] = useState(false);
    const [weekProgress, setWeekProgress] = useState([false, false, false, false, false, false, false]);

    useEffect(() => {
        const dayIndex = new Date().getDay();
        const dayName = DAYS_OF_WEEK[dayIndex];
        const schedule = WORKOUT_SCHEDULE.find(w => {
            if (w.day === 'Segunda' && dayName === 'Seg') return true;
            if (w.day === 'Quarta' && dayName === 'Qua') return true;
            if (w.day === 'Sexta' && dayName === 'Sex') return true;
            return false;
        });
        setTodayWorkout(schedule || null);

        getStreak().then(s => setStreak(s || 7)).catch(() => setStreak(7));

        const fakeProgress = [true, true, false, true, false, false, false];
        setWeekProgress(fakeProgress);
    }, []);

    const totalVolume = 4200;
    const weeklyGoal = 3;
    const completedDays = weekProgress.filter(Boolean).length;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Bom dia, 🔥</Text>
                    <Text style={styles.subGreeting}>Prontas para arrebentar?</Text>
                </View>
                <View style={styles.streakBadge}>
                    <Text style={styles.streakFire}>🔥</Text>
                    <Text style={styles.streakNum}>{streak}</Text>
                    <Text style={styles.streakLabel}>dias</Text>
                </View>
            </View>

            <View style={styles.weekBar}>
                {DAYS_OF_WEEK.map((day, i) => (
                    <View key={day} style={styles.dayItem}>
                        <View style={[styles.dayDot, weekProgress[i] && styles.dayDotDone]} />
                        <Text style={[styles.dayLabel, weekProgress[i] && styles.dayLabelDone]}>{day}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{completedDays}/{weeklyGoal}</Text>
                    <Text style={styles.statLabel}>treinos essa semana</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{(totalVolume / 1000).toFixed(1)}t</Text>
                    <Text style={styles.statLabel}>volume total</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: '#ff6b6b' }]}>❤️ 72</Text>
                    <Text style={styles.statLabel}>bpm média</Text>
                </View>
            </View>

            {todayWorkout ? (
                <View style={styles.nextWorkoutCard}>
                    <View style={styles.nextWorkoutHeader}>
                        <View>
                            <Text style={styles.nextWorkoutPre}>TREINO DE HOJE</Text>
                            <Text style={styles.nextWorkoutName}>{todayWorkout.name}</Text>
                        </View>
                        <Text style={styles.nextWorkoutDay}>{todayWorkout.day}</Text>
                    </View>

                    <View style={styles.exerciseList}>
                        {todayWorkout.exercises.slice(0, 3).map((ex, i) => (
                            <View key={i} style={styles.miniExercise}>
                                <Text style={styles.miniExNum}>{i + 1}</Text>
                                <Text style={styles.miniExName}>{ex.name}</Text>
                                <Text style={styles.miniExSets}>{ex.sets}x{ex.reps}</Text>
                            </View>
                        ))}
                        {todayWorkout.exercises.length > 3 && (
                            <Text style={styles.moreExercises}>
                                +{todayWorkout.exercises.length - 3} exercícios
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => navigation.navigate('Treino')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.startButtonText}>⚡ INICIAR TREINO</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.restCard}>
                    <Text style={styles.restEmoji}>😴</Text>
                    <Text style={styles.restTitle}>Dia de Descanso</Text>
                    <Text style={styles.restSub}>Recuperação é parte do treino. Hidrate-se!</Text>
                </View>
            )}

            <Text style={styles.sectionTitle}>CRONOGRAMA SEMANAL</Text>
            {WORKOUT_SCHEDULE.map((w, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.scheduleCard}
                    onPress={() => navigation.navigate('Treino')}
                    activeOpacity={0.8}
                >
                    <View style={styles.scheduleLeft}>
                        <Text style={styles.scheduleDay}>{w.day}</Text>
                        <Text style={styles.scheduleName}>{w.name}</Text>
                        <Text style={styles.scheduleCount}>{w.exercises.length} exercícios</Text>
                    </View>
                    <Text style={styles.scheduleArrow}>›</Text>
                </TouchableOpacity>
            ))}

            <View style={{ height: 30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070711', paddingHorizontal: 20 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingTop: 60, paddingBottom: 24,
    },
    greeting: { color: '#fff', fontSize: 28, fontWeight: '800' },
    subGreeting: { color: 'rgba(255,255,255,0.45)', fontSize: 15, marginTop: 2 },
    streakBadge: {
        backgroundColor: 'rgba(255, 107, 107, 0.15)', borderRadius: 16,
        padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,107,107,0.3)',
    },
    streakFire: { fontSize: 22 },
    streakNum: { color: '#ff6b6b', fontSize: 22, fontWeight: '800' },
    streakLabel: { color: 'rgba(255,107,107,0.7)', fontSize: 11 },

    weekBar: {
        flexDirection: 'row', justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16,
        padding: 16, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    dayItem: { alignItems: 'center', gap: 6 },
    dayDot: {
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    dayDotDone: { backgroundColor: '#00ff88' },
    dayLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600' },
    dayLabelDone: { color: '#00ff88' },

    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    statCard: {
        flex: 1, backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: 14,
        padding: 14, borderWidth: 1, borderColor: 'rgba(124, 58, 237, 0.2)',
    },
    statValue: { color: '#00ff88', fontSize: 20, fontWeight: '800', marginBottom: 2 },
    statLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '600' },

    nextWorkoutCard: {
        backgroundColor: 'rgba(0, 255, 136, 0.06)', borderRadius: 20,
        padding: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(0, 255, 136, 0.2)',
    },
    nextWorkoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    nextWorkoutPre: { color: '#00ff88', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
    nextWorkoutName: { color: '#fff', fontSize: 22, fontWeight: '800' },
    nextWorkoutDay: { color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: '600' },
    exerciseList: { gap: 10, marginBottom: 20 },
    miniExercise: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12,
    },
    miniExNum: {
        color: '#00ff88', fontSize: 13, fontWeight: '800',
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: 'rgba(0,255,136,0.15)', textAlign: 'center', lineHeight: 22,
    },
    miniExName: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
    miniExSets: { color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: '600' },
    moreExercises: { color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', paddingVertical: 4 },
    startButton: {
        backgroundColor: '#00ff88', borderRadius: 16,
        paddingVertical: 16, alignItems: 'center',
    },
    startButtonText: { color: '#070711', fontSize: 16, fontWeight: '800', letterSpacing: 1 },

    restCard: {
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20,
        padding: 32, alignItems: 'center', marginBottom: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    },
    restEmoji: { fontSize: 48, marginBottom: 12 },
    restTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 6 },
    restSub: { color: 'rgba(255,255,255,0.45)', fontSize: 14, textAlign: 'center' },

    sectionTitle: {
        color: 'rgba(255,255,255,0.3)', fontSize: 12,
        fontWeight: '700', letterSpacing: 1.5, marginBottom: 12,
    },
    scheduleCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 18,
        marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    },
    scheduleLeft: { gap: 3 },
    scheduleDay: { color: '#00ff88', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    scheduleName: { color: '#fff', fontSize: 17, fontWeight: '700' },
    scheduleCount: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
    scheduleArrow: { color: 'rgba(255,255,255,0.25)', fontSize: 28, fontWeight: '300' },
});
