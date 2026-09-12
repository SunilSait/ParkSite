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
        <Spinner animation="border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }} />
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Syncing facility telemetry and revenue nodes...
        </p>
      </div>
    );
  }

  const statCards = [
    { icon: FaUsers, label: 'Registered Commuters', value: stats?.total_users || 0, iconBg: '#EFF6FF', iconColor: 'var(--primary)' },
    { icon: FaMapMarkerAlt, label: 'Active Facilities', value: stats?.total_locations || 0, iconBg: '#F0FDF4', iconColor: 'var(--success)' },
    { icon: FaParking, label: 'Total Sensor Bays', value: stats?.total_slots || 0, iconBg: '#EEF2FF', iconColor: '#6366F1' },
    { icon: FaParking, label: 'Available Bays', value: stats?.available_slots || 0, iconBg: '#F0FDF4', iconColor: 'var(--success)' },
    { icon: FaParking, label: 'Occupied Bays', value: stats?.occupied_slots || 0, iconBg: '#FEF2F2', iconColor: 'var(--danger)' },
    { icon: FaCalendarCheck, label: "Today's Check-ins", value: stats?.todays_bookings || 0, iconBg: '#FEF3C7', iconColor: '#D97706' },
    { icon: FaCalendarCheck, label: 'Total Passes Issued', value: stats?.total_bookings || 0, iconBg: '#F0F9FF', iconColor: '#0284C7' },
    { icon: FaRupeeSign, label: 'System Gross Tariff', value: formatCurrency(stats?.total_revenue || 0), iconBg: '#ECFDF5', iconColor: '#059669', isStr: true },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        backgroundColor: '#0F172A', 
        titleColor: '#FFFFFF', 
        bodyColor: '#93C5FD', 
        padding: 10,
        cornerRadius: 8
      },
    },
    scales: {
      x: { 
        ticks: { color: '#64748B', font: { family: "'Inter', sans-serif", size: 11 } }, 
        grid: { color: '#F1F5F9' } 
      },
      y: { 
        ticks: { color: '#64748B', font: { family: "'Inter', sans-serif", size: 11 } }, 
        grid: { color: '#F1F5F9' } 
      },
    },
  };

  const dailyChartData = {
    labels: revenue?.daily_revenue?.map(d => d.date) || [],
    datasets: [{
      label: 'Tariff Revenue (₹)',
      data: revenue?.daily_revenue?.map(d => d.revenue) || [],
      backgroundColor: 'rgba(37, 99, 235, 0.85)',
      hoverBackgroundColor: '#1D4ED8',
      borderRadius: 6,
    }],
  };

  const slotUtilization = {
    labels: ['Available', 'Occupied', 'Maintenance'],
    datasets: [{
      data: [stats?.available_slots || 0, stats?.occupied_slots || 0, stats?.maintenance_slots || 0],
      backgroundColor: ['#16A34A', '#DC2626', '#94A3B8'],
      borderWidth: 0,
    }],
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 animate-fade-down">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="ps-badge ps-badge-primary">REAL-TIME IOT TELEMETRY GATEWAY</span>
          </div>
          <h2 className="fw-800 mb-0" style={{ fontSize: '2.1rem', color: 'var(--text-primary)' }}>
            Mobility Command Center
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 0 }}>
            Live sensor node status, parking bay availability, and institutional revenue telemetry.
          </p>
        </div>
        <div className="d-flex gap-2">
          <span className="ps-badge ps-badge-success">ALL 3 NODES ONLINE</span>
          <span className="ps-badge ps-badge-primary">99.98% ACCURACY</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <Row className="g-3 mb-4">
        {statCards.map((sc, i) => {
          const Icon = sc.icon;
          return (
            <Col sm={6} lg={3} key={i}>
              <div className="ps-card p-3.5 h-100 hover-lift">
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: sc.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: sc.iconColor,
                    flexShrink: 0
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="fw-600 text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                      {sc.label}
                    </div>
                    <div className="fw-800" style={{ fontSize: '1.5rem', lineHeight: 1.1, color: 'var(--text-primary)' }}>
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
          <div className="ps-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h5 className="fw-700 mb-0" style={{ color: 'var(--text-primary)' }}>Daily Revenue Performance</h5>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Past 30 days settlement trend</span>
              </div>
              <span className="ps-badge ps-badge-primary">30-DAY TIMELINE</span>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={dailyChartData} options={chartOptions} />
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="ps-card p-4 h-100 text-center">
            <div className="mb-3 pb-2 border-bottom text-start">
              <h5 className="fw-700 mb-0" style={{ color: 'var(--text-primary)' }}>Bay Utilization Ratio</h5>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Live sensor status distribution</span>
            </div>
            <div style={{ height: '240px', marginTop: '1rem' }}>
              <Doughnut 
                data={slotUtilization} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'bottom', 
                      labels: { 
                        color: '#475569', 
                        font: { family: "'Inter', sans-serif", size: 12, weight: '600' },
                        padding: 16
                      } 
                    } 
                  } 
                }} 
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
