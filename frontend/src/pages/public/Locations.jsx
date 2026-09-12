/**
 * Parking Locations — V3 Cyber-Obsidian Explorer
 * Live slot telemetry, filter pills, occupancy gauges, and instant reservation entry.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, FaClock, FaParking, FaSearch, FaArrowRight, FaCar, 
  FaBolt, FaShieldAlt, FaFilter, FaRedoAlt, FaCheckCircle 
} from 'react-icons/fa';
import locationService from '../../services/locationService';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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
    setActiveFilter('all');
    fetchLocations();
  };

  return (
    <Container className="py-5">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="text-center mb-5 animate-fade-down">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 glass-panel rounded-pill">
          <span className="radar-dot"></span>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)' }}>
            REAL-TIME NODE TELEMETRY
          </span>
        </div>
        <h1 className="fw-900 text-white mb-2" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
          Chennai Parking <span className="gradient-text-cyber">Hubs & Terminals</span>
        </h1>
        <p style={{ color: '#94a3b8', maxWidth: '560px', margin: '0 auto', fontSize: '1rem' }}>
          Explore live IoT sensor occupancy, compare amenities, and reserve guaranteed bays in advance
        </p>
      </div>

      {/* ── Search & Filter Control Panel ─────────────────── */}
      <div className="cyber-card mb-5 p-4 animate-fade-up">
        <Form onSubmit={handleSearch}>
          <Row className="g-3 align-items-center">
            <Col lg={5} md={6}>
              <Form.Label className="form-label">Search Facility Name or Area</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ background: 'rgba(11, 18, 42, 0.9)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--cyan-neon)' }}>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="e.g. Anna Nagar, T. Nagar, Airport..."
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </InputGroup>
            </Col>

            <Col lg={4} md={6}>
              <Form.Label className="form-label">City / Region</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ background: 'rgba(11, 18, 42, 0.9)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--emerald-neon)' }}>
                  <FaMapMarkerAlt />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Filter by city (e.g. Chennai)"
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                />
              </InputGroup>
            </Col>

            <Col lg={3} md={12} className="d-flex gap-2 align-items-end pt-2 pt-lg-0">
              <Button type="submit" className="btn-cyber-primary flex-fill py-2">
                <FaSearch /> Search
              </Button>
              <Button type="button" onClick={handleReset} className="btn-cyber-outline py-2 px-3" title="Reset Filters">
                <FaRedoAlt />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* ── Locations Grid ─────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: 'var(--cyan-neon)', width: '3rem', height: '3rem' }} />
          <p style={{ color: '#94a3b8', marginTop: '1.2rem', fontFamily: 'var(--font-mono)' }}>
            Querying ultrasonic bay sensors...
          </p>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-5 cyber-card p-5">
          <FaParking size={56} style={{ color: 'rgba(255,255,255,0.15)' }} className="mb-3" />
          <h4 className="text-white fw-700">No Parking Locations Found</h4>
          <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Try clearing your search query or city filter to view all available transit facilities.
          </p>
          <Button onClick={handleReset} className="btn-cyber-primary py-2 px-4">
            Show All Hubs
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {locations.map((loc, idx) => {
            const occupancyPct = loc.total_slots > 0 
              ? Math.round(((loc.total_slots - loc.available_slots) / loc.total_slots) * 100) 
              : 0;

            const isAvailable = loc.available_slots > 0;

            return (
              <Col md={6} lg={4} key={loc.id}>
                <div className="cyber-card h-100 d-flex flex-column justify-content-between">
                  <div>
                    {/* Header Row */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className={`badge-cyber ${isAvailable ? 'badge-cyber-emerald' : 'badge-cyber-rose'}`}>
                        <span className="radar-dot" style={{ background: isAvailable ? 'var(--emerald-neon)' : 'var(--rose-neon)' }}></span>
                        {isAvailable ? `${loc.available_slots} BAYS OPEN` : 'FULLY OCCUPIED'}
                      </span>
                      <span className="font-mono fw-800 text-white" style={{ fontSize: '1.15rem' }}>
                        ₹{loc.rate_per_hour || 40}<span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/hr</span>
                      </span>
                    </div>

                    <h4 className="fw-700 text-white mb-1" style={{ fontSize: '1.25rem' }}>
                      {loc.name}
                    </h4>
                    
                    <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.6 }} className="mb-3">
                      <FaMapMarkerAlt className="me-1 text-info" /> {loc.address}, {loc.city}
                    </p>

                    {/* Operational Timings */}
                    <div className="d-flex gap-3 mb-3 p-2 px-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      <span><FaClock className="me-1 text-warning" /> {loc.opening_time || '06:00'} — {loc.closing_time || '23:00'}</span>
                      <span><FaCar className="me-1 text-info" /> {loc.total_slots} Total Bays</span>
                    </div>

                    {loc.description && (
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                        {loc.description}
                      </p>
                    )}

                    {/* Capacity Progress Bar */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between font-mono mb-1" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        <span>Capacity Occupied</span>
                        <span className={occupancyPct > 80 ? 'text-danger' : 'text-success'}>
                          {occupancyPct}% ({loc.total_slots - loc.available_slots} / {loc.total_slots})
                        </span>
                      </div>
                      <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${occupancyPct}%`,
                          background: occupancyPct > 85 
                            ? 'linear-gradient(90deg, #f59e0b, #ff4757)'
                            : 'linear-gradient(90deg, #10e79d, #00f2fe)',
                          transition: 'width 0.8s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Action CTA */}
                  <Button 
                    as={Link} 
                    to={`/locations/${loc.id}`} 
                    className={`w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${isAvailable ? 'btn-cyber-primary' : 'btn-cyber-outline disabled'}`}
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
