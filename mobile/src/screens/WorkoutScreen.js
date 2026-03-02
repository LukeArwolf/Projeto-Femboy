import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Play, Pause, RotateCcw, CheckCircle2, Heart } from 'lucide-react-native';
import { logWorkout } from '../services/api';

const { width } = Dimensions.get('window');

const WorkoutScreen = ({ exercise }) => {
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [timer, setTimer] = useState(0);
    const [heartRate, setHeartRate] = useState(75); // Mock HR

    useEffect(() => {
        let interval;
        if (isResting || !isResting) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, []);

    const handleNextSet = async () => {
        if (currentSet >= exercise.sets) {
            // Finalizar exercício
            await logWorkout({
                exerciseName: exercise.name,
                sets: exercise.sets,
                heartRate: heartRate,
                duration: timer
            });
            alert('Treino concluído!');
        } else {
            setIsResting(true);
            setTimer(0);
            setCurrentSet(currentSet + 1);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.glassCard}>
                <Text style={styles.title}>{exercise.name}</Text>
                <Text style={styles.subtitle}>Série {currentSet} de {exercise.sets}</Text>

                <View style={styles.hrContainer}>
                    <Heart color="#ff4444" size={24} fill="#ff4444" />
                    <Text style={styles.hrText}>{heartRate} BPM</Text>
                </View>

                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                    <Text style={styles.timerLabel}>{isResting ? 'DESCANSO' : 'EM EXECUÇÃO'}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, isResting ? styles.restButton : styles.workButton]}
                    onPress={() => setIsResting(!isResting)}
                >
                    <Text style={styles.buttonText}>
                        {isResting ? 'VOLTAR AO TREINO' : 'CONCLUIR SÉRIE'}
                    </Text>
                </TouchableOpacity>

                {currentSet === exercise.sets && !isResting && (
                    <TouchableOpacity style={styles.finishButton} onPress={handleNextSet}>
                        <CheckCircle2 color="#00ff88" size={32} />
                        <Text style={styles.finishText}>FINALIZAR</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    glassCard: {
        width: width * 0.9,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 18,
        marginBottom: 24,
    },
    hrContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    hrText: {
        color: '#ff4444',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    timerText: {
        color: '#00ff88',
        fontSize: 64,
        fontWeight: '300',
        fontFamily: 'monospace',
    },
    timerLabel: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
        letterSpacing: 2,
        marginTop: 4,
    },
    button: {
        width: '100%',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    workButton: {
        backgroundColor: '#00ff88',
    },
    restButton: {
        backgroundColor: '#333',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    finishButton: {
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    finishText: {
        color: '#00ff88',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default WorkoutScreen;
