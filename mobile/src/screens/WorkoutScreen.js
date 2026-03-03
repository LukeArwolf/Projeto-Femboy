import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Dimensions, Animated, Alert, Vibration
} from 'react-native';
import { CheckCircle2, SkipForward } from 'lucide-react-native';
import { WORKOUT_SCHEDULE } from '../data/exercises';
import { logWorkout } from '../services/api';


const { width } = Dimensions.get('window');

export default function WorkoutScreen({ navigation }) {
    const today = new Date().getDay();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const scheduleMap = { 1: 0, 3: 1, 5: 2 };
    const scheduleIdx = scheduleMap[today] !== undefined ? scheduleMap[today] : 0;
    const workout = WORKOUT_SCHEDULE[scheduleIdx];

    const [exerciseIdx, setExerciseIdx] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [phase, setPhase] = useState('working');
    const [timer, setTimer] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [weights, setWeights] = useState({});
    const [completedSets, setCompletedSets] = useState({});
    const [workoutDone, setWorkoutDone] = useState(false);
    const [totalTime, setTotalTime] = useState(0);

    const restAnim = useRef(new Animated.Value(1)).current;
    const intervalRef = useRef(null);
    const restRef = useRef(null);

    const exercise = workout.exercises[exerciseIdx];

    useEffect(() => {
        intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(intervalRef.current);
    }, [exerciseIdx, currentSet]);

    useEffect(() => {
        if (phase === 'resting' && restTimer > 0) {
            restRef.current = setInterval(() => {
                setRestTimer(t => {
                    if (t <= 1) {
                        clearInterval(restRef.current);
                        setPhase('working');
                        setTimer(0);
                        Vibration.vibrate([0, 100, 100, 200]);
                        return 0;
                    }
                    animateRestBar(t - 1, exercise.restTime);
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(restRef.current);
    }, [phase, restTimer]);

    const animateRestBar = (current, total) => {
        Animated.timing(restAnim, {
            toValue: current / total,
            duration: 900,
            useNativeDriver: false,
        }).start();
    };

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const completeSet = () => {
        Vibration.vibrate(50);
        const key = `${exerciseIdx}`;
        const done = completedSets[key] || 0;
        setCompletedSets({ ...completedSets, [key]: done + 1 });

        if (currentSet < exercise.sets) {
            setCurrentSet(c => c + 1);
            setPhase('resting');
            setRestTimer(exercise.restTime);
            setTimer(0);
            Vibration.vibrate([0, 100, 50, 100]);
            Animated.timing(restAnim, { toValue: 1, duration: 0, useNativeDriver: false }).start();
        } else {
            nextExercise();
        }
    };

    const nextExercise = async () => {
        Vibration.vibrate([0, 100, 100, 200, 100, 300]);
        const nextIdx = exerciseIdx + 1;
        if (nextIdx >= workout.exercises.length) {
            clearInterval(intervalRef.current);
            setWorkoutDone(true);
            await logWorkout({
                exerciseName: workout.name,
                sets: workout.exercises.reduce((a, ex) => a + ex.sets, 0),
                duration: timer,
                heartRate: 85,
            }).catch(() => { });
        } else {
            setExerciseIdx(nextIdx);
            setCurrentSet(1);
            setPhase('working');
            setTimer(0);
        }
    };

    const openDetail = () => {
        navigation.navigate('ExerciseDetail', { exercise });
    };

    if (workoutDone) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 72 }}>🎉</Text>
                <Text style={styles.doneTitle}>TREINO CONCLUÍDO!</Text>
                <Text style={styles.doneSub}>{workout.exercises.length} exercícios · {formatTime(timer)}</Text>
                <TouchableOpacity style={styles.doneBtn} onPress={() => { setExerciseIdx(0); setCurrentSet(1); setWorkoutDone(false); }}>
                    <Text style={styles.doneBtnText}>NOVO TREINO</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const restBarWidth = restAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.workoutDay}>{workout.day.toUpperCase()}</Text>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                </View>
                <Text style={styles.timer}>{formatTime(timer)}</Text>
            </View>

            <View style={styles.progressRow}>
                {workout.exercises.map((ex, i) => (
                    <View key={i} style={[
                        styles.progressDot,
                        i < exerciseIdx && styles.progressDotDone,
                        i === exerciseIdx && styles.progressDotActive,
                    ]} />
                ))}
            </View>

            <TouchableOpacity style={styles.exerciseCard} onPress={openDetail} activeOpacity={0.9}>
                <View style={styles.exerciseCardHeader}>
                    <View style={styles.exNumBadge}>
                        <Text style={styles.exNumText}>{exerciseIdx + 1}/{workout.exercises.length}</Text>
                    </View>
                    <View style={styles.detailHint}>
                        <Text style={styles.detailHintText}>ℹ️ Ver instruções</Text>
                    </View>
                </View>

                <Text style={styles.exCategory}>{exercise.category.toUpperCase()}</Text>
                <Text style={styles.exName}>{exercise.name}</Text>
                <Text style={styles.exMachine}>📍 {exercise.machine}</Text>

                <View style={styles.musclesRow}>
                    {exercise.musclesTargeted.map((m, i) => (
                        <View key={i} style={styles.musclePill}>
                            <Text style={styles.muscleText}>{m}</Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>

            {phase === 'working' ? (
                <View style={styles.setsCard}>
                    <Text style={styles.setsTitle}>SÉRIES</Text>
                    <View style={styles.setsRow}>
                        {Array.from({ length: exercise.sets }).map((_, i) => (
                            <View key={i} style={[
                                styles.setCircle,
                                i < currentSet - 1 && styles.setCircleDone,
                                i === currentSet - 1 && styles.setCircleActive,
                            ]}>
                                {i < currentSet - 1
                                    ? <CheckCircle2 color="#00ff88" size={20} />
                                    : <Text style={[styles.setNum, i === currentSet - 1 && { color: '#fff' }]}>{i + 1}</Text>
                                }
                            </View>
                        ))}
                    </View>

                    <View style={styles.repsInfo}>
                        <Text style={styles.repsLabel}>REPETIÇÕES</Text>
                        <Text style={styles.repsValue}>{exercise.reps}</Text>
                    </View>

                    <TouchableOpacity style={styles.completeBtn} onPress={completeSet} activeOpacity={0.85}>
                        <Text style={styles.completeBtnText}>
                            {currentSet >= exercise.sets ? '✅ FINALIZAR EXERCÍCIO' : `✓  COMPLETAR SÉRIE ${currentSet}`}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.restCard}>
                    <Text style={styles.restLabel}>DESCANSO</Text>
                    <Text style={styles.restTimer}>{formatTime(restTimer)}</Text>
                    <View style={styles.restBarBg}>
                        <Animated.View style={[styles.restBar, { width: restBarWidth }]} />
                    </View>
                    <Text style={styles.restSub}>Próxima série: {currentSet} de {exercise.sets}</Text>
                    <TouchableOpacity style={styles.skipRest} onPress={() => {
                        clearInterval(restRef.current);
                        setPhase('working');
                        setTimer(0);
                    }}>
                        <SkipForward color="rgba(255,255,255,0.5)" size={16} />
                        <Text style={styles.skipText}>Pular descanso</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.exerciseListCard}>
                <Text style={styles.listTitle}>PRÓXIMOS EXERCÍCIOS</Text>
                {workout.exercises.slice(exerciseIdx + 1).map((ex, i) => (
                    <View key={i} style={styles.nextExRow}>
                        <Text style={styles.nextExName}>{ex.name}</Text>
                        <Text style={styles.nextExSets}>{ex.sets} × {ex.reps}</Text>
                    </View>
                ))}
                {exerciseIdx >= workout.exercises.length - 1 && (
                    <Text style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingVertical: 8 }}>Último exercício! 💪</Text>
                )}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070711', paddingHorizontal: 20 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 60, paddingBottom: 20,
    },
    workoutDay: { color: '#00ff88', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
    workoutName: { color: '#fff', fontSize: 22, fontWeight: '800' },
    timer: { color: 'rgba(255,255,255,0.4)', fontSize: 28, fontWeight: '300', fontFamily: 'monospace' },
    progressRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
    progressDot: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
    progressDotDone: { backgroundColor: '#00ff88' },
    progressDotActive: { backgroundColor: '#7c3aed' },

    exerciseCard: {
        backgroundColor: 'rgba(124, 58, 237, 0.08)', borderRadius: 20,
        padding: 20, marginBottom: 16,
        borderWidth: 1, borderColor: 'rgba(124, 58, 237, 0.25)',
    },
    exerciseCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    exNumBadge: {
        backgroundColor: 'rgba(124,58,237,0.2)', borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 4,
    },
    exNumText: { color: '#7c3aed', fontSize: 12, fontWeight: '700' },
    detailHint: {
        backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 4,
    },
    detailHintText: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
    exCategory: { color: '#7c3aed', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
    exName: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 6 },
    exMachine: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 14 },
    musclesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    musclePill: {
        backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 4,
    },
    muscleText: { color: 'rgba(255,255,255,0.55)', fontSize: 12 },

    setsCard: {
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20,
        padding: 20, marginBottom: 16,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    setsTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 16 },
    setsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    setCircle: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center', alignItems: 'center',
    },
    setCircleDone: { backgroundColor: 'rgba(0,255,136,0.1)', borderColor: '#00ff88' },
    setCircleActive: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
    setNum: { color: 'rgba(255,255,255,0.4)', fontSize: 18, fontWeight: '700' },
    repsInfo: { alignItems: 'center', marginBottom: 20 },
    repsLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
    repsValue: { color: '#00ff88', fontSize: 48, fontWeight: '200', fontFamily: 'monospace' },
    completeBtn: {
        backgroundColor: '#00ff88', borderRadius: 16, paddingVertical: 18, alignItems: 'center',
    },
    completeBtnText: { color: '#070711', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

    restCard: {
        backgroundColor: 'rgba(255,170,0,0.06)', borderRadius: 20,
        padding: 24, marginBottom: 16, alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,170,0,0.2)',
    },
    restLabel: { color: '#ffaa00', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
    restTimer: { color: '#fff', fontSize: 56, fontWeight: '200', fontFamily: 'monospace', marginBottom: 16 },
    restBarBg: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 12 },
    restBar: { height: 6, backgroundColor: '#ffaa00', borderRadius: 3 },
    restSub: { color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 16 },
    skipRest: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    skipText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },

    exerciseListCard: {
        backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20,
        padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    listTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
    nextExRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    nextExName: { color: 'rgba(255,255,255,0.55)', fontSize: 14 },
    nextExSets: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },

    doneTitle: { color: '#00ff88', fontSize: 32, fontWeight: '800', marginTop: 16, marginBottom: 8 },
    doneSub: { color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 32 },
    doneBtn: { backgroundColor: '#00ff88', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 40 },
    doneBtnText: { color: '#070711', fontSize: 16, fontWeight: '800' },
});
