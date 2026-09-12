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
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 animate-fade-down">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge-cyber badge-cyber-cyan">BAY TELEMETRY SENSORS</span>
          </div>
          <h2 className="fw-900 text-white mb-0" style={{ fontSize: '2rem' }}>
            Parking Bay Sensor Matrix
          </h2>
        </div>

        <div className="d-flex gap-3 align-items-center">
          <Form.Select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{ width: '240px' }}
          >
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </Form.Select>

          <Button onClick={openAdd} className="btn-cyber-primary py-2 px-3" disabled={!selectedLocation}>
            <FaPlus className="me-1" /> Add Bay
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="cyber-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--cyan-neon)' }} />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaParking size={48} className="mb-3" />
            <h5 className="text-white">No Slots in This Facility</h5>
            <Button onClick={openAdd} className="btn-cyber-primary mt-2">Add First Bay</Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-cyber">
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
                      <span className="font-mono fw-800 text-white" style={{ fontSize: '1.05rem' }}>
                        {slot.slot_number}
                      </span>
                    </td>
                    <td>
                      <span className="d-flex align-items-center gap-2 text-white">
                        <span>{VEHICLE_ICONS[slot.vehicle_type] || '🚗'}</span>
                        <span>{slot.vehicle_type}</span>
                        {slot.vehicle_type === 'EV' && <FaBolt color="#00f2fe" size={12} />}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono fw-700 text-info">
                        {formatCurrency(slot.price_per_hour)}/hr
                      </span>
                    </td>
                    <td>
                      <span className={`badge-cyber ${
                        slot.status === 'available' ? 'badge-cyber-emerald' :
                        slot.status === 'occupied' ? 'badge-cyber-rose' :
                        'badge-cyber-amber'
                      }`}>
                        {slot.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button onClick={() => openEdit(slot)} className="btn-cyber-outline py-1 px-2" title="Edit Bay">
                          <FaEdit />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(slot.id)} 
                          className="btn btn-sm btn-outline-danger py-1 px-2 rounded-2"
                          style={{ border: '1px solid rgba(255, 51, 102, 0.4)', background: 'rgba(255, 51, 102, 0.08)' }}
                          title="Delete Bay"
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

      {/* Cyber Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        contentClassName="cyber-card p-0 border-info"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25 px-4 pt-4 pb-3">
          <Modal.Title className="fw-800 text-white">
            {editId ? 'Modify Bay Configuration' : 'Register New Parking Bay'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Slot Identifier Code</Form.Label>
              <Form.Control 
                value={formData.slot_number} 
                onChange={(e) => setFormData({ ...formData, slot_number: e.target.value })} 
                placeholder="e.g. A-01, B-12" 
                required 
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label className="form-label">Vehicle Classification</Form.Label>
                <Form.Select 
                  value={formData.vehicle_type} 
                  onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                >
                  <option value="Car">🚗 Passenger Car</option>
                  <option value="Bike">🏍️ Two-Wheeler</option>
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
          <Modal.Footer className="border-top border-secondary border-opacity-25 px-4 pb-4">
            <Button variant="outline-light" onClick={() => setShowModal(false)} className="rounded-3">
              Cancel
            </Button>
            <Button type="submit" className="btn-cyber-primary" disabled={saving}>
              {saving ? <Spinner size="sm" className="me-1" /> : null}
              {editId ? 'Save Changes' : 'Create Slot'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
