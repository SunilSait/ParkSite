/**
 * Admin Dashboard — V3 Cyber Command Center Overview
 */

import { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { 
  FaUsers, FaMapMarkerAlt, FaParking, FaCalendarCheck, 
  FaRupeeSign, FaChartLine, FaShieldAlt, FaBolt 
} from 'react-icons/fa';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes] = await Promise.all([
          adminService.getDashboard(),
          adminService.getRevenue({ days: 30 }),
        ]);
        setStats(statsRes.data.stats);
        setRevenue(revenueRes.data);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: 'var(--cyan-neon)', width: '3rem', height: '3rem' }} />
        <p style={{ color: '#94a3b8', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
          Syncing facility telemetry and revenue nodes...
        </p>
      </div>
    );
  }

  const statCards = [
    { icon: FaUsers, label: 'Registered Commuters', value: stats?.total_users || 0, color: 'var(--cyan-neon)', glow: 'rgba(0,242,254,0.3)' },
    { icon: FaMapMarkerAlt, label: 'Active Facilities', value: stats?.total_locations || 0, color: 'var(--emerald-neon)', glow: 'rgba(16,231,157,0.3)' },
    { icon: FaParking, label: 'Total Sensor Bays', value: stats?.total_slots || 0, color: '#c084fc', glow: 'rgba(192,132,252,0.3)' },
    { icon: FaParking, label: 'Available Bays', value: stats?.available_slots || 0, color: '#34d399', glow: 'rgba(52,211,153,0.3)' },
    { icon: FaParking, label: 'Occupied Bays', value: stats?.occupied_slots || 0, color: '#f87171', glow: 'rgba(248,113,113,0.3)' },
    { icon: FaCalendarCheck, label: "Today's Check-ins", value: stats?.todays_bookings || 0, color: '#fbbf24', glow: 'rgba(251,191,36,0.3)' },
    { icon: FaCalendarCheck, label: 'Total Passes Issued', value: stats?.total_bookings || 0, color: '#60a5fa', glow: 'rgba(96,165,250,0.3)' },
    { icon: FaRupeeSign, label: 'System Gross Tariff', value: formatCurrency(stats?.total_revenue || 0), color: 'var(--emerald-neon)', glow: 'rgba(16,231,157,0.3)', isStr: true },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        backgroundColor: '#0c1328', 
        titleColor: '#f8fafc', 
        bodyColor: '#38bdf8', 
        borderColor: 'rgba(0, 242, 254, 0.4)', 
        borderWidth: 1 
      },
    },
    scales: {
      x: { 
        ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 10 } }, 
        grid: { color: 'rgba(255, 255, 255, 0.05)' } 
      },
      y: { 
        ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace" } }, 
        grid: { color: 'rgba(255, 255, 255, 0.05)' } 
      },
    },
  };

  const dailyChartData = {
    labels: revenue?.daily_revenue?.map(d => d.date) || [],
    datasets: [{
      label: 'Tariff Revenue (₹)',
      data: revenue?.daily_revenue?.map(d => d.revenue) || [],
      backgroundColor: 'rgba(0, 242, 254, 0.4)',
      borderColor: '#00f2fe',
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const slotUtilization = {
    labels: ['Available', 'Occupied', 'Maintenance'],
    datasets: [{
      data: [stats?.available_slots || 0, stats?.occupied_slots || 0, stats?.maintenance_slots || 0],
      backgroundColor: ['#10e79d', '#ff4757', '#64748b'],
      borderWidth: 0,
    }],
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 animate-fade-down">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="radar-dot" style={{ background: 'var(--emerald-neon)' }}></span>
            <span className="font-mono text-muted" style={{ fontSize: '0.78rem' }}>
              REAL-TIME IOT TELEMETRY TELEMETRY GATEWAY
            </span>
          </div>
          <h2 className="fw-900 text-white mb-0" style={{ fontSize: '2.1rem' }}>
            Mobility Command Center
          </h2>
        </div>
        <div className="d-flex gap-2">
          <span className="badge-cyber badge-cyber-emerald">ALL 3 NODES ONLINE</span>
          <span className="badge-cyber badge-cyber-cyan">99.98% ACCURACY</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <Row className="g-3 mb-4">
        {statCards.map((sc, i) => {
          const Icon = sc.icon;
          return (
            <Col sm={6} lg={3} key={i}>
              <div className="cyber-card p-3 h-100" style={{ borderColor: sc.glow }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${sc.glow}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: sc.color
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-mono text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>
                      {sc.label}
                    </div>
                    <div className="font-display fw-800 text-white" style={{ fontSize: '1.45rem', lineHeight: 1.1 }}>
                      {sc.value}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <div className="cyber-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-700 text-white mb-0">Daily Revenue Performance</h5>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Past 30 days settlement trend</span>
              </div>
              <span className="badge-cyber badge-cyber-cyan font-mono">30-DAY TIMELINE</span>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={dailyChartData} options={chartOptions} />
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="cyber-card p-4 h-100 text-center">
            <h5 className="fw-700 text-white mb-1">Bay Utilization Ratio</h5>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Live sensor status distribution</span>
            <div style={{ height: '240px', marginTop: '1.5rem' }}>
              <Doughnut 
                data={slotUtilization} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 11 } } } } 
                }} 
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
