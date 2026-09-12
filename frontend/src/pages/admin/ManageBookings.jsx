/**
 * Admin Manage Bookings Page — V3 Master Reservation Ledger
 */

import { useState, useEffect } from 'react';
import { Spinner, Form } from 'react-bootstrap';
import { FaCalendarCheck, FaFilter } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await adminService.getBookings(params);
      setBookings(res.data.bookings || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchBookings(); }, [statusFilter]);

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="ps-badge ps-badge-primary" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', letterSpacing: '0.04em' }}>
              MASTER PASS REGISTRY
            </span>
          </div>
          <h1 className="fw-800 mb-0" style={{ fontSize: '1.5rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            All Reservation Passes
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 0, marginTop: '2px' }}>
            Audit log of active permits, commuter reservations, bay assignments, and payment statuses.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <FaFilter className="text-muted" size={13} />
          <Form.Select 
            style={{ width: '190px', height: '40px' }} 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="shadow-sm"
          >
            <option value="">All Permit Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="cyber-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--primary)' }} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaCalendarCheck size={44} className="mb-3 text-muted" />
            <h5 className="fw-700" style={{ color: '#0F172A' }}>No Bookings Recorded</h5>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber mb-0">
              <thead>
                <tr>
                  <th>Pass Reference</th>
                  <th>Commuter</th>
                  <th>Facility Node</th>
                  <th>Bay #</th>
                  <th>Permit Date</th>
                  <th>Access Window</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="font-mono fw-700" style={{ color: '#2563EB', fontSize: '0.92rem' }}>
                        {b.booking_reference}
                      </span>
                    </td>
                    <td>
                      <span className="fw-700" style={{ color: '#0F172A' }}>{b.user?.name || '—'}</span>
                    </td>
                    <td>
                      <span style={{ color: '#64748B', fontSize: '0.88rem' }}>{b.location?.name || '—'}</span>
                    </td>
                    <td>
                      <span className="ps-badge ps-badge-primary py-1 px-2 font-mono" style={{ fontSize: '0.72rem' }}>
                        {b.slot?.slot_number || '—'}
                      </span>
                    </td>
                    <td style={{ color: '#64748B', fontSize: '0.85rem' }}>
                      {formatDate(b.booking_date)}
                    </td>
                    <td style={{ color: '#475569', fontSize: '0.82rem', fontWeight: 500 }}>
                      {formatTime(b.start_time)} - {formatTime(b.end_time)}
                    </td>
                    <td>
                      <span className="font-mono fw-700" style={{ color: '#16A34A', fontSize: '0.95rem' }}>
                        {formatCurrency(b.total_amount)}
                      </span>
                    </td>
                    <td>
                      <span className={`ps-badge ${
                        b.status === 'confirmed' ? 'ps-badge-success' :
                        b.status === 'cancelled' ? 'ps-badge-danger' :
                        'ps-badge-primary'
                      }`} style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>
                        <span className="ps-badge-dot"></span>
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
