import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, Animated
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

const LEVEL_COLORS = { 'Iniciante': '#00ff88', 'Intermediário': '#ffaa00', 'Avançado': '#ff4444' };

export default function ExerciseDetailScreen({ route }) {
    const { exercise } = route.params;
    const [videoStatus, setVideoStatus] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const togglePlay = async () => {
        if (isPlaying) {
            await videoRef.current?.pauseAsync();
        } else {
            await videoRef.current?.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri: exercise.videoUrl }}
                    useNativeControls={false}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    onPlaybackStatusUpdate={status => setVideoStatus(status)}
                />
                <TouchableOpacity style={styles.playOverlay} onPress={togglePlay}>
                    <View style={styles.playButton}>
                        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.videoLabel}>
                    <Text style={styles.videoLabelText}>🎥 DEMO DO EXERCÍCIO</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.category}>{exercise.category.toUpperCase()}</Text>
                        <Text style={styles.name}>{exercise.name}</Text>
                    </View>
                    <View style={[styles.levelBadge, { borderColor: LEVEL_COLORS[exercise.level] }]}>
                        <Text style={[styles.levelText, { color: LEVEL_COLORS[exercise.level] }]}>
                            {exercise.level}
                        </Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>{exercise.sets}</Text>
                        <Text style={styles.statLbl}>Séries</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>{exercise.reps}</Text>
                        <Text style={styles.statLbl}>Reps</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>{exercise.restTime}s</Text>
                        <Text style={styles.statLbl}>Descanso</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 EQUIPAMENTO</Text>
                    <View style={styles.machineCard}>
                        <Text style={styles.machineText}>{exercise.machine}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💪 MÚSCULOS TRABALHADOS</Text>
                    <View style={styles.musclesWrap}>
                        {exercise.musclesTargeted.map((m, i) => (
                            <View key={i} style={styles.musclePill}>
                                <Text style={styles.muscleText}>● {m}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 COMO EXECUTAR</Text>
                    {exercise.instructions.map((step, i) => (
                        <View key={i} style={styles.stepRow}>
                            <View style={styles.stepNum}>
                                <Text style={styles.stepNumText}>{i + 1}</Text>
                            </View>
                            <Text style={styles.stepText}>{step}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.tipsCard}>
                    <Text style={styles.tipTitle}>💡 DICA DE OURO</Text>
                    <Text style={styles.tipText}>{exercise.tips}</Text>
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070711' },
    videoContainer: { width: '100%', height: 240, backgroundColor: '#0d0d1a', position: 'relative' },
    video: { width: '100%', height: 240 },
    playOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
    },
    playButton: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    },
    playIcon: { fontSize: 28 },
    videoLabel: {
        position: 'absolute', bottom: 12, left: 16,
        backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 4,
    },
    videoLabelText: { color: '#00ff88', fontSize: 11, fontWeight: '700', letterSpacing: 1 },

    content: { padding: 20 },
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
    category: { color: '#7c3aed', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
    name: { color: '#fff', fontSize: 28, fontWeight: '800' },
    levelBadge: {
        borderWidth: 1.5, borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 6, marginTop: 8,
    },
    levelText: { fontSize: 12, fontWeight: '700' },

    statsRow: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16, padding: 16, marginBottom: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    statBox: { flex: 1, alignItems: 'center' },
    statVal: { color: '#00ff88', fontSize: 24, fontWeight: '800', marginBottom: 4 },
    statLbl: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' },
    statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

    section: { marginBottom: 24 },
    sectionTitle: {
        color: 'rgba(255,255,255,0.35)', fontSize: 12,
        fontWeight: '700', letterSpacing: 1.5, marginBottom: 12,
    },
    machineCard: {
        backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: 12,
        padding: 14, borderWidth: 1, borderColor: 'rgba(124, 58, 237, 0.2)',
    },
    machineText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    musclesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    musclePill: {
        backgroundColor: 'rgba(0, 255, 136, 0.08)', borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 8,
        borderWidth: 1, borderColor: 'rgba(0, 255, 136, 0.2)',
    },
    muscleText: { color: '#00ff88', fontSize: 13, fontWeight: '600' },

    stepRow: { flexDirection: 'row', gap: 14, marginBottom: 14, alignItems: 'flex-start' },
    stepNum: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: '#7c3aed', justifyContent: 'center', alignItems: 'center', flexShrink: 0,
    },
    stepNumText: { color: '#fff', fontSize: 13, fontWeight: '800' },
    stepText: { color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 22, flex: 1 },

    tipsCard: {
        backgroundColor: 'rgba(255, 170, 0, 0.08)', borderRadius: 16,
        padding: 18, borderWidth: 1, borderColor: 'rgba(255, 170, 0, 0.2)',
        marginBottom: 8,
    },
    tipTitle: { color: '#ffaa00', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
    tipText: { color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 23 },
});
