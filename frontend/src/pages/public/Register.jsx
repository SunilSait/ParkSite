/**
 * Register Page — V3 Cyber-Obsidian Commuter Registration
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUserPlus, FaCar, FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password });
      navigate('/login', { state: { message: 'Registration successful! Please sign in with your credentials.' } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: FaUser, placeholder: 'e.g. Rahul Sharma', required: true },
    { name: 'email', label: 'Email Address', type: 'email', icon: FaEnvelope, placeholder: 'rahul@example.com', required: true },
    { name: 'phone', label: 'Phone Number (Optional)', type: 'tel', icon: FaPhone, placeholder: '+91 98765 43210' },
    { name: 'password', label: 'Password', type: 'password', icon: FaLock, placeholder: 'Minimum 6 characters', required: true, minLength: 6 },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: FaLock, placeholder: 'Re-enter your password', required: true },
  ];

  return (
    <div className="py-5 d-flex align-items-center" style={{ minHeight: '86vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            {/* Header */}
            <div className="text-center mb-4 animate-fade-down">
              <div className="brand-icon-box mx-auto mb-3" style={{ width: '56px', height: '56px' }}>
                <FaCar size={26} />
              </div>
              <h2 className="fw-900 text-white mb-1" style={{ fontSize: '2rem' }}>
                Join <span className="gradient-text-cyber">ParkSite</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
                Unlock instant bay booking and contactless dynamic QR keycards
              </p>
            </div>

            {/* Main Cyber Card */}
            <div className="cyber-card p-4 p-md-5 animate-fade-up">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4 border-danger" style={{ background: 'rgba(255, 51, 102, 0.15)', color: '#ff6b8b' }}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {fields.map((f) => {
                  const Icon = f.icon;
                  return (
                    <Form.Group className="mb-3" key={f.name}>
                      <Form.Label className="form-label">{f.label}</Form.Label>
                      <div className="position-relative">
                        <Form.Control 
                          type={f.type} 
                          name={f.name} 
                          placeholder={f.placeholder}
                          value={formData[f.name]} 
                          onChange={handleChange}
                          required={f.required} 
                          minLength={f.minLength}
                          style={{ paddingLeft: '2.6rem' }} 
                        />
                        <Icon style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      </div>
                    </Form.Group>
                  );
                })}

                <Button 
                  type="submit" 
                  className="btn-cyber-primary w-100 py-3 mb-3 fw-bold mt-2" 
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" className="me-2" /> : <FaUserPlus className="me-2" />}
                  {loading ? 'Creating Commuter Pass...' : 'Create Free Account'}
                </Button>
              </Form>

              <div className="text-center pt-2 border-top border-secondary border-opacity-25">
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }} className="mb-0">
                  Already registered?{' '}
                  <Link to="/login" style={{ color: 'var(--cyan-neon)', fontWeight: 600, textDecoration: 'none' }}>
                    Sign In <FaArrowRight size={11} />
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
