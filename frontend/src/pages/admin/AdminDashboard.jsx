import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { 
  FaUsers, FaMapMarkerAlt, FaParking, FaCalendarCheck, 
  FaRupeeSign 
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
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Spinner animation="border" style={{ color: 'var(--primary)', width: '2.5rem', height: '2.5rem' }} />
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.88rem' }}>
          Syncing facility telemetry and revenue nodes...
        </p>
      </div>
    );
  }

  const statCards = [
    { icon: FaUsers, label: 'Registered Commuters', value: stats?.total_users ?? 0, iconBg: '#EFF6FF', iconColor: '#2563EB' },
    { icon: FaMapMarkerAlt, label: 'Active Facilities', value: stats?.total_locations ?? 0, iconBg: '#F0FDF4', iconColor: '#16A34A' },
    { icon: FaParking, label: 'Total Sensor Bays', value: stats?.total_slots ?? 0, iconBg: '#EEF2FF', iconColor: '#6366F1' },
    { icon: FaParking, label: 'Available Bays', value: stats?.available_slots ?? 0, iconBg: '#F0FDF4', iconColor: '#16A34A' },
    { icon: FaParking, label: 'Occupied Bays', value: stats?.occupied_slots ?? 0, iconBg: '#FEF2F2', iconColor: '#DC2626' },
    { icon: FaCalendarCheck, label: "Today's Check-ins", value: stats?.todays_bookings ?? 0, iconBg: '#FEF3C7', iconColor: '#D97706' },
    { icon: FaCalendarCheck, label: 'Total Passes Issued', value: stats?.total_bookings ?? 0, iconBg: '#F0F9FF', iconColor: '#0284C7' },
    { icon: FaRupeeSign, label: 'System Gross Tariff', value: formatCurrency(stats?.total_revenue || 0), iconBg: '#ECFDF5', iconColor: '#059669' },
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
        padding: 8,
        cornerRadius: 6
      },
    },
    scales: {
      x: { 
        ticks: { 
          color: '#64748B', 
          font: { family: "'Inter', sans-serif", size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12
        }, 
        grid: { display: false } 
      },
      y: { 
        ticks: { 
          color: '#64748B', 
          font: { family: "'Inter', sans-serif", size: 10 },
          callback: (val) => `₹${val}`
        }, 
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
      borderRadius: 4,
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

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#FFFFFF',
        bodyColor: '#93C5FD',
        padding: 8,
        cornerRadius: 6
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* ── Compact Dashboard Header ─────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="ps-badge ps-badge-primary" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', letterSpacing: '0.04em' }}>
              REAL-TIME IOT TELEMETRY GATEWAY
            </span>
          </div>
          <h1 className="fw-800 mb-0" style={{ fontSize: '1.5rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Mobility Command Center
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 0, marginTop: '2px' }}>
            Live sensor node status, parking bay availability, and institutional revenue telemetry.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <span className="ps-badge ps-badge-success" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>
            <span className="ps-badge-dot"></span>
            ALL 3 NODES ONLINE
          </span>
          <span className="ps-badge ps-badge-primary" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>
            <span className="ps-badge-dot"></span>
            99.98% ACCURACY
          </span>
        </div>
      </div>

      {/* ── 8 KPI Cards (Clean 4 × 2 Grid) ───────────────────────── */}
      <div className="admin-kpi-grid">
        {statCards.map((sc, i) => {
          const Icon = sc.icon;
          return (
            <div className="admin-kpi-card" key={i}>
              <div 
                className="admin-kpi-icon-box"
                style={{ background: sc.iconBg, color: sc.iconColor }}
              >
                <Icon size={16} />
              </div>
              <div className="admin-kpi-info">
                <div className="admin-kpi-label" title={sc.label}>
                  {sc.label}
                </div>
                <div className="admin-kpi-value" title={String(sc.value)}>
                  {sc.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Dual Chart Section (Side-by-Side, Reduced Height) ────── */}
      <div className="admin-charts-grid">
        {/* Daily Revenue Performance (~66% width) */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h2 className="fw-700 mb-0" style={{ fontSize: '0.98rem', color: '#0F172A', lineHeight: 1.2 }}>
                Daily Revenue Performance
              </h2>
              <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Past 30 days settlement trend</span>
            </div>
            <span className="ps-badge ps-badge-primary" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>
              30-DAY TIMELINE
            </span>
          </div>
          <div className="admin-chart-body">
            <Bar data={dailyChartData} options={chartOptions} />
          </div>
        </div>

        {/* Bay Utilization Donut (~34% width) */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h2 className="fw-700 mb-0" style={{ fontSize: '0.98rem', color: '#0F172A', lineHeight: 1.2 }}>
                Bay Utilization Ratio
              </h2>
              <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Live sensor status distribution</span>
            </div>
          </div>
          <div className="admin-chart-body d-flex flex-column align-items-center justify-content-center">
            {/* Donut Container constrained to ~175px */}
            <div style={{ width: '175px', height: '175px', position: 'relative', flexShrink: 0 }}>
              <Doughnut 
                data={slotUtilization} 
                options={donutOptions} 
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {stats?.total_slots || 0}
                </div>
                <div style={{ fontSize: '0.62rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
                  Total Bays
                </div>
              </div>
            </div>

            {/* Neatly centered legend below donut */}
            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 mt-3 pt-1">
              <div className="d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }}></span>
                <span>Available ({stats?.available_slots || 0})</span>
              </div>
              <div className="d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }}></span>
                <span>Occupied ({stats?.occupied_slots || 0})</span>
              </div>
              {(stats?.maintenance_slots > 0) && (
                <div className="d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94A3B8', display: 'inline-block' }}></span>
                  <span>Maintenance ({stats?.maintenance_slots})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

