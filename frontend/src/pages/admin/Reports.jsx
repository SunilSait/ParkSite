/**
 * Admin Reports / Revenue Page — V3 Financial Telemetry & Fleet Yield
 */

import { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { FaChartBar, FaRupeeSign, FaCalendarAlt, FaCar } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Reports() {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getRevenue({ days: 30 })
      .then(res => setRevenue(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
      </div>
    );
  }

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
        ticks: { color: '#64748B', font: { family: "'Inter', sans-serif", size: 10 } }, 
        grid: { display: false } 
      },
      y: { 
        ticks: { color: '#64748B', font: { family: "'Inter', sans-serif", size: 10 } }, 
        grid: { color: '#F1F5F9' } 
      },
    },
  };

  const bookingsChart = {
    labels: revenue?.daily_revenue?.map(d => d.date) || [],
    datasets: [{
      label: 'Bookings Count',
      data: revenue?.daily_revenue?.map(d => d.count || 0) || [],
      backgroundColor: 'rgba(37, 99, 235, 0.85)',
      hoverBackgroundColor: '#1D4ED8',
      borderRadius: 4,
    }],
  };

  const vehicleChart = {
    labels: revenue?.revenue_by_vehicle?.map(v => v.vehicle_type) || [],
    datasets: [{
      data: revenue?.revenue_by_vehicle?.map(v => v.revenue) || [],
      backgroundColor: ['#2563EB', '#16A34A', '#D97706', '#94A3B8'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="ps-badge ps-badge-primary" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', letterSpacing: '0.04em' }}>
              FINANCIAL AUDIT TELEMETRY
            </span>
          </div>
          <h1 className="fw-800 mb-0" style={{ fontSize: '1.5rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Revenue & Yield Analytics
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 0, marginTop: '2px' }}>
            Operational financial audits, booking volume trends, and fleet yield telemetry.
          </p>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <div className="cyber-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h2 className="fw-700 mb-0" style={{ fontSize: '1rem', color: '#0F172A', lineHeight: 1.2 }}>
                  Daily Booking Volume
                </h2>
                <span style={{ color: '#64748B', fontSize: '0.8rem' }}>Permits issued per day</span>
              </div>
              <span className="ps-badge ps-badge-primary" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>
                30-DAY WINDOW
              </span>
            </div>
            <div style={{ height: '280px' }}>
              {revenue?.daily_revenue?.length > 0 ? (
                <Bar data={bookingsChart} options={chartOptions} />
              ) : (
                <div className="text-center py-5 text-muted">No historical transactions logged yet.</div>
              )}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="cyber-card p-4 h-100 text-center">
            <div className="mb-3 pb-2 border-bottom text-start">
              <h2 className="fw-700 mb-0" style={{ fontSize: '1rem', color: '#0F172A', lineHeight: 1.2 }}>
                Revenue by Vehicle Category
              </h2>
              <span style={{ color: '#64748B', fontSize: '0.8rem' }}>Fleet category distribution</span>
            </div>
            <div style={{ height: '240px', marginTop: '1rem' }}>
              {revenue?.revenue_by_vehicle?.length > 0 ? (
                <Doughnut 
                  data={vehicleChart} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { 
                        position: 'bottom', 
                        labels: { 
                          color: '#475569', 
                          font: { family: "'Inter', sans-serif", size: 12, weight: '600' },
                          padding: 14
                        } 
                      } 
                    } 
                  }} 
                />
              ) : (
                <div className="text-center py-5 text-muted">Awaiting transactions.</div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Revenue Breakdown Table */}
      <div className="cyber-card p-4">
        <h2 className="fw-700 mb-3" style={{ fontSize: '1.05rem', color: '#0F172A' }}>
          Facility Revenue Breakdown
        </h2>
        <div className="table-responsive">
          <table className="table-cyber mb-0">
            <thead>
              <tr>
                <th>Facility Hub Name</th>
                <th>City Area</th>
                <th>Total Bookings</th>
                <th>Occupancy Yield</th>
                <th className="text-end">Gross Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue?.revenue_by_location?.map((loc, idx) => (
                <tr key={loc.location_id || idx}>
                  <td>
                    <span className="fw-700" style={{ color: '#0F172A' }}>
                      {loc.location || loc.location_name || loc.name || 'Facility Hub'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#64748B', fontSize: '0.88rem' }}>{loc.city || 'Chennai'}</span>
                  </td>
                  <td>
                    <span className="font-mono fw-700" style={{ color: '#2563EB' }}>
                      {loc.bookings ?? loc.total_bookings ?? 0}
                    </span>
                  </td>
                  <td>
                    <span className="ps-badge ps-badge-success" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>
                      <span className="ps-badge-dot"></span>
                      {loc.occupancy_rate || '78%'}
                    </span>
                  </td>
                  <td className="text-end">
                    <span className="font-mono fw-800" style={{ fontSize: '1rem', color: '#16A34A' }}>
                      {formatCurrency(loc.revenue ?? loc.total_revenue ?? 0)}
                    </span>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No location revenue data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
