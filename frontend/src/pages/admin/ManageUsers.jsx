/**
 * Admin Manage Users Page — V3 Commuter Directory
 */

import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaUsers, FaUserShield, FaUser, FaCheckCircle, FaUserCheck } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { formatDate, getErrorMessage } from '../../utils/helpers';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data.users || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${u.name}'s role to ${newRole.toUpperCase()}?`)) return;
    try {
      await adminService.updateUser(u.id, { role: newRole });
      fetchUsers();
    } catch (err) { 
      alert(getErrorMessage(err)); 
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="ps-badge ps-badge-primary" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', letterSpacing: '0.04em' }}>
              COMMUTER DIRECTORY
            </span>
          </div>
          <h1 className="fw-800 mb-0" style={{ fontSize: '1.5rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Registered Users & Permissions
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 0, marginTop: '2px' }}>
            Directory of registered commuter accounts, permission management, and contact records.
          </p>
        </div>
        <span className="ps-badge ps-badge-success" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
          <span className="ps-badge-dot"></span>
          {users.length} REGISTERED COMMUTERS
        </span>
      </div>

      {/* Main Table */}
      <div className="cyber-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email Account</th>
                  <th>Phone</th>
                  <th>System Role</th>
                  <th>Joined Date</th>
                  <th className="text-end">Permission Toggle</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ fontFamily: 'monospace', color: '#64748B', fontWeight: 600 }}>{i + 1}</td>
                    <td>
                      <span className="fw-700" style={{ color: '#0F172A' }}>{u.name}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: '#64748B', fontSize: '0.85rem' }}>
                      {u.email}
                    </td>
                    <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                      {u.phone || '—'}
                    </td>
                    <td>
                      <span className={`ps-badge ${u.role === 'admin' ? 'ps-badge-warning' : 'ps-badge-primary'}`} style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>
                        {u.role === 'admin' ? (
                          <><FaUserShield className="me-1" /> ADMINISTRATOR</>
                        ) : (
                          <><FaUser className="me-1" /> COMMUTER</>
                        )}
                      </span>
                    </td>
                    <td style={{ color: '#64748B', fontSize: '0.82rem' }}>
                      {formatDate(u.created_at?.split('T')[0])}
                    </td>
                    <td className="text-end">
                      <Button 
                        size="sm" 
                        variant="light"
                        onClick={() => toggleRole(u)}
                        className="border py-1 px-3 rounded-2 fw-600"
                        style={{ fontSize: '0.78rem', color: '#334155', background: '#F8FAFC' }}
                      >
                        Switch to {u.role === 'admin' ? 'User' : 'Admin'}
                      </Button>
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
