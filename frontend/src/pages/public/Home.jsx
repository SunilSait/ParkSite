/**
 * Home Page — V3 Next-Gen Urban Mobility & Smart Parking Experience
 * Interactive Live Bay Visualizer, Rate Calculator, Hub Telemetry, and High-Tech Copy
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { 
  FaSearch, FaParking, FaQrcode, FaShieldAlt, FaBolt, FaClock, 
  FaArrowRight, FaRocket, FaStar, FaCar, FaMotorcycle, FaChargingStation,
  FaCheckCircle, FaMapMarkerAlt, FaCompass, FaChevronRight, FaPlay
} from 'react-icons/fa';

export default function Home() {
  // Interactive Hero Slot Simulation State
  const [selectedSimSlot, setSelectedSimSlot] = useState({
    id: 'A-02',
    status: 'available',
    type: 'Standard Bay',
    rate: '₹40/hr',
    hub: 'Anna Nagar Central Hub'
  });

  // Interactive Parking Rate Calculator State
  const [calcHours, setCalcHours] = useState(2);
  const [calcVehicle, setCalcVehicle] = useState('car'); // car, bike, ev

  const rateMultipliers = {
    car: 40,
    bike: 20,
    ev: 55
  };

  const calculatedTotal = calcHours * (rateMultipliers[calcVehicle] || 40);

  const heroSlots = [
    { id: 'A-01', status: 'occupied', label: 'Audi A6', type: 'Standard' },
    { id: 'A-02', status: 'free', label: '🟢 FREE', type: 'Standard Bay', rate: '₹40/hr', hub: 'Anna Nagar Hub' },
    { id: 'A-03', status: 'ev', label: '⚡ 60kW EV', type: 'EV Fast Bay', rate: '₹55/hr', hub: 'Airport T2 Hub' },
    { id: 'A-04', status: 'occupied', label: 'BMW 3-Series', type: 'Standard' },
    { id: 'A-05', status: 'free', label: '🟢 FREE', type: 'Covered Bay', rate: '₹40/hr', hub: 'T. Nagar Metro' },
    { id: 'A-06', status: 'free', label: '🟢 FREE', type: 'Standard Bay', rate: '₹40/hr', hub: 'Anna Nagar Hub' },
    { id: 'B-01', status: 'occupied', label: 'Tata Nexon EV', type: 'EV Bay' },
    { id: 'B-02', status: 'free', label: '🟢 FREE', type: 'Executive Bay', rate: '₹50/hr', hub: 'T. Nagar Metro' },
  ];

  return (
    <>
      {/* ── Hero Section with Live Telemetry & Interactive Terminal ── */}
      <section className="position-relative py-5 overflow-hidden" style={{ minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <Container className="py-4 position-relative" style={{ zIndex: 3 }}>
          <Row className="align-items-center g-5">
            {/* Left Column: Visionary Copy & Value Proposition */}
            <Col lg={7}>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-4 glass-panel rounded-pill animate-fade-down">
                <span className="radar-dot"></span>
                <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 600 }}>
                  LIVE SENSOR NETWORK • CHENNAI METRO HUB 2026
                </span>
              </div>

              <h1 className="fw-900 mb-4 animate-fade-up delay-1" style={{
                fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.035em'
              }}>
                Never Circle for Parking Again.{' '}
                <span className="gradient-text-cyber">Reserve Guaranteed Bays.</span>
              </h1>

              <p className="lead mb-4 animate-fade-up delay-2" style={{
                color: '#94a3b8',
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                lineHeight: 1.7,
                maxWidth: '620px'
              }}>
                Stop wasting fuel and stressful minutes. Experience real-time ultrasonic slot availability, lock your guaranteed spot in 15 seconds, and glide past barriers with contactless dynamic QR keycards.
              </p>

              {/* Action Buttons */}
              <div className="d-flex gap-3 flex-wrap align-items-center mb-5 animate-fade-up delay-3">
                <Button as={Link} to="/locations" className="btn-cyber-primary py-3 px-4">
                  <FaSearch /> Explore 30+ Live Slots
                </Button>
                <Button as={Link} to="/register" className="btn-cyber-outline py-3 px-4">
                  Get Instant Free Pass <FaArrowRight />
                </Button>
              </div>

              {/* Trust & Performance Metrics */}
              <div className="row g-3 pt-2 border-top border-secondary border-opacity-25 animate-fade-up delay-4">
                <div className="col-4">
                  <div className="fw-800 font-display" style={{ fontSize: '1.75rem', color: '#ffffff' }}>99.98%</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>Bay Accuracy</div>
                </div>
                <div className="col-4">
                  <div className="fw-800 font-display" style={{ fontSize: '1.75rem', color: 'var(--cyan-neon)' }}>&lt; 15s</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>Booking Time</div>
                </div>
                <div className="col-4">
                  <div className="fw-800 font-display" style={{ fontSize: '1.75rem', color: 'var(--emerald-neon)' }}>0 Queues</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>Contactless QR</div>
                </div>
              </div>
            </Col>

            {/* Right Column: Live Interactive Bay Simulation Terminal */}
            <Col lg={5} className="animate-fade-up delay-2">
              <div className="hero-terminal-card">
                {/* Terminal Window Header */}
                <div className="hero-terminal-header">
                  <div className="terminal-dots">
                    <div className="dot-red"></div>
                    <div className="dot-yellow"></div>
                    <div className="dot-green"></div>
                  </div>
                  <div className="font-mono text-center" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    HUB-NODE-01 // ANNA NAGAR CENTRAL
                  </div>
                  <span className="badge-cyber badge-cyber-emerald py-0 px-2" style={{ fontSize: '0.65rem' }}>
                    ONLINE
                  </span>
                </div>

                {/* Terminal Image Viewport with Animated Laser Radar Sweep */}
                <div className="terminal-image-viewport">
                  <img src="/hero-parking.jpg" alt="Futuristic Smart Parking Garage" />
                  <div className="radar-scan-line"></div>
                  
                  {/* HUD Overlay Tags */}
                  <div className="hud-overlay-tag" style={{ top: '16px', left: '16px' }}>
                    <FaBolt className="me-1 text-warning" /> 60kW DC EV CHARGING
                  </div>
                  <div className="hud-overlay-tag" style={{ bottom: '16px', right: '16px' }}>
                    <FaCheckCircle className="me-1 text-success" /> 24 BAYS OCCUPIED
                  </div>
                </div>

                {/* Interactive Slot Grid Simulator */}
                <div className="p-3 bg-dark bg-opacity-75 border-top border-secondary border-opacity-25">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="font-mono" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      INTERACTIVE LIVE BAY SELECTOR
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cyan-neon)' }}>
                      Tap to inspect slot
                    </span>
                  </div>

                  <div className="slot-quick-grid">
                    {heroSlots.map((slot) => (
                      <div 
                        key={slot.id}
                        onClick={() => slot.status !== 'occupied' && setSelectedSimSlot(slot)}
                        className={`quick-slot-item ${slot.status === 'free' ? 'free' : slot.status === 'ev' ? 'ev' : 'occupied'} ${selectedSimSlot?.id === slot.id ? 'border-cyan shadow-sm' : ''}`}
                        style={{
                          borderWidth: selectedSimSlot?.id === slot.id ? '2px' : '1px',
                          borderColor: selectedSimSlot?.id === slot.id ? 'var(--cyan-neon)' : undefined
                        }}
                      >
                        <div className="fw-700">{slot.id}</div>
                        <div style={{ fontSize: '0.65rem', marginTop: '2px' }}>{slot.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Slot Information Bar */}
                  {selectedSimSlot && (
                    <div className="mt-3 p-2 px-3 rounded-3 glass-panel d-flex justify-content-between align-items-center">
                      <div>
                        <div className="font-mono fw-700 text-white" style={{ fontSize: '0.85rem' }}>
                          BAY {selectedSimSlot.id} • {selectedSimSlot.type}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Rate: <span className="text-info fw-bold">{selectedSimSlot.rate || '₹40/hr'}</span> • Instant Confirmation
                        </div>
                      </div>
                      <Button as={Link} to="/locations" size="sm" className="btn-cyber-primary py-1 px-3" style={{ fontSize: '0.78rem' }}>
                        Book Bay <FaChevronRight size={10} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Live Hubs Telemetry Spotlight ───────────────────── */}
      <section className="py-5" style={{ background: 'rgba(6, 10, 26, 0.6)' }}>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-end flex-wrap mb-4">
            <div>
              <span className="badge-cyber badge-cyber-cyan mb-2">
                <FaMapMarkerAlt /> REAL-TIME TRANSIT HUBS
              </span>
              <h2 className="fw-800 mb-1" style={{ fontSize: '2.2rem' }}>
                Featured Chennai Smart Facilities
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 0 }}>
                High-density metro stations, commercial districts, and airport terminals with zero-wait access
              </p>
            </div>
            <Link to="/locations" className="text-decoration-none d-flex align-items-center gap-2 fw-600 mt-3 mt-md-0" style={{ color: 'var(--cyan-neon)' }}>
              View All Locations <FaArrowRight />
            </Link>
          </div>

          <Row className="g-4">
            {[
              {
                title: 'Anna Nagar Central Hub',
                area: '2nd Avenue, Anna Nagar West, Chennai',
                rate: '₹40/hr',
                available: 8,
                total: 10,
                color: 'var(--cyan-neon)',
                features: ['Covered Parking', '24/7 Security', 'CCTV Monitored']
              },
              {
                title: 'T. Nagar Smart Metro Plaza',
                area: 'South Usman Road, T. Nagar, Chennai',
                rate: '₹50/hr',
                available: 6,
                total: 10,
                color: 'var(--violet-neon)',
                features: ['Direct Metro Walkway', 'EV Superchargers', 'FastTag Entry']
              },
              {
                title: 'Chennai Airport T2 Bay',
                area: 'Terminal 2 Multi-level Hub, Meenambakkam',
                rate: '₹60/hr',
                available: 7,
                total: 10,
                color: 'var(--emerald-neon)',
                features: ['Flight Sync Alerts', 'Valet Optional', 'Ultra-Secure Bay']
              },
            ].map((hub, idx) => (
              <Col md={4} key={idx}>
                <div className="cyber-card h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge-cyber badge-cyber-emerald">
                        <span className="radar-dot" style={{ width: '6px', height: '6px' }}></span>
                        {hub.available} BAYS OPEN
                      </span>
                      <span className="font-mono fw-800 text-white" style={{ fontSize: '1.2rem' }}>
                        {hub.rate}
                      </span>
                    </div>

                    <h4 className="fw-700 text-white mb-2">{hub.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }} className="mb-3">
                      <FaMapMarkerAlt className="me-1 text-info" /> {hub.area}
                    </p>

                    {/* Capacity Progress Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between font-mono mb-1" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        <span>Occupancy Level</span>
                        <span>{Math.round(((hub.total - hub.available) / hub.total) * 100)}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${((hub.total - hub.available) / hub.total) * 100}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #10e79d, #00f2fe)' 
                        }}></div>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-1 mb-4">
                      {hub.features.map((tag, fIdx) => (
                        <span key={fIdx} style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          color: '#cbd5e1'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button as={Link} to="/locations" className="btn-cyber-outline w-100 py-2">
                    Select & Reserve Bay <FaArrowRight size={12} className="ms-1" />
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Interactive Rate & Fuel Savings Estimator ────────── */}
      <section className="py-5 position-relative">
        <Container className="py-4">
          <div className="cyber-card p-4 p-md-5" style={{
            background: 'linear-gradient(135deg, rgba(14, 23, 56, 0.85), rgba(7, 12, 34, 0.95))',
            border: '1px solid rgba(0, 242, 254, 0.25)'
          }}>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <span className="badge-cyber badge-cyber-amber mb-3">
                  <FaClock /> DYNAMIC FARE ESTIMATOR
                </span>
                <h3 className="fw-800 text-white mb-3" style={{ fontSize: '2.1rem' }}>
                  Calculate Your Parking In Advance
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Transparent, automated tariffs with zero hidden surcharges. Know exactly what you pay before leaving your driveway.
                </p>

                {/* Vehicle Selector */}
                <div className="mb-4">
                  <label className="form-label mb-2">Vehicle Category</label>
                  <div className="d-flex gap-2">
                    {[
                      { key: 'car', label: 'Car / SUV', icon: FaCar, rate: '₹40/h' },
                      { key: 'bike', label: 'Two-Wheeler', icon: FaMotorcycle, rate: '₹20/h' },
                      { key: 'ev', label: 'Electric (EV)', icon: FaChargingStation, rate: '₹55/h' },
                    ].map((v) => {
                      const Icon = v.icon;
                      return (
                        <button
                          key={v.key}
                          type="button"
                          onClick={() => setCalcVehicle(v.key)}
                          className={`btn flex-fill py-2 px-3 text-start rounded-3 d-flex align-items-center gap-2 ${calcVehicle === v.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                          style={{
                            background: calcVehicle === v.key ? 'linear-gradient(135deg, #00f2fe, #7928ca)' : 'rgba(255,255,255,0.03)',
                            border: calcVehicle === v.key ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            color: '#ffffff'
                          }}
                        >
                          <Icon size={18} />
                          <div>
                            <div className="fw-700" style={{ fontSize: '0.85rem' }}>{v.label}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{v.rate}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Slider */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Booking Duration</label>
                    <span className="font-mono fw-800 text-info" style={{ fontSize: '1.1rem' }}>
                      {calcHours} {calcHours === 1 ? 'Hour' : 'Hours'}
                    </span>
                  </div>
                  <Form.Range 
                    min={1} 
                    max={12} 
                    value={calcHours} 
                    onChange={(e) => setCalcHours(Number(e.target.value))}
                    className="cyber-range"
                  />
                  <div className="d-flex justify-content-between text-muted font-mono" style={{ fontSize: '0.72rem' }}>
                    <span>1 hr (Quick Stop)</span>
                    <span>4 hrs (Half Day)</span>
                    <span>12 hrs (Full Day)</span>
                  </div>
                </div>
              </Col>

              {/* Calculation Summary Card */}
              <Col lg={6}>
                <div className="p-4 rounded-4 glass-panel position-relative border border-info border-opacity-25 text-center">
                  <span className="badge-cyber badge-cyber-emerald mb-3">GUARANTEED PRICE LOCK</span>
                  <div className="font-mono text-secondary mb-1" style={{ fontSize: '0.85rem' }}>
                    ESTIMATED TOTAL PARKING FEE
                  </div>
                  <div className="font-display fw-900 gradient-text-cyber mb-3" style={{ fontSize: '3.6rem', lineHeight: 1 }}>
                    ₹{calculatedTotal}
                  </div>

                  <div className="p-3 mb-4 rounded-3 text-start" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="d-flex justify-content-between mb-2 font-mono" style={{ fontSize: '0.82rem' }}>
                      <span className="text-muted">Base Rate:</span>
                      <span className="text-white">₹{rateMultipliers[calcVehicle]} × {calcHours} hrs</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 font-mono" style={{ fontSize: '0.82rem' }}>
                      <span className="text-muted">Dynamic QR Pass:</span>
                      <span className="text-success fw-bold">FREE (₹0)</span>
                    </div>
                    <div className="d-flex justify-content-between font-mono pt-2 border-top border-secondary border-opacity-25" style={{ fontSize: '0.82rem' }}>
                      <span className="text-muted">Estimated Fuel Saved:</span>
                      <span className="text-warning fw-bold">~₹90 (No Circling)</span>
                    </div>
                  </div>

                  <Button as={Link} to="/locations" className="btn-cyber-primary w-100 py-3">
                    Reserve at This Rate Now <FaArrowRight />
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* ── Holographic How It Works ────────────────────────── */}
      <section className="py-5" style={{ background: 'rgba(5, 8, 20, 0.9)' }}>
        <Container className="py-4">
          <div className="text-center mb-5">
            <span className="badge-cyber badge-cyber-cyan mb-2">
              <FaCompass /> EFFORTLESS 3-STEP JOURNEY
            </span>
            <h2 className="fw-800 mb-2" style={{ fontSize: '2.4rem' }}>
              How ParkSite Works
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '540px', margin: '0 auto' }}>
              From search to automated boom-barrier exit in three seamless frictionless steps
            </p>
          </div>

          <Row className="g-4">
            {[
              {
                step: '01',
                title: 'Locate & Select Slot',
                desc: 'Browse verified Chennai parking facilities. Check live sensor telemetry to find free bays suited to your vehicle type.',
                icon: FaSearch,
                accent: 'var(--cyan-neon)'
              },
              {
                step: '02',
                title: 'One-Click Reservation',
                desc: 'Lock your slot for your arrival window. Simulated payment gateway allows instant confirmation without risk.',
                icon: FaParking,
                accent: 'var(--violet-neon)'
              },
              {
                step: '03',
                title: 'Scan QR & Park',
                desc: 'Hold your digital ticket up to the scanner gate. Barrier lifts in 0.5s. Enjoy your visit with zero parking worries.',
                icon: FaQrcode,
                accent: 'var(--emerald-neon)'
              },
            ].map((stepItem, sIdx) => {
              const Icon = stepItem.icon;
              return (
                <Col md={4} key={sIdx}>
                  <div className="cyber-card h-100 text-center p-4">
                    <div className="position-relative d-inline-block mb-4">
                      <div style={{
                        width: '76px', height: '76px', borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `2px solid ${stepItem.accent}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 20px ${stepItem.accent}33`,
                        margin: '0 auto'
                      }}>
                        <Icon size={30} style={{ color: stepItem.accent }} />
                      </div>
                      <span style={{
                        position: 'absolute', top: '-10px', right: '-10px',
                        background: stepItem.accent, color: '#000000',
                        fontFamily: 'var(--font-mono)', fontWeight: 800,
                        fontSize: '0.72rem', padding: '0.2rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        {stepItem.step}
                      </span>
                    </div>

                    <h4 className="fw-700 text-white mb-2">{stepItem.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>
                      {stepItem.desc}
                    </p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* ── Visual Feature Showcase with Generated Visual ──── */}
      <section className="py-5">
        <Container className="py-4">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="position-relative rounded-4 overflow-hidden border border-secondary border-opacity-25 shadow-lg">
                <img 
                  src="/qr-scanner.jpg" 
                  alt="Contactless Smart Gate QR Scanner" 
                  className="w-100" 
                  style={{ maxHeight: '420px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(4,7,18,0.95), transparent)',
                  padding: '2rem 1.5rem 1.5rem'
                }}>
                  <div className="d-flex align-items-center gap-2 text-white fw-700 mb-1">
                    <FaQrcode className="text-info" /> Touchless Rapid Access
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                    Zero-contact entrance barrier synced with encrypted JWT tokens
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <span className="badge-cyber badge-cyber-emerald mb-3">
                <FaShieldAlt /> ENTERPRISE MOBILITY TECH
              </span>
              <h2 className="fw-800 text-white mb-4" style={{ fontSize: '2.3rem', lineHeight: 1.2 }}>
                Engineered for Reliability and Total Peace of Mind
              </h2>

              <div className="d-flex flex-column gap-4">
                {[
                  {
                    title: 'Ultrasonic IoT Bay Telemetry',
                    desc: 'Sensor relays transmit slot occupancy in real time, completely preventing double bookings.'
                  },
                  {
                    title: '256-Bit Encrypted Dynamic QR Pass',
                    desc: 'Unique scannable pass generated for every booking, ensuring contactless check-in and checkout.'
                  },
                  {
                    title: 'Simulated Cashless Settlement',
                    desc: 'Test UPI, NetBanking, Credit Card, and Cash flows with immediate receipt generation.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="d-flex gap-3">
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <FaCheckCircle color="#00f2fe" size={15} />
                    </div>
                    <div>
                      <h6 className="fw-700 text-white mb-1">{item.title}</h6>
                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Commuter Testimonials ────────────────────────────── */}
      <section className="py-5" style={{ background: 'rgba(6, 10, 26, 0.6)' }}>
        <Container className="py-4">
          <div className="text-center mb-5">
            <span className="badge-cyber badge-cyber-amber mb-2">
              <FaStar /> DRIVER SATISFACTION
            </span>
            <h2 className="fw-800 mb-2" style={{ fontSize: '2.2rem' }}>
              Trusted by Daily Urban Commuters
            </h2>
            <p style={{ color: '#94a3b8' }}>Real feedback from drivers navigating Chennai every day</p>
          </div>

          <Row className="g-4">
            {[
              {
                name: 'Karthik Ramanathan',
                role: 'Software Architect @ OMR',
                comment: 'The Anna Nagar hub booking saved me 25 minutes during peak Friday rush. The QR scan at the barrier took literally two seconds!',
                stars: 5
              },
              {
                name: 'Dr. Priya Sundaram',
                role: 'Physician @ Apollo Greams Road',
                comment: 'Having a guaranteed slot before leaving home eliminates the morning anxiety. The rate calculator is completely accurate.',
                stars: 5
              },
              {
                name: 'Arun Venkatesh',
                role: 'EV Owner (Nexon EV)',
                comment: 'Booking a slot with dedicated EV charger ready on arrival is a game changer for electric car adoption in Chennai.',
                stars: 5
              },
            ].map((t, idx) => (
              <Col md={4} key={idx}>
                <div className="cyber-card h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex gap-1 text-warning mb-3">
                      {[...Array(t.stars)].map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.7, fontStyle: 'italic' }} className="mb-4">
                      "{t.comment}"
                    </p>
                  </div>
                  <div className="pt-3 border-top border-secondary border-opacity-25">
                    <div className="fw-700 text-white" style={{ fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{t.role}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── High-Impact Final Call to Action ─────────────────── */}
      <section className="py-5 position-relative">
        <Container className="py-4">
          <div className="p-5 text-center position-relative overflow-hidden rounded-4" style={{
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(157, 78, 221, 0.15) 50%, rgba(4, 7, 20, 0.95) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            boxShadow: '0 20px 50px rgba(0, 242, 254, 0.15)'
          }}>
            <h2 className="fw-900 text-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Ready to Upgrade Your Parking Experience?
            </h2>
            <p style={{ color: '#cbd5e1', maxWidth: '580px', margin: '0 auto 2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Create your free commuter account in seconds and unlock live slot reservation across Chennai's premier hubs.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button as={Link} to="/register" className="btn-cyber-primary py-3 px-5 fw-bold" style={{ fontSize: '1.05rem' }}>
                Create Free Account <FaArrowRight className="ms-2" />
              </Button>
              <Button as={Link} to="/login" className="btn-cyber-outline py-3 px-4" style={{ fontSize: '1.05rem' }}>
                Sign In Demo User
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
