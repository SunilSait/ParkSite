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
        <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
        <p className="mt-2 text-muted font-mono">Generating digital keycard pass...</p>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="py-5 text-center">
        <div className="cyber-card p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="text-white fw-700">Parking Pass Not Found</h4>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          <Button onClick={() => navigate('/user/dashboard')} className="btn-cyber-primary mt-3">
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
        className="btn p-0 mb-3 d-inline-flex align-items-center gap-2 border-0" 
        style={{ color: 'var(--cyan-neon)', fontSize: '0.9rem', background: 'transparent' }}
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
            <div className="p-4 pb-3 d-flex justify-content-between align-items-start border-bottom border-white border-opacity-10">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="brand-text" style={{ fontSize: '1.2rem' }}>
                    Park<span className="gradient-text-cyber">Site</span>
                  </span>
                  <span className="badge-cyber badge-cyber-cyan py-0 px-2" style={{ fontSize: '0.65rem' }}>
                    DIGITAL VIP PASS
                  </span>
                </div>
                <div className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>
                  AUTOMATED BARRIER ACCESS TOKEN
                </div>
              </div>

              <div className="text-end">
                <span className={`badge-cyber ${
                  booking.status === 'confirmed' ? 'badge-cyber-emerald' :
                  booking.status === 'cancelled' ? 'badge-cyber-rose' :
                  'badge-cyber-cyan'
                }`}>
                  {booking.status?.toUpperCase()}
                </span>
                <div className="font-mono fw-800 text-white mt-1" style={{ fontSize: '1.2rem' }}>
                  {formatCurrency(booking.total_amount)}
                </div>
              </div>
            </div>

            {/* Pass Body Content */}
            <div className="p-4">
              <Row className="g-4 align-items-center">
                {/* Left Side: Booking Telemetry Details */}
                <Col md={7}>
                  <div className="mb-3">
                    <div className="font-mono text-muted" style={{ fontSize: '0.72rem' }}>FACILITY LOCATION</div>
                    <div className="fw-700 text-white" style={{ fontSize: '1.1rem' }}>
                      {booking.location?.name}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                      <FaMapMarkerAlt className="text-danger me-1" /> {booking.location?.address}
                    </div>
                  </div>

                  <Row className="g-3 mb-3">
                    <Col xs={6}>
                      <div className="font-mono text-muted" style={{ fontSize: '0.72rem' }}>RESERVED BAY</div>
                      <div className="font-mono fw-800 text-info" style={{ fontSize: '1.4rem' }}>
                        BAY #{booking.slot?.slot_number}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                        {VEHICLE_ICONS[booking.slot?.vehicle_type] || '🚗'} {booking.slot?.vehicle_type}
                      </div>
                    </Col>

                    <Col xs={6}>
                      <div className="font-mono text-muted" style={{ fontSize: '0.72rem' }}>PERMIT DATE</div>
                      <div className="font-mono fw-700 text-white" style={{ fontSize: '0.95rem' }}>
                        {formatDate(booking.booking_date)}
                      </div>
                      <div className="font-mono text-warning" style={{ fontSize: '0.82rem' }}>
                        {formatTime(booking.start_time)} — {formatTime(booking.end_time)}
                      </div>
                    </Col>
                  </Row>

                  <div className="p-2 px-3 rounded-3 glass-panel d-flex justify-content-between align-items-center">
                    <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>PASS REFERENCE</span>
                    <span className="font-mono fw-800 text-success" style={{ fontSize: '0.85rem' }}>
                      {booking.booking_reference}
                    </span>
                  </div>
                </Col>

                {/* Right Side: High-Tech QR Scanner Code */}
                <Col md={5} className="text-center">
                  <div className="p-3 rounded-4 glass-panel d-inline-block border border-info border-opacity-30">
                    {booking.qr_code ? (
                      <div className="position-relative">
                        <img 
                          src={booking.qr_code} 
                          alt="Dynamic QR Keycard" 
                          style={{ 
                            width: '160px', 
                            height: '160px', 
                            borderRadius: '10px',
                            background: '#ffffff',
                            padding: '6px'
                          }} 
                        />
                        <div className="radar-scan-line"></div>
                      </div>
                    ) : (
                      <div className="p-4 text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                        <FaQrcode size={48} className="mb-2" />
                        <div>QR Token Generating</div>
                      </div>
                    )}
                    <div className="font-mono mt-2" style={{ fontSize: '0.7rem', color: 'var(--cyan-neon)' }}>
                      HOLD TO GATE SCANNER
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Perforation Line */}
              <div className="ticket-perforation"></div>

              {/* Barrier Access Guide */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                <div className="d-flex align-items-center gap-2">
                  <FaShieldAlt color="#10e79d" />
                  <span>Encrypted 256-Bit Pass • Contactless Sensor Barrier Lift</span>
                </div>
                <div className="font-mono text-info">
                  TOKEN ID: #{String(booking.id).padStart(6, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            {booking.qr_code && (
              <Button onClick={downloadQR} className="btn-cyber-primary py-2 px-4">
                <FaDownload className="me-2" /> Save Keycard PNG
              </Button>
            )}
            <Button onClick={handlePrint} className="btn-cyber-outline py-2 px-4">
              <FaPrint className="me-2" /> Print Pass Receipt
            </Button>
            {isConfirmed && (
              <Button 
                onClick={handleCancel} 
                disabled={cancelLoading}
                className="btn btn-outline-danger rounded-3 py-2 px-3 d-inline-flex align-items-center gap-2"
                style={{ border: '1px solid rgba(255, 51, 102, 0.4)', background: 'rgba(255, 51, 102, 0.08)' }}
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
