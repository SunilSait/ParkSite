/**
 * Admin Manage Locations — V3 Cyber Facility Manager
 */

import { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaClock, FaCar } from 'react-icons/fa';
import locationService from '../../services/locationService';
import { getErrorMessage } from '../../utils/helpers';

const emptyForm = { 
  name: '', 
  address: '', 
  city: '', 
  latitude: '', 
  longitude: '', 
  description: '', 
  opening_time: '06:00', 
  closing_time: '22:00' 
};

export default function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchLocations = async () => {
    try {
      const res = await locationService.getAll();
      setLocations(res.data.locations || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  const openAdd = () => { 
    setEditId(null); 
    setFormData(emptyForm); 
    setError(''); 
    setShowModal(true); 
  };

  const openEdit = (loc) => {
    setEditId(loc.id);
    setFormData({ 
      name: loc.name, 
      address: loc.address, 
      city: loc.city, 
      latitude: loc.latitude || '', 
      longitude: loc.longitude || '', 
      description: loc.description || '', 
      opening_time: loc.opening_time || '06:00', 
      closing_time: loc.closing_time || '22:00' 
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editId) {
        await locationService.update(editId, formData);
      } else {
        await locationService.create(formData);
      }
      setShowModal(false);
      fetchLocations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility hub and all affiliated bay records?')) return;
    try {
      await locationService.delete(id);
      fetchLocations();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="ps-badge ps-badge-primary" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', letterSpacing: '0.04em' }}>
              FACILITY INFRASTRUCTURE
            </span>
          </div>
          <h1 className="fw-800 mb-0" style={{ fontSize: '1.5rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Parking Facility Hubs
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 0, marginTop: '2px' }}>
            Manage operational parking nodes, physical addresses, capacity telemetry, and operating hours.
          </p>
        </div>
        <Button 
          onClick={openAdd} 
          className="btn btn-primary d-inline-flex align-items-center gap-2 py-2 px-3 fw-600 rounded-3 shadow-sm border-0"
          style={{ background: '#2563EB' }}
        >
          <FaPlus size={12} /> Add New Hub Node
        </Button>
      </div>

      {/* Main Table Cyber Card */}
      <div className="cyber-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--primary)' }} />
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaMapMarkerAlt size={44} className="mb-3 text-muted" />
            <h5 className="fw-700" style={{ color: '#0F172A' }}>No Facility Hubs Configured</h5>
            <Button onClick={openAdd} className="btn btn-primary mt-2" style={{ background: '#2563EB' }}>
              Add First Hub
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber mb-0">
              <thead>
                <tr>
                  <th>Hub ID</th>
                  <th>Facility Name</th>
                  <th>City / Area</th>
                  <th>Total Bays</th>
                  <th>Available</th>
                  <th>Operating Window</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#64748B' }}>
                      CHN-0{loc.id}
                    </td>
                    <td>
                      <span className="fw-700" style={{ color: '#0F172A' }}>{loc.name}</span>
                    </td>
                    <td>
                      <span style={{ color: '#64748B', fontSize: '0.88rem' }}>
                        {loc.address}, {loc.city}
                      </span>
                    </td>
                    <td>
                      <span className="fw-700 font-mono" style={{ color: '#2563EB', fontSize: '0.95rem' }}>
                        {loc.total_slots}
                      </span>
                    </td>
                    <td>
                      <span className="ps-badge ps-badge-success" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>
                        <span className="ps-badge-dot"></span>
                        {loc.available_slots} FREE
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontSize: '0.84rem', fontWeight: 500 }}>
                      <FaClock size={11} className="me-1 text-muted" />
                      {loc.opening_time} - {loc.closing_time}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1.5">
                        <Button 
                          onClick={() => openEdit(loc)} 
                          variant="light"
                          className="btn-sm border p-1 px-2 rounded-2"
                          style={{ color: '#334155', background: '#F8FAFC' }}
                          title="Edit Hub"
                        >
                          <FaEdit size={13} />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(loc.id)} 
                          variant="light"
                          className="btn-sm border p-1 px-2 rounded-2"
                          style={{ color: '#DC2626', background: '#FEF2F2', borderColor: '#FECACA' }}
                          title="Delete Hub"
                        >
                          <FaTrash size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clean Modal for Add/Edit */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg" 
        centered
      >
        <Modal.Header closeButton className="border-bottom px-4 pt-4 pb-3">
          <Modal.Title className="fw-800" style={{ color: '#0F172A', fontSize: '1.25rem' }}>
            {editId ? 'Modify Hub Configuration' : 'Register New Parking Hub'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            
            <Row className="g-3">
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Hub Facility Name</Form.Label>
                  <Form.Control 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g. OMR IT Corridor Parkade" 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">City</Form.Label>
                  <Form.Control 
                    value={formData.city} 
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                    placeholder="e.g. Chennai" 
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Physical Address</Form.Label>
              <Form.Control 
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                placeholder="Full street location details" 
                required 
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Opening Time</Form.Label>
                  <Form.Control 
                    type="time" 
                    value={formData.opening_time} 
                    onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Closing Time</Form.Label>
                  <Form.Control 
                    type="time" 
                    value={formData.closing_time} 
                    onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })} 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Facility Telemetry Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Amenities, EV charging stations, CCTV security details..." 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top px-4 pb-4">
            <Button variant="light" onClick={() => setShowModal(false)} className="rounded-3 border">
              Cancel
            </Button>
            <Button type="submit" className="btn btn-primary" style={{ background: '#2563EB' }} disabled={saving}>
              {saving ? <Spinner size="sm" className="me-1" /> : null}
              {editId ? 'Save Modifications' : 'Create Hub Node'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
