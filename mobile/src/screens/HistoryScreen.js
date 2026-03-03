import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { getLogs } from '../services/api';

export default function HistoryScreen() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockLogs = [
        { id: 1, exerciseName: 'GLÚTEO PESADO', sets: 14, duration: 2840, heartRate: 88, workoutDate: new Date(Date.now() - 86400000 * 2) },
        { id: 2, exerciseName: 'POSTERIOR FOCUS', sets: 11, duration: 2340, heartRate: 82, workoutDate: new Date(Date.now() - 86400000 * 4) },
        { id: 3, exerciseName: 'VOLUME TOTAL', sets: 11, duration: 2920, heartRate: 91, workoutDate: new Date(Date.now() - 86400000 * 7) },
        { id: 4, exerciseName: 'GLÚTEO PESADO', sets: 14, duration: 2740, heartRate: 85, workoutDate: new Date(Date.now() - 86400000 * 9) },
        { id: 5, exerciseName: 'POSTERIOR FOCUS', sets: 11, duration: 2560, heartRate: 79, workoutDate: new Date(Date.now() - 86400000 * 11) },
    ];

    useEffect(() => {
        getLogs()
            .then(data => setLogs(data?.length > 0 ? data : mockLogs))
            .catch(() => setLogs(mockLogs))
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
    };

    const formatDuration = (s) => {
        const m = Math.floor(s / 60);
        return `${m} min`;
    };

    const totalSets = logs.reduce((a, l) => a + (l.sets || 0), 0);
    const avgDuration = logs.length > 0
        ? Math.round(logs.reduce((a, l) => a + (l.duration || 0), 0) / logs.length / 60)
        : 0;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>Histórico</Text>

            <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryVal}>{logs.length}</Text>
                    <Text style={styles.summaryLbl}>treinos</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryVal}>{totalSets}</Text>
                    <Text style={styles.summaryLbl}>séries totais</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryVal}>{avgDuration}m</Text>
                    <Text style={styles.summaryLbl}>média/treino</Text>
                </View>
            </View>

            {logs.map((log, i) => (
                <View key={log.id || i} style={styles.logCard}>
                    <View style={styles.logLeft}>
                        <View style={styles.logDateDot} />
                        <View>
                            <Text style={styles.logDate}>{formatDate(log.workoutDate)}</Text>
                            <Text style={styles.logName}>{log.exerciseName}</Text>
                        </View>
                    </View>
                    <View style={styles.logStats}>
                        <View style={styles.logStat}>
                            <Text style={styles.logStatVal}>{log.sets}</Text>
                            <Text style={styles.logStatLbl}>séries</Text>
                        </View>
                        <View style={styles.logStat}>
                            <Text style={styles.logStatVal}>{formatDuration(log.duration)}</Text>
                            <Text style={styles.logStatLbl}>duração</Text>
                        </View>
                        <View style={styles.logStat}>
                            <Text style={[styles.logStatVal, { color: '#ff6b6b' }]}>❤️ {log.heartRate}</Text>
                            <Text style={styles.logStatLbl}>bpm</Text>
                        </View>
                    </View>
                </View>
            ))}

            {logs.length === 0 && !loading && (
                <View style={styles.empty}>
                    <Text style={styles.emptyEmoji}>📝</Text>
                    <Text style={styles.emptyText}>Nenhum treino registrado ainda.</Text>
                    <Text style={styles.emptySub}>Comece seu primeiro treino!</Text>
                </View>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070711', paddingHorizontal: 20 },
    pageTitle: { color: '#fff', fontSize: 32, fontWeight: '800', paddingTop: 60, paddingBottom: 24 },
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    summaryCard: {
        flex: 1, backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: 14,
        padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(124, 58, 237, 0.2)',
    },
    summaryVal: { color: '#00ff88', fontSize: 24, fontWeight: '800', marginBottom: 4 },
    summaryLbl: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600' },
    logCard: {
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, marginBottom: 10,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    },
    logLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    logDateDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00ff88', flexShrink: 0 },
    logDate: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
    logName: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 2 },
    logStats: { flexDirection: 'row', gap: 16, paddingLeft: 22 },
    logStat: { alignItems: 'center' },
    logStatVal: { color: '#00ff88', fontSize: 16, fontWeight: '700' },
    logStatLbl: { color: 'rgba(255,255,255,0.3)', fontSize: 11 },
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyEmoji: { fontSize: 48, marginBottom: 16 },
    emptyText: { color: 'rgba(255,255,255,0.6)', fontSize: 18, fontWeight: '600', marginBottom: 8 },
    emptySub: { color: 'rgba(255,255,255,0.3)', fontSize: 14 },
});
