/**
 * Booking Detail Page — V3 Digital VIP Boarding Keycard Pass
 * Holographic ticket card with scannable QR, barrier instructions, and receipt download.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { 
  FaArrowLeft, FaQrcode, FaDownload, FaTimesCircle, FaMapMarkerAlt, 
  FaClock, FaCalendarAlt, FaCar, FaShieldAlt, FaPrint, FaCheckCircle 
} from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import { formatDate, formatTime, formatCurrency, getErrorMessage } from '../../utils/helpers';
import { VEHICLE_ICONS } from '../../utils/constants';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await bookingService.getById(id);
        setBooking(res.data.booking);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking pass? This cannot be undone.')) return;
    setCancelLoading(true);
    try {
      await bookingService.cancel(id);
      const res = await bookingService.getById(id);
      setBooking(res.data.booking);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCancelLoading(false);
    }
  };

  const downloadQR = () => {
    if (!booking?.qr_code) return;
    const link = document.createElement('a');
    link.href = booking.qr_code;
    link.download = `ParkSite_Pass_${booking.booking_reference}.png`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }} />
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Generating digital keycard pass...</p>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="py-5 text-center">
        <div className="ps-card p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="fw-700" style={{ color: 'var(--text-primary)' }}>Parking Pass Not Found</h4>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          <Button onClick={() => navigate('/user/dashboard')} className="ps-btn-primary mt-3">
            Return to Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  const isConfirmed = booking.status === 'confirmed';

  return (
    <Container className="py-4">
      {/* Navigation link */}
      <button 
        onClick={() => navigate('/user/dashboard')} 
        className="btn p-0 mb-3 d-inline-flex align-items-center gap-2 border-0 text-decoration-none" 
        style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600, background: 'transparent' }}
      >
        <FaArrowLeft /> Back to Dashboard
      </button>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
          {error}
        </Alert>
      )}

      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          {/* ── The Digital Boarding Keycard Pass ─────────────── */}
          <div className="digital-ticket-pass mb-4">
            <div className="ticket-notch-left"></div>
            <div className="ticket-notch-right"></div>

            {/* Pass Header */}
            <div className="p-4 pb-3 d-flex justify-content-between align-items-start border-bottom" style={{ borderColor: '#E2E8F0' }}>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCar size={16} color="var(--primary)" />
                  </div>
                  <span className="fw-800" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    Park<span style={{ color: 'var(--primary)' }}>Site</span>
                  </span>
                  <span className="ps-badge ps-badge-primary py-0 px-2" style={{ fontSize: '0.7rem' }}>
                    SMART KEYCARD PASS
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  AUTOMATED SENSOR & BARRIER ACCESS TOKEN
                </div>
              </div>

              <div className="text-end">
                <span className={`ps-badge ${
                  booking.status === 'confirmed' ? 'ps-badge-success' :
                  booking.status === 'cancelled' ? 'ps-badge-danger' :
                  'ps-badge-primary'
                }`}>
                  {booking.status?.toUpperCase()}
                </span>
                <div className="fw-800 mt-1" style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
                  {formatCurrency(booking.total_amount)}
                </div>
              </div>
            </div>

            {/* Pass Body Content */}
            <div className="p-4">
              <Row className="g-4 align-items-center">
                {/* Left Side: Booking Details */}
                <Col md={7}>
                  <div className="mb-3">
                    <div className="fw-700 text-uppercase mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                      FACILITY LOCATION
                    </div>
                    <div className="fw-800" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                      {booking.location?.name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }} className="d-flex align-items-center gap-1 mt-0.5">
                      <FaMapMarkerAlt className="text-danger flex-shrink-0" /> {booking.location?.address}
                    </div>
                  </div>

                  <Row className="g-3 mb-3">
                    <Col xs={6}>
                      <div className="fw-700 text-uppercase mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                        RESERVED BAY
                      </div>
                      <div className="fw-800" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                        BAY #{booking.slot?.slot_number}
                      </div>
                      <div className="d-inline-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>
                        {VEHICLE_ICONS[booking.slot?.vehicle_type] || '🚗'} {booking.slot?.vehicle_type?.toUpperCase()}
                      </div>
                    </Col>

                    <Col xs={6}>
                      <div className="fw-700 text-uppercase mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                        PERMIT DATE & WINDOW
                      </div>
                      <div className="fw-700" style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                        {formatDate(booking.booking_date)}
                      </div>
                      <div className="fw-600 mt-1" style={{ fontSize: '0.84rem', color: '#D97706' }}>
                        <FaClock className="me-1" size={12} />
                        {formatTime(booking.start_time)} — {formatTime(booking.end_time)}
                      </div>
                    </Col>
                  </Row>

                  <div className="p-2.5 px-3 rounded-3 d-flex justify-content-between align-items-center" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span className="fw-600 text-uppercase" style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>PASS REFERENCE</span>
                    <span className="font-mono fw-800" style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {booking.booking_reference}
                    </span>
                  </div>
                </Col>

                {/* Right Side: QR Scanner Box */}
                <Col md={5} className="text-center">
                  <div className="p-3 rounded-4 d-inline-block" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    {booking.qr_code ? (
                      <div>
                        <img 
                          src={booking.qr_code} 
                          alt="Dynamic QR Keycard" 
                          style={{ 
                            width: '160px', 
                            height: '160px', 
                            borderRadius: '10px',
                            background: '#ffffff',
                            padding: '6px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                          }} 
                        />
                      </div>
                    ) : (
                      <div className="p-4" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <FaQrcode size={48} className="mb-2" />
                        <div>Generating QR Token...</div>
                      </div>
                    )}
                    <div className="fw-700 mt-2" style={{ fontSize: '0.72rem', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                      HOLD TO GATE SCANNER
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Perforation Line */}
              <div className="ticket-perforation"></div>

              {/* Barrier Access Guide */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div className="d-flex align-items-center gap-2">
                  <FaShieldAlt color="var(--success)" />
                  <span>Encrypted 256-Bit Pass • Contactless Sensor Barrier Lift</span>
                </div>
                <div className="font-mono fw-600" style={{ color: 'var(--text-secondary)' }}>
                  TOKEN ID: #{String(booking.id).padStart(6, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            {booking.qr_code && (
              <Button onClick={downloadQR} className="ps-btn-primary py-2.5 px-4">
                <FaDownload className="me-2" /> Save Keycard PNG
              </Button>
            )}
            <Button onClick={handlePrint} className="ps-btn-outline py-2.5 px-4">
              <FaPrint className="me-2" /> Print Pass Receipt
            </Button>
            {isConfirmed && (
              <Button 
                variant="outline-danger"
                onClick={handleCancel} 
                disabled={cancelLoading}
                className="py-2.5 px-3 d-inline-flex align-items-center gap-2"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {cancelLoading ? <Spinner size="sm" /> : <FaTimesCircle />}
                Cancel Pass
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
