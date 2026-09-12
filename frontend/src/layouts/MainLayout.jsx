/**
 * MainLayout — V3 Cyber-Obsidian Layout with Live Telemetry Marquee, Glass Navbar, and Modern Footer
 */

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { FaCar, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaShieldAlt, FaBolt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ── Top Live Telemetry Marquee ───────────────────────── */}
      <div className="live-telemetry-bar">
        <div className="live-beacon">
          <span className="radar-dot"></span>
          <span>IoT Live Feed</span>
        </div>
        <div className="ticker-viewport">
          <div className="ticker-track">
            <div className="ticker-item">
              <span className="ticker-pill pill-cyan">Anna Nagar Hub</span>
              <span>8 Bays Free • ₹40/hr</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-pill pill-amber">T. Nagar Metro</span>
              <span>92% Occupied • FastTag Ready</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-pill pill-green">Airport T2 Bay</span>
              <span>14 Bays Available • 6 EV Superchargers</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-pill pill-cyan">System Status</span>
              <span>Zero Queue • QR Gate Sync 100% Operational</span>
            </div>
            {/* Loop duplicate */}
            <div className="ticker-item" aria-hidden="true">
              <span className="ticker-pill pill-cyan">Anna Nagar Hub</span>
              <span>8 Bays Free • ₹40/hr</span>
            </div>
            <div className="ticker-item" aria-hidden="true">
              <span className="ticker-pill pill-amber">T. Nagar Metro</span>
              <span>92% Occupied • FastTag Ready</span>
            </div>
            <div className="ticker-item" aria-hidden="true">
              <span className="ticker-pill pill-green">Airport T2 Bay</span>
              <span>14 Bays Available • 6 EV Superchargers</span>
            </div>
            <div className="ticker-item" aria-hidden="true">
              <span className="ticker-pill pill-cyan">System Status</span>
              <span>Zero Queue • QR Gate Sync 100% Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Cyber Navbar ────────────────────────────────── */}
      <Navbar expand="lg" className="cyber-navbar" sticky="top">
        <Container>
          <Link to="/" className="brand-logo-container">
            <div className="brand-icon-box">
              <FaCar size={20} />
            </div>
            <div>
              <span className="brand-text">Park<span className="gradient-text-cyber">Site</span></span>
              <span className="brand-badge ms-2">Smart IoT</span>
            </div>
          </Link>

          <Navbar.Toggle aria-controls="main-cyber-nav" className="border-0 text-white" />

          <Navbar.Collapse id="main-cyber-nav">
            <Nav className="mx-auto my-2 my-lg-0 gap-1">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`cyber-nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/locations" 
                className={`cyber-nav-link ${location.pathname.startsWith('/locations') ? 'active' : ''}`}
              >
                <FaMapMarkerAlt size={14} className="text-info" /> Parking Hubs
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/about" 
                className={`cyber-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                About System
              </Nav.Link>
            </Nav>

            <Nav className="align-items-center gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Button 
                      as={Link} 
                      to="/admin/dashboard" 
                      className="btn-cyber-outline py-2 px-3 d-flex align-items-center gap-2"
                      style={{ fontSize: '0.88rem' }}
                    >
                      <FaTachometerAlt color="#00f2fe" /> Admin Console
                    </Button>
                  ) : (
                    <Button 
                      as={Link} 
                      to="/user/dashboard" 
                      className="btn-cyber-outline py-2 px-3 d-flex align-items-center gap-2"
                      style={{ fontSize: '0.88rem' }}
                    >
                      <FaTachometerAlt color="#00f2fe" /> Dashboard
                    </Button>
                  )}
                  
                  <div className="d-none d-lg-flex align-items-center gap-2 px-3 py-1 glass-panel rounded-pill">
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00f2fe, #7928ca)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 800, color: 'white'
                    }}>
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {user?.name}
                    </span>
                    {isAdmin && (
                      <span className="badge-cyber badge-cyber-amber py-0 px-2" style={{ fontSize: '0.65rem' }}>
                        ADMIN
                      </span>
                    )}
                  </div>

                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={handleLogout} 
                    className="d-flex align-items-center gap-1 rounded-pill px-3 py-2"
                    style={{ border: '1px solid rgba(255, 71, 87, 0.4)', background: 'rgba(255, 71, 87, 0.08)' }}
                  >
                    <FaSignOutAlt /> Exit
                  </Button>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Button 
                    as={Link} 
                    to="/login" 
                    className="btn-cyber-outline py-2 px-3"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <FaSignInAlt className="me-1" /> Sign In
                  </Button>
                  <Button 
                    as={Link} 
                    to="/register" 
                    className="btn-cyber-primary py-2 px-4"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <FaUserPlus className="me-1" /> Join Free
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ── Main Dynamic View ─────────────────────────────────── */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* ── Modern Cyber Footer ───────────────────────────────── */}
      <footer className="cyber-footer">
        <Container>
          <div className="row g-4 mb-5">
            <div className="col-lg-4 col-md-6">
              <div className="brand-logo-container mb-3">
                <div className="brand-icon-box">
                  <FaCar size={18} />
                </div>
                <span className="brand-text">Park<span className="gradient-text-cyber">Site</span></span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '320px' }}>
                Next-Gen IoT Parking Automation System. Eliminating traffic congestion with real-time bay telemetry, automated dynamic QR access, and effortless cashless reservations.
              </p>
              <div className="d-inline-flex align-items-center gap-2 p-2 px-3 glass-panel rounded-pill mt-2">
                <span className="radar-dot" style={{ background: '#10e79d' }}></span>
                <span style={{ fontSize: '0.78rem', color: '#10e79d', fontFamily: 'var(--font-mono)' }}>
                  All 3 Hub Nodes Online (99.98%)
                </span>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <h6 className="fw-700 text-white mb-3" style={{ fontSize: '0.92rem', letterSpacing: '0.04em' }}>
                EXPLORE
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li><Link to="/" className="footer-link">Home Overview</Link></li>
                <li><Link to="/locations" className="footer-link">Live Parking Hubs</Link></li>
                <li><Link to="/about" className="footer-link">Tech Architecture</Link></li>
                <li><Link to="/login" className="footer-link">Commuter Portal</Link></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <h6 className="fw-700 text-white mb-3" style={{ fontSize: '0.92rem', letterSpacing: '0.04em' }}>
                LOCATIONS
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li><Link to="/locations" className="footer-link">Anna Nagar Central</Link></li>
                <li><Link to="/locations" className="footer-link">T. Nagar Metro Bay</Link></li>
                <li><Link to="/locations" className="footer-link">Airport Terminal 2</Link></li>
                <li><Link to="/locations" className="footer-link">OMR Tech Corridor</Link></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-12">
              <h6 className="fw-700 text-white mb-3" style={{ fontSize: '0.92rem', letterSpacing: '0.04em' }}>
                PROJECT ARCHITECTURE
              </h6>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Academic Capstone Engineering Demonstration built with 100% Free and Open-Source Technologies.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {['React 18', 'Vite', 'Bootstrap 5', 'Flask API', 'MySQL 8', 'JWT Auth', 'OpenStreetMap', 'Python QR'].map((tech, idx) => (
                  <span key={idx} className="badge-cyber badge-cyber-cyan" style={{ fontSize: '0.7rem' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div style={{ color: '#64748b', fontSize: '0.82rem' }}>
              © {new Date().getFullYear()} ParkSite — Parking Slot Booking & Telemetry System. For College Project Demonstration.
            </div>
            <div className="d-flex gap-4">
              <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Currency: ₹ (INR)</span>
              <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Region: Chennai, India</span>
              <span style={{ color: '#10e79d', fontSize: '0.82rem' }}>Status: Live Localhost</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
