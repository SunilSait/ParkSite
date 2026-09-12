/**
 * User Dashboard — V3 Commuter Mobility Console
 * Telemetry counters, active digital keycard widget, quick actions, and cyber table.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Table } from 'react-bootstrap';
import { 
  FaCalendarCheck, FaCalendarAlt, FaTimesCircle, FaCheckCircle, 
  FaPlus, FaArrowRight, FaEye, FaParking, FaQrcode, FaMapMarkerAlt, FaBolt 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

// Animated counter hook
function useCounter(target, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16)) || 1;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

function StatCard({ icon: Icon, label, value, colorClass, borderGlow }) {
  const animatedValue = useCounter(typeof value === 'number' ? value : 0);
  return (
    <Col sm={6} lg={3}>
      <div className="cyber-card p-4 h-100" style={{ borderColor: borderGlow }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${borderGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={22} className={colorClass} />
          </div>
          <div>
            <div className="font-mono text-muted text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              {label}
            </div>
            <div className="font-display fw-800 text-white" style={{ fontSize: '1.8rem', lineHeight: 1.1 }}>
              {typeof value === 'number' ? animatedValue : value}
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingService.getAll();
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const activeBooking = bookings.find(b => b.status === 'confirmed');
  const recentBookings = bookings.slice(0, 5);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--cyan-neon)', width: '3rem', height: '3rem' }} />
        <p style={{ color: '#94a3b8', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
          Retrieving commuter profile and booking telemetry...
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* ── Welcome Header ──────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 animate-fade-down">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge-cyber badge-cyber-emerald">COMMUTER ACCOUNT ACTIVE</span>
          </div>
          <h2 className="fw-900 text-white mb-1" style={{ fontSize: '2.1rem' }}>
            Welcome back, <span className="gradient-text-cyber">{user?.name?.split(' ')[0] || 'Driver'}</span> 👋
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem' }} className="mb-0">
            Real-time summary of your parking permits, active QR passes, and spend history.
          </p>
        </div>

        <Button as={Link} to="/locations" className="btn-cyber-primary py-2 px-4">
          <FaPlus /> Book New Bay
        </Button>
      </div>

      {/* ── Active Ticket Pass Banner (If active booking exists) ─ */}
      {activeBooking && (
        <div className="cyber-card p-4 mb-4 animate-fade-up" style={{
          background: 'linear-gradient(135deg, rgba(16, 231, 157, 0.12), rgba(0, 242, 254, 0.08), rgba(6, 10, 26, 0.95))',
          borderColor: 'var(--emerald-neon)'
        }}>
          <Row className="align-items-center g-3">
            <Col md={8}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="radar-dot" style={{ background: 'var(--emerald-neon)' }}></span>
                <span className="font-mono fw-700 text-success" style={{ fontSize: '0.8rem' }}>
                  ACTIVE RESERVATION IN PROGRESS
                </span>
                <span className="badge-cyber badge-cyber-cyan py-0 px-2" style={{ fontSize: '0.68rem' }}>
                  REF: {activeBooking.booking_reference}
                </span>
              </div>
              <h4 className="fw-800 text-white mb-1">
                {activeBooking.location?.name} — Bay #{activeBooking.slot?.slot_number}
              </h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem' }} className="mb-0">
                <FaCalendarAlt className="me-1 text-warning" /> {formatDate(activeBooking.booking_date)} • 
                <span className="font-mono text-info ms-1">{formatTime(activeBooking.start_time)} to {formatTime(activeBooking.end_time)}</span>
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button as={Link} to={`/user/booking/${activeBooking.id}`} className="btn-cyber-emerald py-2 px-4">
                <FaQrcode className="me-2" /> Display QR Keycard
              </Button>
            </Col>
          </Row>
        </div>
      )}

      {/* ── Stat Counters ───────────────────────────────── */}
      <Row className="g-3 mb-4">
        <StatCard 
          icon={FaCalendarAlt} 
          label="Total Bookings" 
          value={stats.total} 
          colorClass="text-info" 
          borderGlow="rgba(0, 242, 254, 0.3)" 
        />
        <StatCard 
          icon={FaCalendarCheck} 
          label="Active Bays" 
          value={stats.confirmed} 
          colorClass="text-success" 
          borderGlow="rgba(16, 231, 157, 0.3)" 
        />
        <StatCard 
          icon={FaCheckCircle} 
          label="Completed" 
          value={stats.completed} 
          colorClass="text-primary" 
          borderGlow="rgba(157, 78, 221, 0.3)" 
        />
        <StatCard 
          icon={FaTimesCircle} 
          label="Cancelled" 
          value={stats.cancelled} 
          colorClass="text-danger" 
          borderGlow="rgba(255, 51, 102, 0.3)" 
        />
      </Row>

      {/* ── Navigation Shortcut Cards ───────────────────── */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Link to="/locations" style={{ textDecoration: 'none' }}>
            <div className="cyber-card p-4 h-100">
              <FaParking size={28} color="#00f2fe" className="mb-2" />
              <h5 className="fw-700 text-white mb-1">Find & Reserve</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: 0 }}>
                Explore live sensors across Chennai hubs
              </p>
            </div>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/user/bookings" style={{ textDecoration: 'none' }}>
            <div className="cyber-card p-4 h-100">
              <FaCalendarCheck size={28} color="#10e79d" className="mb-2" />
              <h5 className="fw-700 text-white mb-1">Pass History</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: 0 }}>
                View complete archive of QR permits and receipts
              </p>
            </div>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/user/profile" style={{ textDecoration: 'none' }}>
            <div className="cyber-card p-4 h-100">
              <FaCheckCircle size={28} color="#ffb703" className="mb-2" />
              <h5 className="fw-700 text-white mb-1">Profile & Vehicle</h5>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: 0 }}>
                Update contact info and security settings
              </p>
            </div>
          </Link>
        </Col>
      </Row>

      {/* ── Recent Activity Table ────────────────────────── */}
      <div className="cyber-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
          <div>
            <h5 className="fw-700 text-white mb-0">Recent Parking Records</h5>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Latest confirmed transactions</span>
          </div>
          <Button as={Link} to="/user/bookings" className="btn-cyber-outline py-1 px-3" style={{ fontSize: '0.82rem' }}>
            View All History <FaArrowRight size={11} className="ms-1" />
          </Button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-5">
            <FaParking size={48} style={{ color: 'rgba(255,255,255,0.15)' }} className="mb-3" />
            <h6 className="text-white">No Bookings Recorded Yet</h6>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Your reservations and digital QR passes will appear here once booked.
            </p>
            <Button as={Link} to="/locations" className="btn-cyber-primary py-2 px-4">
              Explore Available Slots
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber">
              <thead>
                <tr>
                  <th>Pass Reference</th>
                  <th>Hub Location</th>
                  <th>Bay No.</th>
                  <th>Date</th>
                  <th>Window</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="font-mono fw-700" style={{ color: 'var(--cyan-neon)' }}>
                        {b.booking_reference}
                      </span>
                    </td>
                    <td>
                      <span className="fw-600 text-white">{b.location?.name || '—'}</span>
                    </td>
                    <td>
                      <span className="badge-cyber badge-cyber-cyan py-1 px-2">
                        {b.slot?.slot_number || '—'}
                      </span>
                    </td>
                    <td className="font-mono text-muted" style={{ fontSize: '0.85rem' }}>
                      {formatDate(b.booking_date)}
                    </td>
                    <td className="font-mono text-light" style={{ fontSize: '0.82rem' }}>
                      {formatTime(b.start_time)} - {formatTime(b.end_time)}
                    </td>
                    <td>
                      <span className="font-mono fw-700 text-success">
                        {formatCurrency(b.total_amount)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-cyber ${
                        b.status === 'confirmed' ? 'badge-cyber-emerald' :
                        b.status === 'cancelled' ? 'badge-cyber-rose' :
                        'badge-cyber-cyan'
                      }`}>
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button 
                        as={Link} 
                        to={`/user/booking/${b.id}`} 
                        className="btn-cyber-outline py-1 px-2"
                        title="View Digital QR Pass"
                      >
                        <FaEye />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
