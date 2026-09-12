"""
Parking slot routes — CRUD for parking slots (Admin only for mutations).
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.parking_slot import ParkingSlot
from app.models.parking_location import ParkingLocation
from app.utils.decorators import admin_required
from app.utils.validators import validate_vehicle_type

slots_bp = Blueprint('slots', __name__)


@slots_bp.route('', methods=['POST'])
@jwt_required()
@admin_required
def create_slot():
    """
    POST /api/slots (Admin only)
    Body: { location_id, slot_number, vehicle_type, price_per_hour }
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    location_id = data.get('location_id')
    slot_number = data.get('slot_number', '').strip()
    vehicle_type = data.get('vehicle_type')
    price_per_hour = data.get('price_per_hour')

    # Validate required fields
    if not location_id:
        return jsonify({'error': 'Location ID is required'}), 400
    if not slot_number:
        return jsonify({'error': 'Slot number is required'}), 400
    if not validate_vehicle_type(vehicle_type):
        return jsonify({'error': 'Invalid vehicle type. Must be Car, Bike, or EV'}), 400
    if not price_per_hour or float(price_per_hour) <= 0:
        return jsonify({'error': 'Price per hour must be greater than 0'}), 400

    # Check location exists
    location = ParkingLocation.query.get(location_id)
    if not location:
        return jsonify({'error': 'Parking location not found'}), 404

    # Check for duplicate slot number at this location
    existing = ParkingSlot.query.filter_by(
        location_id=location_id, slot_number=slot_number
    ).first()
    if existing:
        return jsonify({'error': f'Slot {slot_number} already exists at this location'}), 409

    slot = ParkingSlot(
        location_id=location_id,
        slot_number=slot_number,
        vehicle_type=vehicle_type,
        price_per_hour=float(price_per_hour),
        status='available',
    )
    db.session.add(slot)
    db.session.commit()

    return jsonify({
        'message': 'Parking slot created successfully',
        'slot': slot.to_dict(),
    }), 201


@slots_bp.route('/<int:slot_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_slot(slot_id):
    """
    PUT /api/slots/:id (Admin only)
    Body: fields to update (vehicle_type, price_per_hour, status).
    """
    slot = ParkingSlot.query.get(slot_id)
    if not slot:
        return jsonify({'error': 'Parking slot not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    if 'vehicle_type' in data:
        if not validate_vehicle_type(data['vehicle_type']):
            return jsonify({'error': 'Invalid vehicle type. Must be Car, Bike, or EV'}), 400
        slot.vehicle_type = data['vehicle_type']

    if 'price_per_hour' in data:
        if float(data['price_per_hour']) <= 0:
            return jsonify({'error': 'Price per hour must be greater than 0'}), 400
        slot.price_per_hour = float(data['price_per_hour'])

    if 'status' in data:
        allowed_statuses = ['available', 'occupied', 'maintenance']
        if data['status'] not in allowed_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {", ".join(allowed_statuses)}'}), 400
        slot.status = data['status']

    if 'slot_number' in data:
        new_number = data['slot_number'].strip()
        if new_number and new_number != slot.slot_number:
            existing = ParkingSlot.query.filter_by(
                location_id=slot.location_id, slot_number=new_number
            ).first()
            if existing:
                return jsonify({'error': f'Slot {new_number} already exists at this location'}), 409
            slot.slot_number = new_number

    db.session.commit()

    return jsonify({
        'message': 'Parking slot updated successfully',
        'slot': slot.to_dict(),
    }), 200


@slots_bp.route('/<int:slot_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_slot(slot_id):
    """
    DELETE /api/slots/:id (Admin only)
    """
    slot = ParkingSlot.query.get(slot_id)
    if not slot:
        return jsonify({'error': 'Parking slot not found'}), 404

    db.session.delete(slot)
    db.session.commit()

    return jsonify({'message': 'Parking slot deleted successfully'}), 200
