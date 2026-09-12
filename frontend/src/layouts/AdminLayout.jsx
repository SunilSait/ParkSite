import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Nav } from 'react-bootstrap';
import {
  FaTachometerAlt, FaMapMarkerAlt, FaParking, FaUsers,
  FaCalendarCheck, FaChartBar, FaArrowLeft, FaShieldAlt,
  FaBars, FaTimes
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="admin-layout-root">
      {/* Mobile Topbar for < 768px */}
      <div className="admin-topbar-mobile">
        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            className="btn btn-sm text-white p-1 border-0" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
          <span className="fw-800" style={{ fontSize: '1.1rem', color: '#ffffff' }}>
            Park<span style={{ color: '#60A5FA' }}>Site</span>
          </span>
        </div>
        <span className="badge" style={{ background: '#1E293B', color: '#94A3B8', fontSize: '0.7rem' }}>
          ADMIN
        </span>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          className="admin-backdrop" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* ── Professional Admin Sidebar (230px, Fixed) ─────────────── */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand header */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#2563EB', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#ffffff'
              }}>
                <FaShieldAlt size={16} />
              </div>
              <span className="fw-800" style={{ fontSize: '1.18rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Park<span style={{ color: '#60A5FA' }}>Site</span>
              </span>
            </div>
            {mobileOpen && (
              <button 
                type="button" 
                className="btn btn-sm text-white p-0 d-md-none border-0"
                onClick={() => setMobileOpen(false)}
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }}></span>
            <span className="text-uppercase fw-600" style={{ fontSize: '0.68rem', color: '#94A3B8', letterSpacing: '0.04em' }}>
              ADMIN CONSOLE // ACTIVE
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <Nav className="flex-column" style={{ padding: '14px 12px', gap: '4px' }}>
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="d-flex align-items-center rounded-2 text-decoration-none"
                style={{
                  height: '42px',
                  padding: '0 12px',
                  gap: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  background: isActive ? '#2563EB' : 'transparent',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'
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
                <Icon size={15} style={{ color: isActive ? '#FFFFFF' : '#64748B', flexShrink: 0 }} />
                <span className="text-truncate">{item.label}</span>
              </Nav.Link>
            );
          })}
        </Nav>

        {/* Bottom User info & Exit */}
        <div className="mt-auto" style={{ padding: '14px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="p-2 mb-2 rounded-2 d-flex align-items-center gap-2" style={{ background: '#1E293B', border: '1px solid #334155' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.75rem', color: '#FFFFFF',
              flexShrink: 0
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="fw-700 text-truncate" style={{ fontSize: '0.8rem', color: '#FFFFFF', lineHeight: 1.2 }}>
                {user?.name || 'Administrator'}
              </div>
              <div className="fw-600 text-uppercase" style={{ fontSize: '0.64rem', color: '#F59E0B', letterSpacing: '0.04em' }}>
                SUPERUSER
              </div>
            </div>
          </div>

          <Nav.Link 
            as={Link} 
            to="/" 
            className="d-flex align-items-center gap-2 p-1.5 rounded-2 text-decoration-none" 
            style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            <FaArrowLeft size={11} /> Exit to Public Portal
          </Nav.Link>
        </div>
      </aside>

      {/* ── Main Command Canvas ─────────────────────────────── */}
      <main className="admin-main-viewport">
        <Outlet />
      </main>
    </div>
  );
}

