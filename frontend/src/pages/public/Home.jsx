/**
 * Home Page — Professional Smart Parking Management System Homepage
 * Clean SaaS design with parking dashboard, stats, how-it-works, hub cards, and IoT section.
 */

import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { 
  FaSearch, FaParking, FaQrcode, FaArrowRight, FaCar, 
  FaMapMarkerAlt, FaCheckCircle, FaClock, FaShieldAlt,
  FaWifi, FaServer, FaDatabase, FaLaptopCode, FaSatelliteDish, FaBolt
} from 'react-icons/fa';

export default function Home() {
  // Parking hub data for the Live Availability section
  const parkingHubs = [
    {
      name: 'Anna Nagar Central',
      location: '2nd Avenue, Anna Nagar West, Chennai',
      available: 24,
      total: 42,
      price: '₹40/hr',
      features: ['Covered Parking', '24/7 Security', 'CCTV']
    },
    {
      name: 'T. Nagar Metro',
      location: 'South Usman Road, T. Nagar, Chennai',
      available: 8,
      total: 50,
      price: '₹50/hr',
      features: ['Metro Access', 'EV Charging', 'FastTag']
    },
    {
      name: 'Chennai Airport T2',
      location: 'Terminal 2, Meenambakkam, Chennai',
      available: 7,
      total: 30,
      price: '₹60/hr',
      features: ['Valet Option', 'Ultra-Secure', '24/7']
    }
  ];

  // Mini slot grid data for hero dashboard
  const heroSlots = [
    { id: 'A01', status: 'occupied' },
    { id: 'A02', status: 'available' },
    { id: 'A03', status: 'available' },
    { id: 'A04', status: 'reserved' },
    { id: 'A05', status: 'available' },
    { id: 'A06', status: 'occupied' },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════ */}
      <section className="ps-hero">
        <Container>
          <Row className="align-items-center g-5">
            {/* Left Column: Headline & CTA */}
            <Col lg={6}>
              <div className="animate-fade-up">
                <h1>
                  Smart Parking,<br />
                  <span>Made Simple.</span>
                </h1>

                <p className="lead mb-4">
                  Find available parking spaces in real time, reserve your slot, and park without the hassle.
                </p>

                <div className="d-flex gap-3 flex-wrap mb-4">
                  <Button as={Link} to="/locations" className="ps-btn-primary ps-btn-lg">
                    <FaSearch /> Find Parking
                  </Button>
                  <Button as={Link} to="/locations" className="ps-btn-outline ps-btn-lg">
                    Explore Parking Hubs <FaArrowRight />
                  </Button>
                </div>

                <div className="ps-trust-badge">
                  <span className="ps-trust-dot"></span>
                  Real-time parking availability
                </div>
              </div>
            </Col>

            {/* Right Column: Parking Dashboard Card */}
            <Col lg={6}>
              <div className="ps-dashboard-card animate-fade-up delay-2">
                {/* Dashboard Header */}
                <div className="ps-dashboard-header">
                  <div>
                    <h6>PARKING HUB</h6>
                    <div className="hub-name">Anna Nagar Central</div>
                  </div>
                  <div className="ps-status-badge">
                    <span className="ps-status-dot"></span>
                    Live
                  </div>
                </div>

                {/* Stats Row */}
                <div className="ps-dashboard-stats">
                  <div className="ps-dashboard-stat available">
                    <div className="number">24</div>
                    <div className="label">Available</div>
                  </div>
                  <div className="ps-dashboard-stat occupied">
                    <div className="number">18</div>
                    <div className="label">Occupied</div>
                  </div>
                  <div className="ps-dashboard-stat reserved">
                    <div className="number">03</div>
                    <div className="label">Reserved</div>
                  </div>
                </div>

                {/* Mini Slot Grid */}
                <div className="ps-slot-grid">
                  {heroSlots.map((slot) => (
                    <div key={slot.id} className={`ps-slot ${slot.status}`}>
                      <div className="slot-id">{slot.id}</div>
                      <div className="slot-status">
                        {slot.status === 'available' && 'Available'}
                        {slot.status === 'occupied' && 'Occupied'}
                        {slot.status === 'reserved' && 'Reserved'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Link */}
                <div className="d-flex justify-content-center py-2 border-top" style={{ borderColor: 'var(--border-light)' }}>
                  <Link 
                    to="/locations" 
                    className="text-decoration-none d-flex align-items-center gap-1"
                    style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary)' }}
                  >
                    View All Slots <FaArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>


      {/* ══════════════════════════════════════════════════════════
          STATISTICS SECTION
          ══════════════════════════════════════════════════════════ */}
      <section className="ps-stats-section">
        <Container>
          <Row className="g-4">
            {[
              { icon: FaParking, value: '120+', label: 'Parking Slots' },
              { icon: FaMapMarkerAlt, value: '8', label: 'Parking Hubs' },
              { icon: FaCheckCircle, value: '98%', label: 'Availability Accuracy' },
              { icon: FaClock, value: '24/7', label: 'Monitoring' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Col sm={6} lg={3} key={idx}>
                  <div className="ps-stat-card">
                    <div className="ps-stat-icon">
                      <Icon />
                    </div>
                    <div className="ps-stat-value">{stat.value}</div>
                    <div className="ps-stat-label">{stat.label}</div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>


      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════════════ */}
      <section className="ps-section ps-section-gray">
        <Container>
          <div className="text-center mb-5">
            <div className="ps-section-label">
              <FaCar /> How It Works
            </div>
            <h2 className="ps-section-title">Park in 3 Simple Steps</h2>
            <p className="ps-section-subtitle mx-auto">
              From searching to parking — it takes just a few clicks to reserve your spot.
            </p>
          </div>

          <Row className="g-4">
            {[
              {
                step: '01',
                icon: FaSearch,
                title: 'Find a Parking Hub',
                desc: 'Browse available parking hubs near your destination. Check real-time slot availability and pricing.'
              },
              {
                step: '02',
                icon: FaParking,
                title: 'Select & Reserve a Slot',
                desc: 'Choose your preferred slot, select date and time, and confirm your booking with instant confirmation.'
              },
              {
                step: '03',
                icon: FaQrcode,
                title: 'Park & Go',
                desc: 'Show your QR code at entry, park in your reserved slot, and drive out when done. No hassle.'
              },
            ].map((stepItem, idx) => {
              const Icon = stepItem.icon;
              return (
                <Col md={4} key={idx}>
                  <div className="ps-step-card">
                    <div className="ps-step-number">{stepItem.step}</div>
                    <div className="ps-step-icon">
                      <Icon />
                    </div>
                    <h5 className="ps-step-title">{stepItem.title}</h5>
                    <p className="ps-step-desc">{stepItem.desc}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>


      {/* ══════════════════════════════════════════════════════════
          LIVE PARKING AVAILABILITY
          ══════════════════════════════════════════════════════════ */}
      <section className="ps-section ps-section-light">
        <Container>
          <div className="d-flex justify-content-between align-items-end flex-wrap mb-4 gap-3">
            <div>
              <div className="ps-section-label">
                <FaMapMarkerAlt /> Live Availability
              </div>
              <h2 className="ps-section-title">Parking Hubs Near You</h2>
              <p className="ps-section-subtitle mb-0">
                View real-time availability across all parking locations in Chennai.
              </p>
            </div>
            <Link 
              to="/locations" 
              className="text-decoration-none d-flex align-items-center gap-2 fw-semibold"
              style={{ color: 'var(--primary)', fontSize: '0.95rem' }}
            >
              View All Hubs <FaArrowRight />
            </Link>
          </div>

          <Row className="g-4">
            {parkingHubs.map((hub, idx) => {
              const availPercent = Math.round((hub.available / hub.total) * 100);
              const barColor = availPercent > 50 ? 'var(--success)' 
                             : availPercent > 20 ? 'var(--warning)' 
                             : 'var(--danger)';
              const textColor = availPercent > 50 ? 'var(--success)' 
                              : availPercent > 20 ? '#B45309' 
                              : 'var(--danger)';
              return (
                <Col md={4} key={idx}>
                  <div className="ps-hub-card">
                    <div>
                      <h5 className="ps-hub-name">{hub.name}</h5>
                      <p className="ps-hub-location">
                        <FaMapMarkerAlt className="me-1" style={{ color: 'var(--text-muted)' }} />
                        {hub.location}
                      </p>

                      <div className="ps-hub-meta">
                        <span className="ps-hub-slots">
                          <strong>{hub.available}</strong> / {hub.total} slots available
                        </span>
                        <span className="ps-hub-price">{hub.price}</span>
                      </div>

                      <div className="ps-hub-progress">
                        <div 
                          className="ps-hub-progress-bar" 
                          style={{ width: `${availPercent}%`, background: barColor }}
                        ></div>
                      </div>

                      <div className="ps-hub-availability" style={{ color: textColor }}>
                        {availPercent}% Available
                      </div>

                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {hub.features.map((tag, fIdx) => (
                          <span key={fIdx} style={{
                            fontSize: '0.72rem',
                            background: 'var(--bg-gray-100)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            color: 'var(--text-secondary)',
                            fontWeight: 500
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button as={Link} to="/locations" className="ps-btn-primary w-100">
                      View Slots <FaArrowRight size={12} className="ms-1" />
                    </Button>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>


      {/* ══════════════════════════════════════════════════════════
          IOT TECHNOLOGY SECTION
          ══════════════════════════════════════════════════════════ */}
      <section className="ps-section ps-section-gray">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="ps-section-label">
                <FaWifi /> Technology
              </div>
              <h2 className="ps-section-title">Powered by Smart IoT Monitoring</h2>
              <p className="ps-section-subtitle mb-4">
                Our system uses IoT sensors and a modern web stack to provide accurate, real-time parking management.
              </p>

              <div>
                {[
                  {
                    icon: FaSatelliteDish,
                    title: 'Real-Time Slot Detection',
                    desc: 'Ultrasonic sensors detect vehicle presence in each parking slot.'
                  },
                  {
                    icon: FaBolt,
                    title: 'Automatic Availability Updates',
                    desc: 'Slot status is updated automatically when vehicles enter or exit.'
                  },
                  {
                    icon: FaShieldAlt,
                    title: 'Digital Parking Management',
                    desc: 'Complete booking lifecycle managed through a web-based dashboard.'
                  },
                  {
                    icon: FaQrcode,
                    title: 'QR-Based Entry & Exit',
                    desc: 'Each booking generates a unique QR code for contactless access.'
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div className="ps-iot-feature" key={idx}>
                      <div className="ps-iot-feature-icon">
                        <Icon />
                      </div>
                      <div>
                        <h6>{feature.title}</h6>
                        <p>{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Col>

            <Col lg={6}>
              <h6 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
                System Architecture
              </h6>
              <div className="ps-iot-flow">
                <div className="ps-iot-flow-item">
                  <div className="flow-icon"><FaSatelliteDish /></div>
                  <div className="flow-label">IoT Sensor</div>
                  <div className="flow-sub">Ultrasonic</div>
                </div>
                <div className="ps-iot-flow-arrow">→</div>
                <div className="ps-iot-flow-item">
                  <div className="flow-icon"><FaServer /></div>
                  <div className="flow-label">Flask Backend</div>
                  <div className="flow-sub">REST API</div>
                </div>
                <div className="ps-iot-flow-arrow">→</div>
                <div className="ps-iot-flow-item">
                  <div className="flow-icon"><FaDatabase /></div>
                  <div className="flow-label">MySQL Database</div>
                  <div className="flow-sub">Data Store</div>
                </div>
                <div className="ps-iot-flow-arrow">→</div>
                <div className="ps-iot-flow-item">
                  <div className="flow-icon"><FaLaptopCode /></div>
                  <div className="flow-label">React Web App</div>
                  <div className="flow-sub">User Interface</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>


      {/* ══════════════════════════════════════════════════════════
          FINAL CTA SECTION
          ══════════════════════════════════════════════════════════ */}
      <section className="ps-section ps-section-light">
        <Container>
          <div className="ps-cta-section">
            <h2>Ready to Find Your Parking Spot?</h2>
            <p>
              Create a free account and start reserving parking slots across Chennai's top hubs.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button as={Link} to="/register" className="ps-btn-primary ps-btn-lg">
                Create Free Account <FaArrowRight className="ms-1" />
              </Button>
              <Button as={Link} to="/login" className="ps-btn-outline ps-btn-lg">
                Sign In
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
