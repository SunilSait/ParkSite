/**
 * AdminLayout — V3 Cyber Command Center Layout
 * Sleek glass obsidian sidebar, role telemetry badges, and deep dark canvas.
 */

import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Spinner, Nav } from 'react-bootstrap';
import {
  FaTachometerAlt, FaMapMarkerAlt, FaParking, FaUsers,
  FaCalendarCheck, FaChartBar, FaArrowLeft, FaCar, FaShieldAlt, FaTerminal
} from 'react-icons/fa';

const adminMenuItems = [
  { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Command Center' },
  { path: '/admin/locations', icon: FaMapMarkerAlt, label: 'Facility Hubs' },
  { path: '/admin/slots', icon: FaParking, label: 'Bay Grid Telemetry' },
  { path: '/admin/users', icon: FaUsers, label: 'Commuter Directory' },
  { path: '/admin/bookings', icon: FaCalendarCheck, label: 'All Booking Passes' },
  { path: '/admin/reports', icon: FaChartBar, label: 'Revenue Analytics' },
];

export default function AdminLayout() {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-deep">
        <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* ── Cyber Admin Sidebar ───────────────────────────── */}
      <div style={{
        width: '260px',
        minHeight: '100vh',
        background: 'rgba(5, 9, 24, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(20px)',
        zIndex: 10
      }}>
        {/* Brand header */}
        <div className="p-4 border-bottom border-white border-opacity-10">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="brand-icon-box" style={{ width: '36px', height: '36px' }}>
              <FaShieldAlt size={16} color="#ffb703" />
            </div>
            <div>
              <span className="brand-text" style={{ fontSize: '1.25rem' }}>
                Park<span className="gradient-text-cyber">Site</span>
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="radar-dot" style={{ width: 6, height: 6, background: '#10e79d' }}></span>
            <span className="font-mono text-muted" style={{ fontSize: '0.72rem' }}>
              ADMIN CONSOLE // ROOT
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <Nav className="flex-column p-3 gap-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`d-flex align-items-center gap-2 rounded-3 text-decoration-none transition-fast ${
                  isActive ? 'glass-panel text-white' : 'text-muted'
                }`}
                style={{
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--cyan-neon)' : '#94a3b8',
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid transparent'
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--cyan-neon)' : '#64748b' }} />
                <span>{item.label}</span>
              </Nav.Link>
            );
          })}
        </Nav>

        {/* Bottom User info & Exit */}
        <div className="p-3 mt-auto border-top border-white border-opacity-10">
          <div className="p-2 mb-3 rounded-3 glass-panel d-flex align-items-center gap-2">
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffb703, #fb8500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.75rem', color: '#000'
            }}>
              A
            </div>
            <div className="overflow-hidden">
              <div className="text-white fw-700 text-truncate" style={{ fontSize: '0.8rem' }}>{user?.name || 'Administrator'}</div>
              <div className="font-mono text-warning" style={{ fontSize: '0.68rem' }}>SUPERUSER</div>
            </div>
          </div>

          <Nav.Link as={Link} to="/" className="text-muted d-flex align-items-center gap-2 p-2 rounded-2" style={{ fontSize: '0.84rem' }}>
            <FaArrowLeft size={12} /> Exit to Public Portal
          </Nav.Link>
        </div>
      </div>

      {/* ── Main Command Canvas ─────────────────────────────── */}
      <div className="flex-grow-1 overflow-auto" style={{ background: 'var(--bg-deep)', minHeight: '100vh' }}>
        <div className="p-4 p-lg-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
