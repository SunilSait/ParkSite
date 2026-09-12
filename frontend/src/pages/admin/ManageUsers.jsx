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
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 animate-fade-down">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge-cyber badge-cyber-cyan">COMMUTER DIRECTORY</span>
          </div>
          <h2 className="fw-900 text-white mb-0" style={{ fontSize: '2rem' }}>
            Registered Users & Permissions
          </h2>
        </div>
        <span className="badge-cyber badge-cyber-emerald">
          {users.length} REGISTERED COMMUTERS
        </span>
      </div>

      {/* Main Table */}
      <div className="cyber-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber">
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
                    <td className="font-mono text-muted">{i + 1}</td>
                    <td>
                      <span className="fw-700 text-white">{u.name}</span>
                    </td>
                    <td className="font-mono text-muted" style={{ fontSize: '0.85rem' }}>
                      {u.email}
                    </td>
                    <td className="font-mono text-light" style={{ fontSize: '0.82rem' }}>
                      {u.phone || '—'}
                    </td>
                    <td>
                      <span className={`badge-cyber ${u.role === 'admin' ? 'badge-cyber-amber' : 'badge-cyber-cyan'}`}>
                        {u.role === 'admin' ? (
                          <><FaUserShield className="me-1" /> ADMINISTRATOR</>
                        ) : (
                          <><FaUser className="me-1" /> COMMUTER</>
                        )}
                      </span>
                    </td>
                    <td className="font-mono text-muted" style={{ fontSize: '0.82rem' }}>
                      {formatDate(u.created_at?.split('T')[0])}
                    </td>
                    <td className="text-end">
                      <Button 
                        size="sm" 
                        onClick={() => toggleRole(u)}
                        className="btn-cyber-outline py-1 px-3"
                        style={{ fontSize: '0.78rem' }}
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
