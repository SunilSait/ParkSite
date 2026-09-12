/**
 * Parking Detail — Professional Smart Bay Floor Plan & Reservation Terminal
 * Visual parking bays with clear status, real-time rate calculator, and instant booking lock.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, FaClock, FaParking, FaCar, FaArrowLeft, FaSearch, 
  FaShoppingCart, FaBolt 
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
        <Spinner animation="border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }} />
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Loading facility details...
        </p>
      </Container>
    );
  }

  if (!location) {
    return (
      <Container className="py-5 text-center">
        <div className="ps-card p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="fw-700 mb-3" style={{ color: 'var(--text-primary)' }}>Facility Not Found</h4>
          <Button onClick={() => navigate('/locations')} className="ps-btn-primary">
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
        style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.92rem', background: 'transparent' }}
      >
        <FaArrowLeft /> Back to Parking Hubs
      </button>

      {/* ── Facility Header ─────────────────────────── */}
      <div className="ps-card p-4 mb-4">
        <Row className="align-items-center g-3">
          <Col lg={8}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="ps-badge ps-badge-success">
                <span className="ps-badge-dot"></span> SENSORS ACTIVE
              </span>
              <span className="ps-badge ps-badge-primary">
                NODE ID: CHN-0{location.id}
              </span>
            </div>
            <h2 className="fw-800 mb-2" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
              {location.name}
            </h2>
            <div className="d-flex flex-wrap gap-4" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>
                <FaMapMarkerAlt className="text-primary me-1" /> {location.address}, {location.city}
              </span>
              <span>
                <FaClock className="text-warning me-1" /> {location.opening_time} — {location.closing_time}
              </span>
            </div>
          </Col>

          <Col lg={4} className="text-lg-end">
            <div className="d-inline-flex flex-column align-items-lg-end p-3 px-4 rounded-3" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.04em' }}>AVAILABLE CAPACITY</div>
              <div className="fw-800" style={{ fontSize: '2rem', color: 'var(--primary)' }}>
                {location.available_slots} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ {location.total_slots} Bays</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {/* ── Left Sidebar: Reservation Control & Pricing ───── */}
        <Col lg={4}>
          {/* Reservation Config Card */}
          <div className="ps-card p-4 mb-4">
            <h5 className="fw-700 mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FaClock className="text-primary" /> Reservation Window
            </h5>

            <Form.Group className="mb-3">
              <Form.Label className="ps-form-label">Date of Arrival</Form.Label>
              <Form.Control 
                type="date" 
                value={bookingDate} 
                min={getTodayDate()} 
                onChange={(e) => setBookingDate(e.target.value)} 
              />
            </Form.Group>

            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Label className="ps-form-label">Check-In</Form.Label>
                <Form.Control 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="ps-form-label">Exit By</Form.Label>
                <Form.Control 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                />
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="ps-form-label">Vehicle Filter</Form.Label>
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
              className="ps-btn-primary w-100 py-2.5" 
              onClick={checkAvailability} 
              disabled={slotsLoading}
            >
              {slotsLoading ? <Spinner size="sm" className="me-2" /> : <FaSearch className="me-2" />}
              Refresh Slot Availability
            </Button>
          </div>

          {/* Selected Bay Confirmation Card */}
          {selectedSlot ? (
            <div className="ps-card p-4 animate-fade-up" style={{ border: '2px solid var(--primary)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="ps-badge ps-badge-success">
                  <span className="ps-badge-dot"></span> BAY LOCKED
                </span>
                <span className="fw-800" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                  {formatCurrency(selectedSlot.price_per_hour)}/hr
                </span>
              </div>

              <div className="fw-800 mb-2" style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
                BAY #{selectedSlot.slot_number}
              </div>

              <div className="d-flex flex-column gap-2 mb-3 pb-3 border-bottom" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <div className="d-flex justify-content-between">
                  <span>Vehicle Type:</span>
                  <span className="fw-600" style={{ color: 'var(--text-primary)' }}>{VEHICLE_ICONS[selectedSlot.vehicle_type] || '🚗'} {selectedSlot.vehicle_type}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Reserved Date:</span>
                  <span className="fw-600" style={{ color: 'var(--text-primary)' }}>{bookingDate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Window:</span>
                  <span className="fw-600 text-warning">{startTime} — {endTime}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span style={{ color: 'var(--text-secondary)' }}>Total Payable:</span>
                <span className="fw-800" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>
                  {formatCurrency(calculateTotal())}
                </span>
              </div>

              <Button 
                className="ps-btn-primary w-100 py-3 fw-bold"
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? <Spinner size="sm" className="me-2" /> : <FaShoppingCart className="me-2" />}
                {isAuthenticated ? 'Lock Spot & Proceed to Pay' : 'Sign In to Reserve'}
              </Button>
            </div>
          ) : (
            <div className="ps-card p-4 text-center">
              <FaParking size={36} style={{ color: 'var(--border-medium)' }} className="mb-2" />
              <div className="fw-700 mb-1" style={{ color: 'var(--text-primary)' }}>No Bay Selected</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 0 }}>
                Click any available <span className="text-success fw-bold">GREEN</span> bay on the floor plan to inspect rates and book.
              </p>
            </div>
          )}
        </Col>

        {/* ── Right Column: Interactive Parking Lot Floor Plan ─ */}
        <Col lg={8}>
          <div className="ps-card p-4">
            {/* Terminal Top Bar */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 mb-4 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <FaParking className="text-primary" size={20} />
                <h5 className="fw-700 mb-0" style={{ color: 'var(--text-primary)' }}>Floor Layout Plan</h5>
              </div>

              {/* Status Legend */}
              <div className="d-flex gap-3" style={{ fontSize: '0.8rem' }}>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--success)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Available</span>
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--danger)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Occupied</span>
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--primary)' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Selected</span>
                </span>
              </div>
            </div>

            {/* Entry Gate Indicator */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center gap-2 px-4 py-1.5 rounded-pill" style={{
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-100)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--primary)'
              }}>
                <span>⬇ FASTTAG ENTRY BOOM BARRIER</span>
              </div>
            </div>

            {/* Slot Grid Floor Layout */}
            {slotsLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                <p className="mt-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Refreshing bay sensors...</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-5">
                <p style={{ color: 'var(--text-secondary)' }}>No slots available for the selected filters.</p>
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
                          <span className="fw-800" style={{ 
                            fontSize: '1rem', 
                            color: isSelected ? 'var(--primary)' : isAvailable ? '#15803D' : '#991B1B' 
                          }}>
                            {slot.slot_number}
                          </span>
                          {isEV && <FaBolt color="#2563EB" size={12} title="EV Bay" />}
                        </div>

                        {/* Vehicle Icon & Type */}
                        <div className="py-2">
                          <div style={{ fontSize: '1.4rem' }}>
                            {VEHICLE_ICONS[slot.vehicle_type] || '🚗'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {slot.vehicle_type}
                          </div>
                        </div>

                        {/* Status / Rate Footer */}
                        <div className="pt-1.5 border-top" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                          {isMaintenance ? (
                            <span className="ps-badge ps-badge-danger py-0 px-1" style={{ fontSize: '0.65rem' }}>SERVICE</span>
                          ) : !isAvailable ? (
                            <span className="ps-badge ps-badge-danger py-0 px-1" style={{ fontSize: '0.65rem' }}>OCCUPIED</span>
                          ) : (
                            <span className="fw-700" style={{ fontSize: '0.82rem', color: '#15803D' }}>
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
              <div className="d-inline-flex align-items-center gap-2 px-4 py-1.5 rounded-pill" style={{
                background: 'var(--success-light)',
                border: '1px solid #BBF7D0',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--success)'
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
