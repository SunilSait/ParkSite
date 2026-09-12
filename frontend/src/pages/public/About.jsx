/**
 * About Page — V3 Platform & System Engineering Architecture
 */

import { Container, Row, Col } from 'react-bootstrap';
import { FaDatabase, FaReact, FaPython, FaCode, FaShieldAlt, FaQrcode, FaCheckCircle, FaServer, FaCogs } from 'react-icons/fa';

export default function About() {
  return (
    <Container className="py-5">
      {/* Header */}
      <div className="text-center mb-5 animate-fade-down">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 glass-panel rounded-pill">
          <span className="badge-cyber badge-cyber-cyan py-0">ACADEMIC CAPSTONE 2026</span>
        </div>
        <h1 className="fw-900 text-white mb-2" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
          System Architecture & <span className="gradient-text-cyber">Engineering</span>
        </h1>
        <p style={{ color: '#94a3b8', maxWidth: '580px', margin: '0 auto', fontSize: '1rem' }}>
          An enterprise-grade smart parking reservation and bay telemetry engine built with 100% free and open-source software.
        </p>
      </div>

      {/* Project Overview Cyber Card */}
      <Row className="justify-content-center mb-5">
        <Col lg={10}>
          <div className="cyber-card p-4 p-md-5">
            <h4 className="fw-800 text-white mb-3 d-flex align-items-center gap-2">
              <FaCogs color="#00f2fe" /> Core System Objective
            </h4>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '0.98rem' }}>
              Urban drivers waste an average of 15 to 25 minutes searching for open parking spaces in metropolitan hubs like Chennai. This results in heavy carbon emissions, traffic congestion, and commuter frustration. <strong>ParkSite</strong> bridges this gap by deploying an automated real-time slot telemetry system coupled with sub-second digital QR reservation tokens and barrier sync.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Designed as an end-to-end college capstone project, ParkSite requires <strong>zero paid third-party APIs</strong> and executes 100% locally on standard PC hardware while providing the responsiveness and visual polish of a commercial production platform.
            </p>

            <div className="p-3 rounded-3 mt-4 glass-panel border border-info border-opacity-25 d-flex align-items-center gap-3">
              <FaShieldAlt color="#00f2fe" size={24} className="flex-shrink-0" />
              <div style={{ fontSize: '0.86rem', color: '#cbd5e1' }}>
                <strong className="text-white">Demonstration Sandbox:</strong> Includes simulated contactless payment clearing (UPI, RuPay, Visa, Cash) and simulated ultrasonic sensor hardware feeds for realistic academic evaluation.
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Technology Stack Grid */}
      <h3 className="text-center fw-800 text-white mb-4">
        Engineering <span className="gradient-text-cyber">Stack Layers</span>
      </h3>

      <Row className="g-4 justify-content-center mb-5">
        {[
          {
            icon: FaReact,
            title: 'Frontend Presentation',
            color: 'var(--cyan-neon)',
            borderGlow: 'rgba(0, 242, 254, 0.3)',
            items: ['React 18.2 SPA', 'Vite Build Pipeline', 'Bootstrap 5 Responsive Grid', 'React Router v6', 'Axios HTTP Client', 'Chart.js & Leaflet Maps']
          },
          {
            icon: FaPython,
            title: 'Backend API Engine',
            color: 'var(--emerald-neon)',
            borderGlow: 'rgba(16, 231, 157, 0.3)',
            items: ['Python 3.14 REST API', 'Flask Micro-framework', 'Flask-JWT-Extended Security', 'SQLAlchemy 2.0 ORM', 'Flask-Migrate Alembic', 'Python qrcode Engine']
          },
          {
            icon: FaDatabase,
            title: 'Relational Database',
            color: 'var(--violet-neon)',
            borderGlow: 'rgba(157, 78, 221, 0.3)',
            items: ['MySQL 8.0 Community Edition', '3NF Normalized Schema', 'Foreign Key Cascades', 'Indexed Availability Flags', 'ACID Transaction Locks', 'UTF8mb4 Charset']
          },
        ].map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <Col md={4} key={idx}>
              <div className="cyber-card h-100 p-4" style={{ borderColor: layer.borderGlow }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${layer.borderGlow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}>
                  <Icon size={24} style={{ color: layer.color }} />
                </div>
                <h5 className="fw-700 text-white text-center mb-3">{layer.title}</h5>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {layer.items.map((item, j) => (
                    <li key={j} className="d-flex align-items-center gap-2" style={{ fontSize: '0.86rem', color: '#cbd5e1' }}>
                      <FaCheckCircle size={12} style={{ color: layer.color }} />
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
