/**
 * About Page — Platform & System Engineering Architecture
 * Academic capstone documentation, technology stack layers, and demonstration sandbox details.
 */

import { Container, Row, Col } from 'react-bootstrap';
import { FaDatabase, FaReact, FaPython, FaShieldAlt, FaCheckCircle, FaCogs } from 'react-icons/fa';

export default function About() {
  return (
    <Container className="py-5">
      {/* Header */}
      <div className="text-center mb-5 animate-fade-down">
        <div className="ps-section-label mb-2">
          <FaCogs /> Academic Capstone 2026
        </div>
        <h1 className="ps-section-title mb-2" style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)' }}>
          System Architecture & <span style={{ color: 'var(--primary)' }}>Engineering</span>
        </h1>
        <p className="ps-section-subtitle mx-auto text-center" style={{ maxWidth: '580px' }}>
          An enterprise-grade smart parking reservation and bay telemetry engine built with 100% free and open-source software.
        </p>
      </div>

      {/* Project Overview Card */}
      <Row className="justify-content-center mb-5">
        <Col lg={10}>
          <div className="ps-card p-4 p-md-5">
            <h4 className="fw-800 mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FaCogs className="text-primary" /> Core System Objective
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem' }}>
              Urban drivers waste an average of 15 to 25 minutes searching for open parking spaces in metropolitan hubs like Chennai. This results in heavy carbon emissions, traffic congestion, and commuter frustration. <strong>ParkSite</strong> bridges this gap by deploying an automated real-time slot telemetry system coupled with sub-second digital QR reservation tokens and barrier sync.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Designed as an end-to-end college capstone project, ParkSite requires <strong>zero paid third-party APIs</strong> and executes 100% locally on standard PC hardware while providing the responsiveness and visual polish of a commercial production platform.
            </p>

            <div className="p-3 rounded-3 mt-4 d-flex align-items-center gap-3" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
              <FaShieldAlt className="text-primary flex-shrink-0" size={24} />
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Demonstration Sandbox:</strong> Includes simulated contactless payment clearing (UPI, RuPay, Visa, Cash) and simulated ultrasonic sensor hardware feeds for realistic academic evaluation.
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Technology Stack Grid */}
      <h3 className="text-center fw-800 mb-4" style={{ color: 'var(--text-primary)' }}>
        Engineering <span style={{ color: 'var(--primary)' }}>Stack Layers</span>
      </h3>

      <Row className="g-4 justify-content-center mb-5">
        {[
          {
            icon: FaReact,
            title: 'Frontend Presentation',
            items: ['React 18.2 SPA', 'Vite Build Pipeline', 'Bootstrap 5 Responsive Grid', 'React Router v6', 'Axios HTTP Client', 'Chart.js & Leaflet Maps']
          },
          {
            icon: FaPython,
            title: 'Backend API Engine',
            items: ['Python 3.14 REST API', 'Flask Micro-framework', 'Flask-JWT-Extended Security', 'SQLAlchemy 2.0 ORM', 'Flask-Migrate Alembic', 'Python qrcode Engine']
          },
          {
            icon: FaDatabase,
            title: 'Relational Database',
            items: ['MySQL 8.0 Community Edition', '3NF Normalized Schema', 'Foreign Key Cascades', 'Indexed Availability Flags', 'ACID Transaction Locks', 'UTF8mb4 Charset']
          },
        ].map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <Col md={4} key={idx}>
              <div className="ps-card h-100 p-4">
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}>
                  <Icon size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <h5 className="fw-700 text-center mb-3" style={{ color: 'var(--text-primary)' }}>{layer.title}</h5>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {layer.items.map((item, j) => (
                    <li key={j} className="d-flex align-items-center gap-2" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                      <FaCheckCircle size={12} className="text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
