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
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#F8FAFC' }}>
        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
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
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* ── Professional Admin Sidebar ───────────────────────────── */}
      <div style={{
        width: '260px',
        minHeight: '100vh',
        background: '#0F172A',
        borderRight: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        flexShrink: 0
      }}>
        {/* Brand header */}
        <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#2563EB', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#ffffff'
            }}>
              <FaShieldAlt size={18} />
            </div>
            <div>
              <span className="fw-800" style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                Park<span style={{ color: '#60A5FA' }}>Site</span>
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }}></span>
            <span className="text-uppercase fw-600" style={{ fontSize: '0.72rem', color: '#94A3B8', letterSpacing: '0.04em' }}>
              ADMIN CONSOLE // ACTIVE
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
                className="d-flex align-items-center gap-2.5 rounded-3 text-decoration-none"
                style={{
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  background: isActive ? '#2563EB' : 'transparent',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
              >
                <Icon size={16} style={{ color: isActive ? '#FFFFFF' : '#64748B' }} />
                <span>{item.label}</span>
              </Nav.Link>
            );
          })}
        </Nav>

        {/* Bottom User info & Exit */}
        <div className="p-3 mt-auto border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="p-2.5 mb-3 rounded-3 d-flex align-items-center gap-2.5" style={{ background: '#1E293B', border: '1px solid #334155' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.8rem', color: '#FFFFFF'
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="fw-700 text-truncate" style={{ fontSize: '0.82rem', color: '#FFFFFF' }}>
                {user?.name || 'Administrator'}
              </div>
              <div className="fw-600 text-uppercase" style={{ fontSize: '0.68rem', color: '#F59E0B', letterSpacing: '0.04em' }}>
                SUPERUSER
              </div>
            </div>
          </div>

          <Nav.Link 
            as={Link} 
            to="/" 
            className="d-flex align-items-center gap-2 p-2 rounded-2 text-decoration-none" 
            style={{ fontSize: '0.84rem', color: '#94A3B8', fontWeight: 600 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            <FaArrowLeft size={12} /> Exit to Public Portal
          </Nav.Link>
        </div>
      </div>

      {/* ── Main Command Canvas ─────────────────────────────── */}
      <div className="flex-grow-1 overflow-auto" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
        <div className="p-4 p-xl-5" style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
