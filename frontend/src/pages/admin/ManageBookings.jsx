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
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 animate-fade-down">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge-cyber badge-cyber-cyan">MASTER PASS REGISTRY</span>
          </div>
          <h2 className="fw-900 text-white mb-0" style={{ fontSize: '2rem' }}>
            All Reservation Passes
          </h2>
        </div>

        <div className="d-flex align-items-center gap-2">
          <FaFilter className="text-muted" />
          <Form.Select 
            style={{ width: '190px' }} 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaCalendarCheck size={48} className="mb-3" />
            <h5 className="text-white">No Bookings Recorded</h5>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber">
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
                      <span className="font-mono fw-700" style={{ color: 'var(--cyan-neon)' }}>
                        {b.booking_reference}
                      </span>
                    </td>
                    <td>
                      <span className="fw-700 text-white">{b.user?.name || '—'}</span>
                    </td>
                    <td>
                      <span style={{ color: '#cbd5e1' }}>{b.location?.name || '—'}</span>
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
