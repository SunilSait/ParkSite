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

  const bookingsChart = {
    labels: revenue?.daily_revenue?.map(d => d.date) || [],
    datasets: [{
      label: 'Reservations',
      data: revenue?.daily_revenue?.map(d => d.bookings) || [],
      backgroundColor: 'rgba(0, 242, 254, 0.5)',
      borderColor: '#00f2fe',
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const vehicleChart = {
    labels: revenue?.revenue_by_vehicle?.map(v => v.vehicle_type) || [],
    datasets: [{
      data: revenue?.revenue_by_vehicle?.map(v => v.revenue) || [],
      backgroundColor: ['#00f2fe', '#10e79d', '#ffb703'],
      borderWidth: 0,
    }],
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 animate-fade-down">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge-cyber badge-cyber-emerald">FINANCIAL AUDIT TELEMETRY</span>
          </div>
          <h2 className="fw-900 text-white mb-0" style={{ fontSize: '2rem' }}>
            Revenue & Yield Analytics
          </h2>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <div className="cyber-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-700 text-white mb-0">Daily Booking Volume</h5>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Permits issued per day</span>
              </div>
              <span className="badge-cyber badge-cyber-cyan font-mono">30-DAY WINDOW</span>
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
            <h5 className="fw-700 text-white mb-1">Revenue by Vehicle Category</h5>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Fleet category distribution</span>
            <div style={{ height: '240px', marginTop: '1.5rem' }}>
              {revenue?.revenue_by_vehicle?.length > 0 ? (
                <Doughnut 
                  data={vehicleChart} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 11 } } } } 
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
        <h5 className="fw-700 text-white mb-3">Facility Revenue Breakdown</h5>
        <div className="table-responsive">
          <table className="table-cyber">
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
              {revenue?.revenue_by_location?.map((loc) => (
                <tr key={loc.location_id}>
                  <td>
                    <span className="fw-700 text-white">{loc.location_name}</span>
                  </td>
                  <td>
                    <span style={{ color: '#cbd5e1' }}>{loc.city || 'Chennai'}</span>
                  </td>
                  <td>
                    <span className="font-mono text-info">{loc.total_bookings}</span>
                  </td>
                  <td>
                    <span className="badge-cyber badge-cyber-emerald py-1 px-2 font-mono">
                      {loc.occupancy_rate || '78%'}
                    </span>
                  </td>
                  <td className="text-end">
                    <span className="font-mono fw-800 text-success" style={{ fontSize: '1.05rem' }}>
                      {formatCurrency(loc.total_revenue)}
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
