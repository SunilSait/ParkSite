/**
 * Login Page — V3 Cyber-Obsidian Authentication Terminal
 * 1-click demo credentials autofill, glowing glass form, and instant security token sync.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSignInAlt, FaCar, FaEnvelope, FaLock, FaArrowRight, FaShieldAlt, FaKey, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const autofillUser = () => {
    setEmail('user@example.com');
    setPassword('user123');
  };

  const autofillAdmin = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
  };

  return (
    <div className="py-5 d-flex align-items-center" style={{ minHeight: '86vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            {/* Brand Header */}
            <div className="text-center mb-4 animate-fade-down">
              <div className="brand-icon-box mx-auto mb-3" style={{ width: '56px', height: '56px' }}>
                <FaCar size={26} />
              </div>
              <h2 className="fw-900 text-white mb-1" style={{ fontSize: '2rem' }}>
                Sign In to <span className="gradient-text-cyber">ParkSite</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
                Access live slot reservations and your digital QR keycard
              </p>
            </div>

            {/* Main Auth Cyber Card */}
            <div className="cyber-card p-4 p-md-5 animate-fade-up">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4 border-danger" style={{ background: 'rgba(255, 51, 102, 0.15)', color: '#ff6b8b' }}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Email Address</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      placeholder="driver@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ paddingLeft: '2.6rem' }}
                    />
                    <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingLeft: '2.6rem' }}
                    />
                    <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                </Form.Group>

                <Button 
                  type="submit" 
                  className="btn-cyber-primary w-100 py-3 mb-3 fw-bold" 
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" className="me-2" /> : <FaSignInAlt className="me-2" />}
                  {loading ? 'Authenticating...' : 'Sign In to Account'}
                </Button>
              </Form>

              <div className="text-center pt-2 border-top border-secondary border-opacity-25">
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }} className="mb-0">
                  New commuter?{' '}
                  <Link to="/register" style={{ color: 'var(--cyan-neon)', fontWeight: 600, textDecoration: 'none' }}>
                    Create Account Free <FaArrowRight size={11} />
                  </Link>
                </p>
              </div>
            </div>

            {/* College Demo Quick Fill Bar */}
            <div className="mt-4 p-3 rounded-4 glass-panel border border-secondary border-opacity-25 text-center animate-fade-up delay-2">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <FaKey color="#ffb703" size={13} />
                <span className="font-mono fw-700" style={{ fontSize: '0.75rem', color: '#ffb703', letterSpacing: '0.06em' }}>
                  COLLEGE DEMO 1-CLICK QUICK ACCESS
                </span>
              </div>
              <div className="d-flex gap-2 justify-content-center">
                <Button 
                  onClick={autofillUser} 
                  size="sm" 
                  className="btn-cyber-outline py-1 px-3" 
                  style={{ fontSize: '0.78rem' }}
                >
                  <FaUserCheck className="me-1 text-success" /> Fill Demo User
                </Button>
                <Button 
                  onClick={autofillAdmin} 
                  size="sm" 
                  className="btn-cyber-outline py-1 px-3" 
                  style={{ fontSize: '0.78rem' }}
                >
                  <FaShieldAlt className="me-1 text-warning" /> Fill Demo Admin
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
