/**
 * User Profile Page — V3 Commuter Identity & Vehicle Credentials
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaSave, FaArrowLeft, FaShieldAlt, FaCar, FaEnvelope, FaPhone, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = { name: formData.name, phone: formData.phone };
      if (formData.password) payload.password = formData.password;
      const res = await authService.updateProfile(payload);
      updateUser(res.data.user);
      setSuccess('Profile credentials updated successfully!');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Link to="/user/dashboard" className="btn p-0 mb-3 d-inline-flex align-items-center gap-2 border-0 text-decoration-none" style={{ color: 'var(--cyan-neon)', fontSize: '0.9rem' }}>
        <FaArrowLeft /> Back to Dashboard
      </Link>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="cyber-card p-4 p-md-5">
            {/* Profile Avatar Header */}
            <div className="text-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <div style={{
                width: '76px', height: '76px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f2fe, #7928ca)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: '#ffffff',
                boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
                margin: '0 auto 1rem'
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="fw-800 text-white mb-1">{user?.name}</h3>
              <span className="badge-cyber badge-cyber-emerald">VERIFIED COMMUTER</span>
              <div className="font-mono text-muted mt-1" style={{ fontSize: '0.82rem' }}>{user?.email}</div>
            </div>

            {success && (
              <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-4 border-success" style={{ background: 'rgba(16, 231, 157, 0.15)', color: '#34d399' }}>
                <FaCheckCircle className="me-2" /> {success}
              </Alert>
            )}

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4 border-danger" style={{ background: 'rgba(255, 51, 102, 0.15)', color: '#ff6b8b' }}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Full Name</Form.Label>
                <div className="position-relative">
                  <Form.Control 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label">Email (Immutable)</Form.Label>
                <div className="position-relative">
                  <Form.Control 
                    value={user?.email} 
                    disabled 
                    style={{ paddingLeft: '2.5rem', opacity: 0.6, cursor: 'not-allowed' }} 
                  />
                  <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label">Contact Phone</Form.Label>
                <div className="position-relative">
                  <Form.Control 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    placeholder="+91 98765 43210"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <FaPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label">New Password (Leave blank to keep current)</Form.Label>
                <div className="position-relative">
                  <Form.Control 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    placeholder="••••••••" 
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </Form.Group>

              <Button 
                type="submit" 
                className="btn-cyber-primary w-100 py-3 fw-bold" 
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="me-2" /> : <FaSave className="me-2" />}
                Save Updated Credentials
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
