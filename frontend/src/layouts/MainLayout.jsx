/**
 * MainLayout — Professional Clean Layout with responsive navbar and footer.
 * Wraps all public and user routes with shared navigation and footer.
 */

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaCar, FaSignOutAlt, FaSignInAlt, FaTachometerAlt, FaSearch, FaShieldAlt } from 'react-icons/fa';
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
      {/* ── Professional Navbar ──────────────────────────────── */}
      <Navbar expand="lg" className="ps-navbar" sticky="top">
        <Container>
          <Link to="/" className="ps-brand">
            <div className="ps-brand-icon">
              <FaCar size={18} />
            </div>
            <span className="ps-brand-text">Park<span>Site</span></span>
          </Link>

          <Navbar.Toggle aria-controls="main-nav" className="border-0" />

          <Navbar.Collapse id="main-nav">
            <Nav className="mx-auto my-2 my-lg-0 gap-1">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`ps-nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/locations" 
                className={`ps-nav-link ${location.pathname.startsWith('/locations') ? 'active' : ''}`}
              >
                Parking Hubs
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/about" 
                className={`ps-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                About
              </Nav.Link>
            </Nav>

            <Nav className="align-items-center gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link 
                      to="/admin/dashboard" 
                      className="ps-btn-outline ps-btn-sm d-flex align-items-center gap-2"
                    >
                      <FaShieldAlt size={14} /> Admin Console
                    </Link>
                  ) : (
                    <Link 
                      to="/user/dashboard" 
                      className="ps-btn-outline ps-btn-sm d-flex align-items-center gap-2"
                    >
                      <FaTachometerAlt size={14} /> Dashboard
                    </Link>
                  )}
                  
                  <div className="d-none d-lg-flex align-items-center gap-2 px-2">
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.78rem', fontWeight: 700, color: 'white'
                    }}>
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {user?.name}
                    </span>
                    {isAdmin && (
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.4rem',
                        borderRadius: '4px', background: 'var(--warning-light)',
                        color: '#B45309', textTransform: 'uppercase'
                      }}>
                        Admin
                      </span>
                    )}
                  </div>

                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={handleLogout} 
                    className="d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <FaSignOutAlt /> Sign Out
                  </Button>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link 
                    to="/login" 
                    className="ps-btn-outline ps-btn-sm"
                  >
                    <FaSignInAlt className="me-1" /> Sign In
                  </Link>
                  <Link 
                    to="/locations" 
                    className="ps-btn-primary ps-btn-sm"
                  >
                    <FaSearch className="me-1" /> Find Parking
                  </Link>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* ── Professional Footer ────────────────────────────────── */}
      <footer className="ps-footer">
        <Container>
          <div className="row g-4 mb-4">
            <div className="col-lg-4 col-md-6">
              <div className="ps-footer-brand">
                Park<span>Site</span>
              </div>
              <p className="ps-footer-tagline">Smart Parking Management System</p>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.7, maxWidth: '320px', marginTop: '0.75rem' }}>
                An IoT-based parking slot booking and management platform. Real-time availability, easy reservations, and seamless parking experience.
              </p>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <h6>Navigate</h6>
              <Link to="/" className="ps-footer-link">Home</Link>
              <Link to="/locations" className="ps-footer-link">Parking Hubs</Link>
              <Link to="/about" className="ps-footer-link">About</Link>
              <Link to="/login" className="ps-footer-link">Sign In</Link>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <h6>Parking Hubs</h6>
              <Link to="/locations" className="ps-footer-link">Anna Nagar Central</Link>
              <Link to="/locations" className="ps-footer-link">T. Nagar Metro</Link>
              <Link to="/locations" className="ps-footer-link">Airport Terminal 2</Link>
            </div>

            <div className="col-lg-4 col-md-12">
              <h6>Technology Stack</h6>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                Built as a final-year college project using free and open-source technologies.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {['React 18', 'Vite', 'Bootstrap 5', 'Flask', 'MySQL', 'JWT Auth', 'Leaflet', 'Python'].map((tech, idx) => (
                  <span key={idx} className="tech-badge">{tech}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="ps-footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <div>
              © {new Date().getFullYear()} ParkSite. Smart Parking Management System.
            </div>
            <div className="d-flex gap-4">
              <span>Currency: ₹ (INR)</span>
              <span>Region: Chennai, India</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
