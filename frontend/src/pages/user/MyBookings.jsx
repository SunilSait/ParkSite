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
      <Link to="/user/dashboard" className="btn p-0 mb-3 d-inline-flex align-items-center gap-2 border-0 text-decoration-none" style={{ color: 'var(--cyan-neon)', fontSize: '0.9rem' }}>
        <FaArrowLeft /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge-cyber badge-cyber-cyan">COMMUTER PASS VAULT</span>
          </div>
          <h2 className="fw-900 text-white mb-0" style={{ fontSize: '2rem' }}>
            My Booking Archive
          </h2>
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

      {/* Bookings Cyber Card Table */}
      <div className="cyber-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
            <p className="mt-2 text-muted font-mono" style={{ fontSize: '0.85rem' }}>Loading passes...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5">
            <FaCalendarAlt size={48} style={{ color: 'rgba(255,255,255,0.15)' }} className="mb-3" />
            <h5 className="text-white fw-700">No Reservations Found</h5>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>
              No parking passes found matching the current filter.
            </p>
            <Button as={Link} to="/locations" className="btn-cyber-primary py-2 px-4">
              Find & Reserve a Bay
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Facility Hub</th>
                  <th>Bay #</th>
                  <th>Date</th>
                  <th>Window</th>
                  <th>Fare</th>
                  <th>Permit Status</th>
                  <th className="text-end">Keycard</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
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
                      <span className="badge-cyber badge-cyber-cyan py-1 px-2 font-mono">
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
                        className="btn-cyber-outline py-1 px-3 d-inline-flex align-items-center gap-1"
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
