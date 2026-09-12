/**
 * Admin Manage Slots — V3 Bay Telemetry & Sensor Matrix
 */

import { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaParking, FaBolt } from 'react-icons/fa';
import locationService from '../../services/locationService';
import adminService from '../../services/adminService';
import { formatCurrency, getErrorMessage } from '../../utils/helpers';
import { VEHICLE_ICONS } from '../../utils/constants';

export default function ManageSlots() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ 
    location_id: '', 
    slot_number: '', 
    vehicle_type: 'Car', 
    price_per_hour: '', 
    status: 'available' 
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    locationService.getAll().then(res => {
      const locs = res.data.locations || [];
      setLocations(locs);
      if (locs.length > 0) setSelectedLocation(locs[0].id);
    });
  }, []);

  const fetchSlots = async (locId) => {
    if (!locId) { setSlots([]); return; }
    setLoading(true);
    try {
      const res = await locationService.getSlots(locId);
      setSlots(res.data.slots || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchSlots(selectedLocation); }, [selectedLocation]);

  const openAdd = () => {
    setEditId(null);
    setFormData({ 
      location_id: selectedLocation, 
      slot_number: '', 
      vehicle_type: 'Car', 
      price_per_hour: '40', 
      status: 'available' 
    });
    setError('');
    setShowModal(true);
  };

  const openEdit = (slot) => {
    setEditId(slot.id);
    setFormData({ 
      location_id: slot.location_id, 
      slot_number: slot.slot_number, 
      vehicle_type: slot.vehicle_type, 
      price_per_hour: slot.price_per_hour, 
      status: slot.status 
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
        await adminService.updateSlot(editId, formData);
      } else {
        await adminService.createSlot(formData);
      }
      setShowModal(false);
      fetchSlots(selectedLocation);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot sensor bay?')) return;
    try {
      await adminService.deleteSlot(id);
      fetchSlots(selectedLocation);
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
              BAY TELEMETRY SENSORS
            </span>
          </div>
          <h1 className="fw-800 mb-0" style={{ fontSize: '1.5rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Parking Bay Sensor Matrix
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 0, marginTop: '2px' }}>
            Real-time telemetry slot mapping, vehicle category classification, and rate configuration.
          </p>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>
              Facility Hub:
            </span>
            <Form.Select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ 
                width: '260px', 
                height: '40px', 
                borderRadius: '8px', 
                borderColor: '#CBD5E1',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#0F172A',
                paddingTop: '0.35rem',
                paddingBottom: '0.35rem',
                lineHeight: 1.4
              }}
              className="shadow-sm"
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </Form.Select>
          </div>

          <Button 
            onClick={openAdd} 
            className="btn btn-primary d-inline-flex align-items-center gap-2 px-3.5 fw-600 shadow-sm border-0"
            style={{ 
              background: '#2563EB', 
              height: '40px', 
              borderRadius: '8px',
              fontSize: '0.88rem',
              whiteSpace: 'nowrap'
            }} 
            disabled={!selectedLocation}
          >
            <FaPlus size={12} /> Add New Bay
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="cyber-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--primary)' }} />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaParking size={44} className="mb-3 text-muted" />
            <h5 className="fw-700" style={{ color: '#0F172A' }}>No Slots in This Facility</h5>
            <Button onClick={openAdd} className="btn btn-primary mt-2" style={{ background: '#2563EB' }}>
              Add First Bay
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber mb-0">
              <thead>
                <tr>
                  <th>Bay Ident</th>
                  <th>Vehicle Category</th>
                  <th>Hourly Rate</th>
                  <th>Sensor Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id}>
                    <td>
                      <span className="font-mono fw-800" style={{ fontSize: '1rem', color: '#0F172A' }}>
                        {slot.slot_number}
                      </span>
                    </td>
                    <td>
                      <span className="d-flex align-items-center gap-2" style={{ color: '#334155', fontWeight: 600 }}>
                        <span>{VEHICLE_ICONS[slot.vehicle_type] || '🚗'}</span>
                        <span>{slot.vehicle_type}</span>
                        {slot.vehicle_type === 'EV' && <FaBolt color="#2563EB" size={12} />}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono fw-700" style={{ color: '#2563EB' }}>
                        {formatCurrency(slot.price_per_hour)}/hr
                      </span>
                    </td>
                    <td>
                      <span className={`ps-badge ${
                        slot.status === 'available' ? 'ps-badge-success' :
                        slot.status === 'occupied' ? 'ps-badge-danger' :
                        'ps-badge-warning'
                      }`} style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>
                        <span className="ps-badge-dot"></span>
                        {slot.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1.5">
                        <Button 
                          onClick={() => openEdit(slot)} 
                          variant="light"
                          className="btn-sm border p-1 px-2 rounded-2"
                          style={{ color: '#334155', background: '#F8FAFC' }}
                          title="Edit Bay"
                        >
                          <FaEdit size={13} />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(slot.id)} 
                          variant="light"
                          className="btn-sm border p-1 px-2 rounded-2"
                          style={{ color: '#DC2626', background: '#FEF2F2', borderColor: '#FECACA' }}
                          title="Delete Bay"
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

      {/* Clean Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
      >
        <Modal.Header closeButton className="border-bottom px-4 pt-4 pb-3">
          <Modal.Title className="fw-800" style={{ color: '#0F172A', fontSize: '1.25rem' }}>
            {editId ? 'Modify Slot Configuration' : 'Register New Parking Bay'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Slot Identifier Label</Form.Label>
              <Form.Control 
                value={formData.slot_number} 
                onChange={(e) => setFormData({ ...formData, slot_number: e.target.value })} 
                placeholder="e.g. A-01, B-12, EV-04" 
                required 
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label className="form-label">Vehicle Category</Form.Label>
                <Form.Select 
                  value={formData.vehicle_type} 
                  onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                >
                  <option value="Car">🚗 Passenger Car</option>
                  <option value="Bike">🏍️ Two Wheeler</option>
                  <option value="EV">⚡ Electric Vehicle</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="form-label">Hourly Tariff (₹)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={formData.price_per_hour} 
                  onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })} 
                  placeholder="e.g. 40" 
                  required 
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Initial Sensor State</Form.Label>
              <Form.Select 
                value={formData.status} 
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">🟢 Available / Vacant</option>
                <option value="occupied">🔴 Occupied</option>
                <option value="maintenance">🔧 Under Maintenance</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top px-4 pb-4">
            <Button variant="light" onClick={() => setShowModal(false)} className="rounded-3 border">
              Cancel
            </Button>
            <Button type="submit" className="btn btn-primary" style={{ background: '#2563EB' }} disabled={saving}>
              {saving ? <Spinner size="sm" className="me-1" /> : null}
              {editId ? 'Save Changes' : 'Create Slot'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
