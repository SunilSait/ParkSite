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
        <Spinner animation="border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }} />
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Initializing secure payment terminal...</p>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="ps-card text-center p-5 animate-fade-up">
              <div style={{
                width: '76px', height: '76px', borderRadius: '50%',
                background: '#F0FDF4',
                border: '2px solid #BBF7D0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <FaCheckCircle size={36} color="var(--success)" />
              </div>
              <span className="ps-badge ps-badge-success mb-2">TRANSACTION CONFIRMED</span>
              <h2 className="fw-800 mb-2" style={{ color: 'var(--text-primary)' }}>Payment Settled!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Your smart bay is reserved. Digital QR pass is issued and synced with barrier nodes.
              </p>
              <div className="d-flex align-items-center justify-content-center gap-2" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
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
          <div className="ps-card p-4 p-md-5">
            {/* Terminal Header */}
            <div className="text-center mb-4 pb-3 border-bottom">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <FaShieldAlt color="var(--success)" size={16} />
                <span className="fw-700" style={{ fontSize: '0.78rem', color: 'var(--success)', letterSpacing: '0.04em' }}>
                  256-BIT ENCRYPTED DEMO GATEWAY
                </span>
              </div>
              <div className="fw-700 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                TOTAL PAYABLE TARIFF
              </div>
              <div className="fw-900" style={{ fontSize: '3rem', lineHeight: 1.1, color: 'var(--primary)', margin: '0.25rem 0' }}>
                {formatCurrency(booking?.total_amount)}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
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
              <div className="fw-700 text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
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
                      className="p-3 rounded-3 d-flex align-items-center gap-3 cursor-pointer"
                      style={{
                        background: isSelected ? '#EFF6FF' : '#FFFFFF',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: isSelected ? 'var(--primary)' : '#F1F5F9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? '#FFFFFF' : 'var(--text-primary)'
                      }}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-700" style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{cfg.label}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{cfg.desc}</div>
                      </div>
                      {isSelected && <FaCheckCircle color="var(--primary)" size={18} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirmation CTA */}
            <Button 
              className="ps-btn-primary w-100 py-3 fw-bold" 
              onClick={handlePayment} 
              disabled={processing}
            >
              {processing ? (
                <><Spinner size="sm" className="me-2" /> Processing Bank Switch...</>
              ) : (
                <><FaLock className="me-2" /> Complete Payment of {formatCurrency(booking?.total_amount)}</>
              )}
            </Button>

            <div className="text-center mt-3" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
              🔒 Simulated Payment Switch for College Evaluation • Zero Real Deductions
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
