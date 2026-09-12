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
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 animate-fade-down">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge-cyber badge-cyber-cyan">FACILITY INFRASTRUCTURE</span>
          </div>
          <h2 className="fw-900 text-white mb-0" style={{ fontSize: '2rem' }}>
            Parking Facility Hubs
          </h2>
        </div>
        <Button onClick={openAdd} className="btn-cyber-primary py-2 px-4">
          <FaPlus className="me-2" /> Add New Hub Node
        </Button>
      </div>

      {/* Main Table Cyber Card */}
      <div className="cyber-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaMapMarkerAlt size={48} className="mb-3" />
            <h5 className="text-white">No Facility Hubs Configured</h5>
            <Button onClick={openAdd} className="btn-cyber-primary mt-2">Add First Hub</Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber">
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
                    <td className="font-mono text-muted">CHN-0{loc.id}</td>
                    <td>
                      <span className="fw-700 text-white">{loc.name}</span>
                    </td>
                    <td>
                      <span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
                        {loc.address}, {loc.city}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono fw-700 text-info">{loc.total_slots}</span>
                    </td>
                    <td>
                      <span className="badge-cyber badge-cyber-emerald py-1 px-2">
                        {loc.available_slots} FREE
                      </span>
                    </td>
                    <td className="font-mono text-warning" style={{ fontSize: '0.82rem' }}>
                      {loc.opening_time} - {loc.closing_time}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button onClick={() => openEdit(loc)} className="btn-cyber-outline py-1 px-2" title="Edit Hub">
                          <FaEdit />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(loc.id)} 
                          className="btn btn-sm btn-outline-danger py-1 px-2 rounded-2"
                          style={{ border: '1px solid rgba(255, 51, 102, 0.4)', background: 'rgba(255, 51, 102, 0.08)' }}
                          title="Delete Hub"
                        >
                          <FaTrash />
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

      {/* Cyber Modal for Add/Edit */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg" 
        centered
        contentClassName="cyber-card p-0 border-info"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25 px-4 pt-4 pb-3">
          <Modal.Title className="fw-800 text-white">
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
          <Modal.Footer className="border-top border-secondary border-opacity-25 px-4 pb-4">
            <Button variant="outline-light" onClick={() => setShowModal(false)} className="rounded-3">
              Cancel
            </Button>
            <Button type="submit" className="btn-cyber-primary" disabled={saving}>
              {saving ? <Spinner size="sm" className="me-1" /> : null}
              {editId ? 'Save Modifications' : 'Create Hub Node'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
