/**
 * Parking Locations — Clean Professional SaaS Explorer
 * Real-time slot telemetry, clean filter controls, occupancy progress, and instant reservation entry.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, FaClock, FaParking, FaSearch, FaArrowRight, FaCar, 
  FaRedoAlt 
} from 'react-icons/fa';
import locationService from '../../services/locationService';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (city) params.city = city;
      const res = await locationService.getAll(params);
      setLocations(res.data.locations || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLocations();
  };

  const handleReset = () => {
    setSearch('');
    setCity('');
    fetchLocations();
  };

  return (
    <Container className="py-5">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="text-center mb-5 animate-fade-down">
        <div className="ps-section-label mb-2">
          <FaParking /> Live Parking Network
        </div>
        <h1 className="ps-section-title mb-2" style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)' }}>
          Chennai Parking <span style={{ color: 'var(--primary)' }}>Hubs & Terminals</span>
        </h1>
        <p className="ps-section-subtitle mx-auto text-center" style={{ maxWidth: '580px' }}>
          Explore live IoT sensor occupancy, compare amenities, and reserve guaranteed bays in advance
        </p>
      </div>

      {/* ── Search & Filter Control Panel ─────────────────── */}
      <div className="ps-search-panel mb-5 animate-fade-up">
        <Form onSubmit={handleSearch}>
          <Row className="g-3 align-items-start">
            <Col lg={5} md={6}>
              <label className="ps-search-label">Search Facility Name or Area</label>
              <div className="ps-search-input-wrap">
                <FaSearch className="ps-search-icon" />
                <Form.Control 
                  className="ps-search-control"
                  placeholder="e.g. Anna Nagar, T. Nagar, Airport..."
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
            </Col>

            <Col lg={4} md={6}>
              <label className="ps-search-label">City / Region</label>
              <div className="ps-search-input-wrap">
                <FaMapMarkerAlt className="ps-search-icon" />
                <Form.Control 
                  className="ps-search-control"
                  placeholder="Filter by city (e.g. Chennai)"
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                />
              </div>
            </Col>

            <Col lg={3} md={12}>
              <label className="ps-search-label invisible d-none d-lg-block">&nbsp;</label>
              <div className="d-flex gap-2">
                <Button type="submit" className="ps-search-btn flex-fill">
                  <FaSearch size={14} /> Search Hubs
                </Button>
                <button 
                  type="button" 
                  onClick={handleReset} 
                  className="ps-search-reset-btn" 
                  title="Reset Filters"
                >
                  <FaRedoAlt size={14} />
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      {/* ── Locations Grid ─────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }} />
          <p style={{ color: 'var(--text-secondary)', marginTop: '1.2rem', fontFamily: 'var(--font-mono)' }}>
            Querying ultrasonic bay sensors...
          </p>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-5 ps-card p-5">
          <FaParking size={56} style={{ color: 'var(--border-medium)' }} className="mb-3" />
          <h4 className="fw-700 mb-2" style={{ color: 'var(--text-primary)' }}>No Parking Locations Found</h4>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Try clearing your search query or city filter to view all available transit facilities.
          </p>
          <Button onClick={handleReset} className="ps-btn-primary py-2 px-4">
            Show All Hubs
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {locations.map((loc) => {
            const occupancyPct = loc.total_slots > 0 
              ? Math.round(((loc.total_slots - loc.available_slots) / loc.total_slots) * 100) 
              : 0;

            const isAvailable = loc.available_slots > 0;

            return (
              <Col md={6} lg={4} key={loc.id}>
                <div className="ps-hub-card h-100 d-flex flex-column justify-content-between">
                  <div>
                    {/* Header Row */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className={`ps-badge ${isAvailable ? 'ps-badge-success' : 'ps-badge-danger'}`}>
                        <span className="ps-badge-dot"></span>
                        {isAvailable ? `${loc.available_slots} BAYS OPEN` : 'FULLY OCCUPIED'}
                      </span>
                      <span className="fw-800" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                        ₹{loc.rate_per_hour || 40}<span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/hr</span>
                      </span>
                    </div>

                    <h4 className="ps-hub-name mb-1">
                      {loc.name}
                    </h4>
                    
                    <p className="ps-hub-location mb-3">
                      <FaMapMarkerAlt className="me-1 text-primary" /> {loc.address}, {loc.city}
                    </p>

                    {/* Operational Timings */}
                    <div className="d-flex gap-3 mb-3 p-2 px-3 rounded-3" style={{ background: 'var(--bg-gray-100)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span><FaClock className="me-1 text-warning" /> {loc.opening_time || '06:00'} — {loc.closing_time || '23:00'}</span>
                      <span><FaCar className="me-1 text-primary" /> {loc.total_slots} Total Bays</span>
                    </div>

                    {loc.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                        {loc.description}
                      </p>
                    )}

                    {/* Capacity Progress Bar */}
                    <div className="ps-capacity-wrap">
                      <div className="ps-capacity-header">
                        <span className="ps-capacity-label">Capacity Occupied</span>
                        <span className="ps-capacity-stat">
                          <span 
                            className="ps-capacity-pct"
                            style={{
                              color: occupancyPct > 80 ? 'var(--danger)' : occupancyPct > 50 ? '#D97706' : '#15803D'
                            }}
                          >
                            {occupancyPct}%
                          </span>
                          <span className="ps-capacity-count">
                            ({Math.max(0, loc.total_slots - loc.available_slots)} / {loc.total_slots})
                          </span>
                        </span>
                      </div>
                      <div className="ps-capacity-track">
                        <div 
                          className="ps-capacity-bar" 
                          style={{
                            width: `${occupancyPct}%`,
                            background: occupancyPct > 85 ? 'var(--danger)' : occupancyPct > 60 ? 'var(--warning)' : '#16A34A',
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Action CTA */}
                  <Button 
                    as={Link} 
                    to={`/locations/${loc.id}`} 
                    className={`w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${isAvailable ? 'ps-btn-primary' : 'ps-btn-outline disabled'}`}
                  >
                    {isAvailable ? (
                      <>Select Bay & Reserve <FaArrowRight size={14} /></>
                    ) : (
                      <>Full — Join Waitlist</>
                    )}
                  </Button>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}
