import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Activity,
  Users,
  Dumbbell,
  Heart,
  TrendingUp,
  LogOut,
  Shield,
  Zap,
  RefreshCcw,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import './index.css';

const API_IP = import.meta.env.VITE_VPS_IP || '82.112.245.99';
const API_URL = `http://${API_IP}:3000/api`;

const App = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    activeAgente: 1,
    avgHeartRate: 0,
    totalVolume: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/workouts/logs`);
      const data = response.data;
      setLogs(data);

      // Calculate basic stats
      const total = data.length;
      const avgHR = data.length > 0
        ? Math.round(data.reduce((acc, curr) => acc + curr.heartRate, 0) / data.length)
        : 0;

      setStats({
        totalWorkouts: total,
        activeAgente: 1,
        avgHeartRate: avgHR,
        totalVolume: total * 4 // Example calculation
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  const chartData = logs.slice(0, 10).reverse().map(log => ({
    name: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hr: log.heartRate,
    duration: log.duration
  }));

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <Shield color="#00ff88" size={32} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>AEGIS C2</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '12px', background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={20} />
            <span>Dashboard</span>
          </div>
          <div style={{ padding: '12px', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={20} />
            <span>Agentes</span>
          </div>
          <div style={{ padding: '12px', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Dumbbell size={20} />
            <span>Exercícios</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto', padding: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
          v1.0.4-stable
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>VISÃO GERAL DO TERMINAL</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Monitoramento em tempo real do servidor: {API_IP}</p>
          </div>
          <button className="glass" style={{ padding: '10px', color: '#fff' }} onClick={fetchData}>
            <RefreshCcw size={20} />
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid-stats">
          <div className="stat-card glass neo-shadow">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Zap color="#00ff88" size={24} />
              <TrendingUp color="#00ff88" size={16} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>TOTAL DE TREINOS</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalWorkouts}</div>
          </div>

          <div className="stat-card glass neo-shadow">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Heart color="#ff4444" size={24} />
              <ArrowUpRight color="#00ff88" size={16} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>FREQ. CARDÍACA MÉDIA</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff4444' }}>{stats.avgHeartRate} <span style={{ fontSize: '0.8rem' }}>BPM</span></div>
          </div>

          <div className="stat-card glass neo-shadow">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Activity color="#00ff88" size={24} />
              <div className="status-indicator status-online"></div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>AGENTES ATIVOS</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeAgente}</div>
          </div>
        </section>

        {/* Chart Section */}
        <section className="chart-section glass neo-shadow">
          <h3 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: '600' }}>ATIVIDADE DO AGENTE (BPM / TEMPO)</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00ff88' }}
                />
                <Area type="monotone" dataKey="hr" stroke="#00ff88" fillOpacity={1} fill="url(#colorHr)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Table Section */}
        <section className="table-section glass neo-shadow">
          <h3 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: '600' }}>LOGS DE TRANSMISSÃO</h3>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Sincronizando dados...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>HORÁRIO</th>
                  <th>EXERCÍCIO</th>
                  <th>BPM</th>
                  <th>DURAÇÃO</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '14px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '500' }}>{log.exerciseName}</td>
                    <td style={{ color: log.heartRate > 100 ? '#ff4444' : '#00ff88' }}>{log.heartRate} BPM</td>
                    <td>{Math.floor(log.duration / 60)}m {log.duration % 60}s</td>
                    <td>
                      <span className="status-indicator status-online"></span>
                      <span style={{ fontSize: '12px', color: '#00ff88' }}>SYNCED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
