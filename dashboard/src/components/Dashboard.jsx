import React, { useState, useEffect } from 'react';
import { Activity, Shield, Battery, Clock, Dumbbell, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import '../styles/globals.css';

const MOCK_DATA = [
    { name: 'Seg', hr: 145, duration: 45 },
    { name: 'Ter', hr: 120, duration: 30 },
    { name: 'Qua', hr: 155, duration: 52 },
    { name: 'Qui', hr: 110, duration: 35 },
    { name: 'Sex', hr: 160, duration: 48 },
];

const Dashboard = () => {
    return (
        <div className="min-h-screen p-8">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter neon-text">FITNESS C2 <span className="text-white/20">|</span> AEGIS OS</h1>
                    <p className="text-white/40 mt-1">SISTEMA DE MONITORAMENTO DE TREINO V1.0</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-card flex items-center py-2 px-4">
                        <span className="status-indicator status-online"></span>
                        <span className="text-xs font-mono uppercase tracking-widest text-white/60">Servidor: {import.meta.env.VITE_VPS_IP || 'C2_SECURE'}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard icon={<Dumbbell size={20} />} label="Treinos" value="12" sub="Mês atual" />
                <StatCard icon={<Clock size={20} />} label="Média Duração" value="48m" sub="+5m vs sem. passada" />
                <StatCard icon={<Heart size={20} />} label="FC Máxima" value="168" sub="BPM" color="var(--accent-red)" />
                <StatCard icon={<Shield size={20} />} label="Status C2" value="SECURE" sub="Encriptado" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-emerald-400" /> INTENSIDADE (HR)
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_DATA}>
                                <defs>
                                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#00ff88' }}
                                />
                                <Area type="monotone" dataKey="hr" stroke="#00ff88" fillOpacity={1} fill="url(#colorHr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Clock size={18} className="text-emerald-400" /> VOLUME DE TREINO
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Line type="monotone" dataKey="duration" stroke="#00ff88" strokeWidth={2} dot={{ fill: '#00ff88' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, sub, color = 'rgba(255,255,255,0.4)' }) => (
    <div className="glass-card">
        <div className="flex justify-between items-start mb-4">
            <div style={{ color }}>{icon}</div>
            <span className="text-[10px] font-mono tracking-tighter text-white/20 uppercase">Aegis // Monitor</span>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</div>
        <div className="text-[10px] text-white/20 mt-2">{sub}</div>
    </div>
);

export default Dashboard;
