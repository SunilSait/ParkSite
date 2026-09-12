/**
 * Payment Page — V3 Contactless Settlement Terminal
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCreditCard, FaMobileAlt, FaMoneyBillWave, FaCheckCircle, FaLock, FaShieldAlt, FaBolt, FaArrowLeft } from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import { formatCurrency, getErrorMessage } from '../../utils/helpers';
import { PAYMENT_METHODS } from '../../utils/constants';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    bookingService.getById(id)
      .then(res => setBooking(res.data.booking))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await bookingService.demoPayment({ booking_id: parseInt(id), payment_method: paymentMethod });
      setSuccess(true);
      setTimeout(() => navigate(`/user/booking/${id}`), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
        <p className="mt-2 text-muted font-mono">Initializing secure payment terminal...</p>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="cyber-card text-center p-5 animate-fade-up" style={{
              background: 'linear-gradient(135deg, rgba(16, 231, 157, 0.15), rgba(7, 12, 34, 0.98))',
              borderColor: 'var(--emerald-neon)',
              boxShadow: '0 0 50px rgba(16, 231, 157, 0.25)'
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10e79d, #05b171)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 0 35px rgba(16, 231, 157, 0.4)',
              }}>
                <FaCheckCircle size={38} color="#042416" />
              </div>
              <span className="badge-cyber badge-cyber-emerald mb-2">TRANSACTION CONFIRMED</span>
              <h2 className="fw-900 text-white mb-2">Payment Settled!</h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>
                Your smart bay is reserved. Digital QR pass is issued and synced with barrier nodes.
              </p>
              <div className="d-flex align-items-center justify-content-center gap-2 text-info font-mono" style={{ fontSize: '0.8rem' }}>
                <Spinner size="sm" />
                <span>Redirecting to your digital boarding pass...</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const methodConfig = {
    UPI: { icon: FaMobileAlt, label: 'Instant UPI / QR', desc: 'GPay, PhonePe, Paytm' },
    Card: { icon: FaCreditCard, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
    Cash: { icon: FaMoneyBillWave, label: 'Pay at Barrier Exit', desc: 'Cash / FastTag Auto' },
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={5}>
          <div className="cyber-card p-4 p-md-5">
            {/* Terminal Header */}
            <div className="text-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <FaShieldAlt color="#00f2fe" size={18} />
                <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--cyan-neon)' }}>
                  256-BIT ENCRYPTED DEMO GATEWAY
                </span>
              </div>
              <div className="font-mono text-muted" style={{ fontSize: '0.8rem' }}>TOTAL PAYABLE TARIFF</div>
              <div className="font-display fw-900 gradient-text-emerald" style={{ fontSize: '3.2rem', lineHeight: 1.1 }}>
                {formatCurrency(booking?.total_amount)}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                {booking?.location?.name} • Bay #{booking?.slot?.slot_number}
              </div>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
                {error}
              </Alert>
            )}

            {/* Payment Method Selector */}
            <div className="mb-4">
              <div className="font-mono text-muted mb-2" style={{ fontSize: '0.78rem' }}>
                SELECT SETTLEMENT METHOD
              </div>

              <div className="d-flex flex-column gap-2">
                {PAYMENT_METHODS.map((method) => {
                  const cfg = methodConfig[method] || { icon: FaCreditCard, label: method, desc: '' };
                  const Icon = cfg.icon;
                  const isSelected = paymentMethod === method;

                  return (
                    <div
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-3 d-flex align-items-center gap-3 cursor-pointer transition-fast ${isSelected ? 'glass-panel border-cyan' : ''}`}
                      style={{
                        background: isSelected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1.5px solid var(--cyan-neon)' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: isSelected ? 'var(--cyan-neon)' : 'rgba(255, 255, 255, 0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? '#040714' : '#cbd5e1'
                      }}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-700 text-white" style={{ fontSize: '0.92rem' }}>{cfg.label}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.76rem' }}>{cfg.desc}</div>
                      </div>
                      {isSelected && <FaCheckCircle color="var(--cyan-neon)" size={16} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirmation CTA */}
            <Button 
              className="btn-cyber-emerald w-100 py-3 fw-bold" 
              onClick={handlePayment} 
              disabled={processing}
            >
              {processing ? (
                <><Spinner size="sm" className="me-2" /> Processing Bank Switch...</>
              ) : (
                <><FaLock className="me-2" /> Complete Payment of {formatCurrency(booking?.total_amount)}</>
              )}
            </Button>

            <div className="text-center mt-3" style={{ color: '#64748b', fontSize: '0.78rem' }}>
              🔒 Simulated Payment Switch for College Evaluation • Zero Real Deductions
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
