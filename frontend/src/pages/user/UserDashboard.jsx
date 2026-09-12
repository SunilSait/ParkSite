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

function StatCard({ icon: Icon, label, value, iconBg, iconColor }) {
  const animatedValue = useCounter(typeof value === 'number' ? value : 0);
  return (
    <Col sm={6} lg={3}>
      <div className="ps-card p-4 h-100">
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={22} color={iconColor} />
          </div>
          <div>
            <div className="fw-600 text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              {label}
            </div>
            <div className="fw-800" style={{ fontSize: '1.8rem', lineHeight: 1.1, color: 'var(--text-primary)' }}>
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
        <Spinner animation="border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }} />
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
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
            <span className="ps-badge ps-badge-success">COMMUTER ACCOUNT ACTIVE</span>
          </div>
          <h2 className="fw-800 mb-1" style={{ fontSize: '2.1rem', color: 'var(--text-primary)' }}>
            Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0] || 'Driver'}</span> 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }} className="mb-0">
            Real-time summary of your parking permits, active QR passes, and spend history.
          </p>
        </div>

        <Button as={Link} to="/locations" className="ps-btn-primary py-2 px-4">
          <FaPlus /> Book New Bay
        </Button>
      </div>

      {/* ── Active Ticket Pass Banner (If active booking exists) ─ */}
      {activeBooking && (
        <div className="ps-card p-4 mb-4 animate-fade-up" style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
          borderLeft: '4px solid var(--success)',
          border: '1px solid #BBF7D0'
        }}>
          <Row className="align-items-center g-3">
            <Col md={8}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                <span className="fw-700 text-success" style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                  ACTIVE RESERVATION IN PROGRESS
                </span>
                <span className="ps-badge ps-badge-primary py-0 px-2" style={{ fontSize: '0.72rem' }}>
                  REF: {activeBooking.booking_reference}
                </span>
              </div>
              <h4 className="fw-800 mb-1" style={{ color: 'var(--text-primary)' }}>
                {activeBooking.location?.name} — Bay #{activeBooking.slot?.slot_number}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }} className="mb-0">
                <FaCalendarAlt className="me-1" color="#D97706" /> {formatDate(activeBooking.booking_date)} • 
                <span className="fw-600 ms-1" style={{ color: 'var(--primary)' }}>{formatTime(activeBooking.start_time)} to {formatTime(activeBooking.end_time)}</span>
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button as={Link} to={`/user/booking/${activeBooking.id}`} className="ps-btn-primary py-2 px-4" style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>
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
          iconBg="#EFF6FF"
          iconColor="var(--primary)"
        />
        <StatCard 
          icon={FaCalendarCheck} 
          label="Active Bays" 
          value={stats.confirmed} 
          iconBg="#F0FDF4"
          iconColor="var(--success)"
        />
        <StatCard 
          icon={FaCheckCircle} 
          label="Completed" 
          value={stats.completed} 
          iconBg="#EEF2FF"
          iconColor="#6366F1"
        />
        <StatCard 
          icon={FaTimesCircle} 
          label="Cancelled" 
          value={stats.cancelled} 
          iconBg="#FEF2F2"
          iconColor="var(--danger)"
        />
      </Row>

      {/* ── Navigation Shortcut Cards ───────────────────── */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Link to="/locations" style={{ textDecoration: 'none' }}>
            <div className="ps-card p-4 h-100 hover-lift">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <FaParking size={22} color="var(--primary)" />
              </div>
              <h5 className="fw-700 mb-1" style={{ color: 'var(--text-primary)' }}>Find & Reserve</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: 0 }}>
                Explore live sensors across Chennai hubs
              </p>
            </div>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/user/bookings" style={{ textDecoration: 'none' }}>
            <div className="ps-card p-4 h-100 hover-lift">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <FaCalendarCheck size={22} color="var(--success)" />
              </div>
              <h5 className="fw-700 mb-1" style={{ color: 'var(--text-primary)' }}>Pass History</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: 0 }}>
                View complete archive of QR permits and receipts
              </p>
            </div>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/user/profile" style={{ textDecoration: 'none' }}>
            <div className="ps-card p-4 h-100 hover-lift">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <FaCheckCircle size={22} color="#D97706" />
              </div>
              <h5 className="fw-700 mb-1" style={{ color: 'var(--text-primary)' }}>Profile & Vehicle</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: 0 }}>
                Update contact info and security settings
              </p>
            </div>
          </Link>
        </Col>
      </Row>

      {/* ── Recent Activity Table ────────────────────────── */}
      <div className="ps-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h5 className="fw-700 mb-0" style={{ color: 'var(--text-primary)' }}>Recent Parking Records</h5>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Latest confirmed transactions</span>
          </div>
          <Button as={Link} to="/user/bookings" className="ps-btn-outline py-1 px-3" style={{ fontSize: '0.82rem' }}>
            View All History <FaArrowRight size={11} className="ms-1" />
          </Button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-5">
            <FaParking size={48} style={{ color: '#CBD5E1' }} className="mb-3" />
            <h6 style={{ color: 'var(--text-primary)' }}>No Bookings Recorded Yet</h6>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Your reservations and digital QR passes will appear here once booked.
            </p>
            <Button as={Link} to="/locations" className="ps-btn-primary py-2 px-4">
              Explore Available Slots
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead style={{ background: '#F8FAFC' }}>
                <tr style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                  <th className="py-2">Pass Reference</th>
                  <th className="py-2">Hub Location</th>
                  <th className="py-2">Bay No.</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Window</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td>
                      <span className="fw-700 font-mono" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
                        {b.booking_reference}
                      </span>
                    </td>
                    <td>
                      <span className="fw-600" style={{ color: 'var(--text-primary)' }}>{b.location?.name || '—'}</span>
                    </td>
                    <td>
                      <span className="ps-badge ps-badge-primary py-1 px-2">
                        {b.slot?.slot_number || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {formatDate(b.booking_date)}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {formatTime(b.start_time)} - {formatTime(b.end_time)}
                    </td>
                    <td>
                      <span className="fw-700" style={{ color: 'var(--success)' }}>
                        {formatCurrency(b.total_amount)}
                      </span>
                    </td>
                    <td>
                      <span className={`ps-badge ${
                        b.status === 'confirmed' ? 'ps-badge-success' :
                        b.status === 'cancelled' ? 'ps-badge-danger' :
                        'ps-badge-primary'
                      }`}>
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button 
                        as={Link} 
                        to={`/user/booking/${b.id}`} 
                        className="ps-btn-outline py-1 px-2"
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
