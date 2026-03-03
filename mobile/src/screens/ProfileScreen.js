import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { scheduleWorkoutAlarm } from '../utils/notifications';

export default function ProfileScreen() {
    const [alarmEnabled, setAlarmEnabled] = useState(true);
    const [waterGoal, setWaterGoal] = useState(2500);
    const [waterDrank, setWaterDrank] = useState(1200);
    const [alarmTime, setAlarmTime] = useState('05:50');

    const waterPercent = Math.min((waterDrank / waterGoal) * 100, 100);

    const addWater = (ml) => {
        const newVal = Math.min(waterDrank + ml, waterGoal);
        setWaterDrank(newVal);
        if (newVal >= waterGoal) {
            Alert.alert('🎉 Meta atingida!', `Você bebeu ${waterGoal}ml de água hoje!`);
        }
    };

    const toggleAlarm = async (val) => {
        setAlarmEnabled(val);
        if (val) {
            await scheduleWorkoutAlarm();
            Alert.alert('✅ Alarme ativado', `Você será notificada às ${alarmTime} para treinar!`);
        }
    };

    const stats = [
        { label: 'Semanas treinando', value: '8' },
        { label: 'Treinos completos', value: '21' },
        { label: 'Streak recorde', value: '12 dias' },
        { label: 'Volume total', value: '42.3t' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>🍑</Text>
                </View>
                <Text style={styles.name}>Atleta Femboy</Text>
                <Text style={styles.sub}>Glúteo é vida 💪</Text>
            </View>

            <View style={styles.statsGrid}>
                {stats.map((s, i) => (
                    <View key={i} style={styles.statCard}>
                        <Text style={styles.statVal}>{s.value}</Text>
                        <Text style={styles.statLbl}>{s.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💧 HIDRATAÇÃO</Text>
                <View style={styles.waterCard}>
                    <View style={styles.waterHeader}>
                        <Text style={styles.waterAmount}>{waterDrank}ml</Text>
                        <Text style={styles.waterGoal}>/ {waterGoal}ml</Text>
                    </View>
                    <View style={styles.waterBarBg}>
                        <View style={[styles.waterBar, { width: `${waterPercent}%` }]} />
                    </View>
                    <Text style={styles.waterPercent}>{Math.round(waterPercent)}% da meta diária</Text>
                    <View style={styles.waterButtons}>
                        {[150, 250, 350, 500].map(ml => (
                            <TouchableOpacity key={ml} style={styles.waterBtn} onPress={() => addWater(ml)}>
                                <Text style={styles.waterBtnText}>+{ml}ml</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>⏰ ALARME DE TREINO</Text>
                <View style={styles.settingCard}>
                    <View style={styles.settingRow}>
                        <View>
                            <Text style={styles.settingLabel}>Alarme diário</Text>
                            <Text style={styles.settingSubLabel}>Acorda às {alarmTime} para treinar</Text>
                        </View>
                        <Switch
                            value={alarmEnabled}
                            onValueChange={toggleAlarm}
                            trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(0,255,136,0.4)' }}
                            thumbColor={alarmEnabled ? '#00ff88' : '#555'}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 SEU CRONOGRAMA</Text>
                <View style={styles.scheduleInfoCard}>
                    <Text style={styles.scheduleInfoText}>📅 Segunda · Quarta · Sexta</Text>
                    <Text style={styles.scheduleInfoSub}>3 treinos por semana · Foco em Glúteo e Posterior</Text>
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070711', paddingHorizontal: 20 },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32 },
    avatar: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: 'rgba(124, 58, 237, 0.2)', justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: 'rgba(124, 58, 237, 0.5)', marginBottom: 14,
    },
    avatarText: { fontSize: 44 },
    name: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
    sub: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    statCard: {
        flex: 1, minWidth: '45%', backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 14, padding: 14,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    },
    statVal: { color: '#00ff88', fontSize: 22, fontWeight: '800', marginBottom: 4 },
    statLbl: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' },

    section: { marginBottom: 24 },
    sectionTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },

    waterCard: {
        backgroundColor: 'rgba(100, 180, 255, 0.08)', borderRadius: 20, padding: 20,
        borderWidth: 1, borderColor: 'rgba(100, 180, 255, 0.2)',
    },
    waterHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 14 },
    waterAmount: { color: '#64b4ff', fontSize: 32, fontWeight: '800' },
    waterGoal: { color: 'rgba(255,255,255,0.4)', fontSize: 16 },
    waterBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 8 },
    waterBar: { height: 8, backgroundColor: '#64b4ff', borderRadius: 4 },
    waterPercent: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 16 },
    waterButtons: { flexDirection: 'row', gap: 8 },
    waterBtn: {
        flex: 1, backgroundColor: 'rgba(100, 180, 255, 0.15)', borderRadius: 12,
        padding: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(100, 180, 255, 0.2)',
    },
    waterBtnText: { color: '#64b4ff', fontSize: 13, fontWeight: '700' },

    settingCard: {
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    },
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    settingLabel: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
    settingSubLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },

    scheduleInfoCard: {
        backgroundColor: 'rgba(0, 255, 136, 0.06)', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: 'rgba(0, 255, 136, 0.15)',
    },
    scheduleInfoText: { color: '#00ff88', fontSize: 16, fontWeight: '700', marginBottom: 6 },
    scheduleInfoSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
