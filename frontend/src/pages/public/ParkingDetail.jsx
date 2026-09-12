/**
 * Parking Detail — V3 Smart Bay Floor Plan & Reservation Terminal
 * Visual parking bays with lane lines, real-time rate calculator, and instant booking lock.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, FaClock, FaParking, FaCar, FaArrowLeft, FaSearch, 
  FaShoppingCart, FaBolt, FaMotorcycle, FaCheckCircle, FaTimesCircle, FaShieldAlt
} from 'react-icons/fa';
import locationService from '../../services/locationService';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, getTodayDate, getErrorMessage } from '../../utils/helpers';
import { VEHICLE_ICONS } from '../../utils/constants';

export default function ParkingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [location, setLocation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState(getTodayDate());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [vehicleType, setVehicleType] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await locationService.getById(id);
        setLocation(res.data.location);
        setSlots(res.data.location.slots || []);
      } catch (err) {
        setError('Failed to load parking location details.');
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [id]);

  const checkAvailability = async () => {
    setSlotsLoading(true);
    setSelectedSlot(null);
    setError('');
    try {
      const params = { date: bookingDate, start_time: startTime, end_time: endTime };
      if (vehicleType) params.vehicle_type = vehicleType;
      const res = await locationService.getSlots(id, params);
      setSlots(res.data.slots);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) { 
      navigate('/login'); 
      return; 
    }
    if (!selectedSlot) return;
    setBookingLoading(true);
    setError('');
    try {
      const res = await bookingService.create({
        slot_id: selectedSlot.id,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
      });
      navigate(`/user/booking/${res.data.booking.id}/payment`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedSlot) return 0;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const hours = (eh + em / 60) - (sh + sm / 60);
    return hours > 0 ? (hours * selectedSlot.price_per_hour).toFixed(2) : 0;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--cyan-neon)', width: '3rem', height: '3rem' }} />
        <p style={{ color: '#94a3b8', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
          Loading facility telemetry...
        </p>
      </Container>
    );
  }

  if (!location) {
    return (
      <Container className="py-5 text-center">
        <div className="cyber-card p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="text-white fw-700 mb-3">Facility Node Not Found</h4>
          <Button onClick={() => navigate('/locations')} className="btn-cyber-primary">
            Return to All Locations
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Back link */}
      <button 
        onClick={() => navigate('/locations')} 
        className="btn p-0 mb-3 d-inline-flex align-items-center gap-2 border-0" 
        style={{ color: 'var(--cyan-neon)', fontSize: '0.9rem', background: 'transparent' }}
      >
        <FaArrowLeft /> Back to Parking Hubs
      </button>

      {/* ── Facility Command Header ─────────────────────────── */}
      <div className="cyber-card p-4 mb-4 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(14, 24, 58, 0.9), rgba(6, 10, 26, 0.95))',
        border: '1px solid rgba(0, 242, 254, 0.25)'
      }}>
        <Row className="align-items-center g-3">
          <Col lg={8}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge-cyber badge-cyber-emerald">
                <span className="radar-dot"></span> SENSORS ACTIVE
              </span>
              <span className="badge-cyber badge-cyber-cyan">
                NODE ID: CHN-0{location.id}
              </span>
            </div>
            <h2 className="fw-900 text-white mb-2" style={{ fontSize: '2.2rem' }}>
              {location.name}
            </h2>
            <div className="d-flex flex-wrap gap-4 text-muted" style={{ fontSize: '0.88rem' }}>
              <span className="text-light">
                <FaMapMarkerAlt className="text-danger me-1" /> {location.address}, {location.city}
              </span>
              <span className="text-light">
                <FaClock className="text-warning me-1" /> {location.opening_time} — {location.closing_time}
              </span>
            </div>
          </Col>

          <Col lg={4} className="text-lg-end">
            <div className="d-inline-flex flex-column align-items-lg-end glass-panel p-3 px-4 rounded-3 border border-secondary border-opacity-25">
              <div className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>AVAILABLE CAPACITY</div>
              <div className="font-display fw-900 gradient-text-cyber" style={{ fontSize: '2rem' }}>
                {location.available_slots} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ {location.total_slots} Bays</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="cyber-card mb-4 border-danger text-white" style={{ background: 'rgba(255, 51, 102, 0.15)' }}>
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {/* ── Left Sidebar: Reservation Control & Pricing ───── */}
        <Col lg={4}>
          {/* Reservation Config Card */}
          <div className="cyber-card p-4 mb-4">
            <h5 className="fw-700 text-white mb-3 d-flex align-items-center gap-2">
              <FaClock color="#00f2fe" /> Reservation Window
            </h5>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Date of Arrival</Form.Label>
              <Form.Control 
                type="date" 
                value={bookingDate} 
                min={getTodayDate()} 
                onChange={(e) => setBookingDate(e.target.value)} 
              />
            </Form.Group>

            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Label className="form-label">Check-In</Form.Label>
                <Form.Control 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="form-label">Exit By</Form.Label>
                <Form.Control 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                />
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="form-label">Vehicle Filter</Form.Label>
              <Form.Select 
                value={vehicleType} 
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">All Bay Types</option>
                <option value="Car">🚗 Passenger Car / SUV</option>
                <option value="Bike">🏍️ Two-Wheeler / Scooter</option>
                <option value="EV">⚡ Electric Vehicle (EV Charger)</option>
              </Form.Select>
            </Form.Group>

            <Button 
              className="btn-cyber-primary w-100 py-2" 
              onClick={checkAvailability} 
              disabled={slotsLoading}
            >
              {slotsLoading ? <Spinner size="sm" className="me-2" /> : <FaSearch className="me-2" />}
              Refresh Slot Availability
            </Button>
          </div>

          {/* Selected Bay Confirmation Card */}
          {selectedSlot ? (
            <div className="cyber-card p-4 animate-fade-up" style={{
              background: 'linear-gradient(135deg, rgba(16, 231, 157, 0.1), rgba(10, 16, 38, 0.95))',
              borderColor: 'rgba(16, 231, 157, 0.4)'
            }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge-cyber badge-cyber-emerald">BAY LOCKED</span>
                <span className="font-mono fw-800 text-info" style={{ fontSize: '1.2rem' }}>
                  {formatCurrency(selectedSlot.price_per_hour)}/hr
                </span>
              </div>

              <div className="font-mono fw-900 text-white mb-2" style={{ fontSize: '1.6rem' }}>
                BAY #{selectedSlot.slot_number}
              </div>

              <div className="d-flex flex-column gap-2 mb-3 pb-3 border-bottom border-secondary border-opacity-25" style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Vehicle Type:</span>
                  <span className="fw-600">{VEHICLE_ICONS[selectedSlot.vehicle_type] || '🚗'} {selectedSlot.vehicle_type}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Reserved Date:</span>
                  <span className="font-mono">{bookingDate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Window:</span>
                  <span className="font-mono text-warning">{startTime} — {endTime}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="text-muted">Total Payable:</span>
                <span className="font-display fw-900 gradient-text-emerald" style={{ fontSize: '1.8rem' }}>
                  {formatCurrency(calculateTotal())}
                </span>
              </div>

              <Button 
                className="btn-cyber-emerald w-100 py-3 fw-bold"
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? <Spinner size="sm" className="me-2" /> : <FaShoppingCart className="me-2" />}
                {isAuthenticated ? 'Lock Spot & Proceed to Pay' : 'Sign In to Reserve'}
              </Button>
            </div>
          ) : (
            <div className="cyber-card p-4 text-center">
              <FaParking size={36} className="text-muted mb-2" />
              <div className="fw-700 text-white mb-1">No Bay Selected</div>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 0 }}>
                Click any available <span className="text-success fw-bold">GREEN</span> bay on the floor plan to inspect rates and book.
              </p>
            </div>
          )}
        </Col>

        {/* ── Right Column: Interactive Parking Lot Floor Plan ─ */}
        <Col lg={8}>
          <div className="cyber-card p-4">
            {/* Terminal Top Bar */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 mb-4 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <FaParking color="#00f2fe" size={20} />
                <h5 className="fw-700 text-white mb-0">Floor Layout Plan</h5>
              </div>

              {/* Status Legend */}
              <div className="d-flex gap-3 font-mono" style={{ fontSize: '0.74rem' }}>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--emerald-neon)' }}></span>
                  <span className="text-muted">Available</span>
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--rose-neon)' }}></span>
                  <span className="text-muted">Occupied</span>
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--cyan-neon)' }}></span>
                  <span className="text-muted">Selected</span>
                </span>
              </div>
            </div>

            {/* Entry Gate Indicator */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center gap-2 px-4 py-1 rounded-pill" style={{
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                color: 'var(--cyan-neon)'
              }}>
                <span>⬇ FASTTAG ENTRY BOOM BARRIER</span>
              </div>
            </div>

            {/* Slot Grid Floor Layout */}
            {slotsLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
                <p className="mt-2 text-muted font-mono" style={{ fontSize: '0.85rem' }}>Refreshing bay sensors...</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No slots available for the selected filters.</p>
              </div>
            ) : (
              <Row className="g-3">
                {slots.map((slot) => {
                  const isAvailable = slot.is_available !== undefined ? slot.is_available : slot.status === 'available';
                  const isMaintenance = slot.status === 'maintenance';
                  const isSelected = selectedSlot?.id === slot.id;
                  const isEV = slot.vehicle_type === 'EV';

                  let bayClass = 'available';
                  if (isMaintenance) bayClass = 'maintenance';
                  else if (!isAvailable) bayClass = 'occupied';
                  if (isSelected) bayClass = 'selected';

                  return (
                    <Col xs={6} sm={4} md={3} key={slot.id}>
                      <div
                        onClick={() => {
                          if (isAvailable && !isMaintenance) {
                            setSelectedSlot(isSelected ? null : slot);
                          }
                        }}
                        className={`parking-bay-card ${bayClass} ${isEV ? 'ev-bay' : ''}`}
                      >
                        {/* Bay Header */}
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="font-mono fw-800" style={{ 
                            fontSize: '1rem', 
                            color: isSelected ? 'var(--cyan-neon)' : isAvailable ? '#ffffff' : '#64748b' 
                          }}>
                            {slot.slot_number}
                          </span>
                          {isEV && <FaBolt color="#00f2fe" size={12} title="EV Bay" />}
                        </div>

                        {/* Vehicle Icon & Type */}
                        <div className="py-2">
                          <div style={{ fontSize: '1.4rem' }}>
                            {VEHICLE_ICONS[slot.vehicle_type] || '🚗'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {slot.vehicle_type}
                          </div>
                        </div>

                        {/* Status / Rate Footer */}
                        <div className="pt-1 border-top border-white border-opacity-10">
                          {isMaintenance ? (
                            <span className="badge-cyber badge-cyber-rose py-0 px-1" style={{ fontSize: '0.65rem' }}>SERVICE</span>
                          ) : !isAvailable ? (
                            <span className="badge-cyber badge-cyber-rose py-0 px-1" style={{ fontSize: '0.65rem' }}>OCCUPIED</span>
                          ) : (
                            <span className="font-mono fw-700" style={{ fontSize: '0.8rem', color: 'var(--emerald-neon)' }}>
                              ₹{slot.price_per_hour}/h
                            </span>
                          )}
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            )}

            {/* Exit Gate Indicator */}
            <div className="text-center mt-4 pt-2">
              <div className="d-inline-flex align-items-center gap-2 px-4 py-1 rounded-pill" style={{
                background: 'rgba(16, 231, 157, 0.08)',
                border: '1px solid rgba(16, 231, 157, 0.3)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                color: 'var(--emerald-neon)'
              }}>
                <span>⬆ CONTACTLESS AUTOMATED EXIT BARRIER</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
