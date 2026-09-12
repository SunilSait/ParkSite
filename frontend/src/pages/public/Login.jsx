/**
 * Login Page — Professional Authentication Terminal
 * 1-click demo credentials autofill, clean modern card, and secure session management.
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

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const userData = await login(demoEmail, demoPassword);
      if (userData.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 d-flex align-items-center" style={{ minHeight: '86vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            {/* Brand Header */}
            <div className="text-center mb-4 animate-fade-down">
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                background: 'var(--primary-50)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <FaCar size={26} />
              </div>
              <h2 className="fw-800 mb-1" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
                Sign In to <span style={{ color: 'var(--primary)' }}>ParkSite</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Access live slot reservations and your digital QR keycard
              </p>
            </div>

            {/* Main Auth Card */}
            <div className="ps-card p-4 p-md-5 animate-fade-up">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="ps-form-label">Email Address</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      placeholder="driver@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ paddingLeft: '2.6rem' }}
                    />
                    <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="ps-form-label">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingLeft: '2.6rem' }}
                    />
                    <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </Form.Group>

                <Button 
                  type="submit" 
                  className="ps-btn-primary w-100 py-3 mb-3 fw-bold" 
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" className="me-2" /> : <FaSignInAlt className="me-2" />}
                  {loading ? 'Authenticating...' : 'Sign In to Account'}
                </Button>
              </Form>

              <div className="text-center pt-3 border-top border-light">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }} className="mb-0">
                  New commuter?{' '}
                  <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                    Create Account Free <FaArrowRight size={11} />
                  </Link>
                </p>
              </div>
            </div>

            {/* College Demo Quick Access Bar */}
            <div className="mt-4 p-3 rounded-3 ps-card text-center animate-fade-up delay-2" style={{ background: 'var(--bg-white)' }}>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <FaKey color="#D97706" size={13} />
                <span className="fw-700" style={{ fontSize: '0.75rem', color: '#D97706', letterSpacing: '0.04em' }}>
                  COLLEGE DEMO 1-CLICK INSTANT LOGIN
                </span>
              </div>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Button 
                  type="button"
                  onClick={() => handleQuickLogin('user@example.com', 'user123')} 
                  size="sm" 
                  disabled={loading}
                  className="ps-btn-outline py-2 px-3 d-flex align-items-center gap-1.5" 
                  style={{ fontSize: '0.82rem', fontWeight: 600 }}
                >
                  <FaUserCheck className="text-success" /> Login as Demo User
                </Button>
                <Button 
                  type="button"
                  onClick={() => handleQuickLogin('admin@example.com', 'admin123')} 
                  size="sm" 
                  disabled={loading}
                  className="ps-btn-outline py-2 px-3 d-flex align-items-center gap-1.5" 
                  style={{ fontSize: '0.82rem', fontWeight: 600 }}
                >
                  <FaShieldAlt className="text-warning" /> Login as Demo Admin
                </Button>
              </div>
              <div className="mt-2" style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Auto-fills credentials and signs in with 1 click
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
