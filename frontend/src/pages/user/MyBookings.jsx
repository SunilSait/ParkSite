/**
 * My Bookings Page — V3 Commuter Parking Pass Archive
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Spinner, Form } from 'react-bootstrap';
import { FaCalendarAlt, FaEye, FaArrowLeft, FaParking, FaFilter } from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await bookingService.getAll(params);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [statusFilter]);

  return (
    <Container className="py-4">
      {/* Back button */}
      <Link to="/user/dashboard" className="btn p-0 mb-3 d-inline-flex align-items-center gap-2 border-0 text-decoration-none" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600 }}>
        <FaArrowLeft /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="ps-badge ps-badge-primary">COMMUTER PASS VAULT</span>
          </div>
          <h2 className="fw-800 mb-0" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
            My Booking Archive
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 0 }}>
            Complete historical record of issued passes and access permits.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <FaFilter className="text-muted" />
          <Form.Select 
            style={{ width: '180px' }} 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>
      </div>

      {/* Bookings Card Table */}
      <div className="ps-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--primary)' }} />
            <p className="mt-2" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading passes...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5">
            <FaCalendarAlt size={48} style={{ color: '#CBD5E1' }} className="mb-3" />
            <h5 className="fw-700" style={{ color: 'var(--text-primary)' }}>No Reservations Found</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>
              No parking passes found matching the current filter.
            </p>
            <Button as={Link} to="/locations" className="ps-btn-primary py-2 px-4">
              Find & Reserve a Bay
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead style={{ background: '#F8FAFC' }}>
                <tr style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                  <th className="py-2.5">Pass Reference</th>
                  <th className="py-2.5">Facility Hub</th>
                  <th className="py-2.5">Bay #</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Window</th>
                  <th className="py-2.5">Fare</th>
                  <th className="py-2.5">Permit Status</th>
                  <th className="py-2.5 text-end">Keycard</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
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
                      <span className="ps-badge ps-badge-primary py-1 px-2 font-mono">
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
                        className="ps-btn-outline py-1 px-3 d-inline-flex align-items-center gap-1"
                        style={{ fontSize: '0.82rem' }}
                      >
                        <FaEye /> View Pass
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
