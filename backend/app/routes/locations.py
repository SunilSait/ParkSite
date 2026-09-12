"""
Parking location routes — CRUD for parking locations.
Public: list and view. Admin: create, update, delete.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.parking_location import ParkingLocation
from app.utils.decorators import admin_required

locations_bp = Blueprint('locations', __name__)


@locations_bp.route('', methods=['GET'])
def get_locations():
    """
    GET /api/locations
    Query params: city, search (name search)
    Returns list of all parking locations.
    """
    city = request.args.get('city', '').strip()
    search = request.args.get('search', '').strip()

    query = ParkingLocation.query

    if city:
        query = query.filter(ParkingLocation.city.ilike(f'%{city}%'))

    if search:
        query = query.filter(ParkingLocation.name.ilike(f'%{search}%'))

    locations = query.order_by(ParkingLocation.created_at.desc()).all()

    return jsonify({
        'locations': [loc.to_dict() for loc in locations],
        'total': len(locations),
    }), 200


@locations_bp.route('/<int:location_id>', methods=['GET'])
def get_location(location_id):
    """
    GET /api/locations/:id
    Returns a single parking location with its slots.
    """
    location = ParkingLocation.query.get(location_id)
    if not location:
        return jsonify({'error': 'Parking location not found'}), 404

    location_dict = location.to_dict()
    location_dict['slots'] = [slot.to_dict() for slot in location.slots]

    return jsonify({'location': location_dict}), 200


@locations_bp.route('', methods=['POST'])
@jwt_required()
@admin_required
def create_location():
    """
    POST /api/locations (Admin only)
    Body: { name, address, city, latitude, longitude, description, opening_time, closing_time }
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    # Validate required fields
    required = ['name', 'address', 'city', 'latitude', 'longitude', 'opening_time', 'closing_time']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    from datetime import datetime

    try:
        opening_time = datetime.strptime(data['opening_time'], '%H:%M').time()
        closing_time = datetime.strptime(data['closing_time'], '%H:%M').time()
    except ValueError:
        return jsonify({'error': 'Invalid time format. Use HH:MM'}), 400

    location = ParkingLocation(
        name=data['name'].strip(),
        address=data['address'].strip(),
        city=data['city'].strip(),
        latitude=float(data['latitude']),
        longitude=float(data['longitude']),
        description=data.get('description', '').strip() or None,
        opening_time=opening_time,
        closing_time=closing_time,
    )
    db.session.add(location)
    db.session.commit()

    return jsonify({
        'message': 'Parking location created successfully',
        'location': location.to_dict(),
    }), 201


@locations_bp.route('/<int:location_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_location(location_id):
    """
    PUT /api/locations/:id (Admin only)
    Body: fields to update.
    """
    location = ParkingLocation.query.get(location_id)
    if not location:
        return jsonify({'error': 'Parking location not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    from datetime import datetime

    if 'name' in data:
        location.name = data['name'].strip()
    if 'address' in data:
        location.address = data['address'].strip()
    if 'city' in data:
        location.city = data['city'].strip()
    if 'latitude' in data:
        location.latitude = float(data['latitude'])
    if 'longitude' in data:
        location.longitude = float(data['longitude'])
    if 'description' in data:
        location.description = data['description'].strip() or None
    if 'opening_time' in data:
        try:
            location.opening_time = datetime.strptime(data['opening_time'], '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Invalid opening_time format. Use HH:MM'}), 400
    if 'closing_time' in data:
        try:
            location.closing_time = datetime.strptime(data['closing_time'], '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Invalid closing_time format. Use HH:MM'}), 400

    db.session.commit()

    return jsonify({
        'message': 'Parking location updated successfully',
        'location': location.to_dict(),
    }), 200


@locations_bp.route('/<int:location_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_location(location_id):
    """
    DELETE /api/locations/:id (Admin only)
    Deletes a parking location and all its slots (cascade).
    """
    location = ParkingLocation.query.get(location_id)
    if not location:
        return jsonify({'error': 'Parking location not found'}), 404

    db.session.delete(location)
    db.session.commit()

    return jsonify({'message': 'Parking location deleted successfully'}), 200


@locations_bp.route('/<int:location_id>/slots', methods=['GET'])
def get_location_slots(location_id):
    """
    GET /api/locations/:id/slots
    Query params: vehicle_type, date, start_time, end_time
    Returns slots for a location with availability info.
    """
    location = ParkingLocation.query.get(location_id)
    if not location:
        return jsonify({'error': 'Parking location not found'}), 404

    # Check if availability query params are provided
    booking_date = request.args.get('date')
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')
    vehicle_type = request.args.get('vehicle_type')

    if booking_date and start_time and end_time:
        # Return slots with availability status
        from app.services.booking_service import get_available_slots
        result, status = get_available_slots(
            location_id, booking_date, start_time, end_time, vehicle_type
        )
        if isinstance(result, dict) and 'error' in result:
            return jsonify(result), status
        return jsonify({'slots': result, 'total': len(result)}), 200
    else:
        # Return all slots without availability check
        from app.models.parking_slot import ParkingSlot
        query = ParkingSlot.query.filter_by(location_id=location_id)
        if vehicle_type:
            query = query.filter_by(vehicle_type=vehicle_type)
        slots = query.all()
        return jsonify({
            'slots': [slot.to_dict() for slot in slots],
            'total': len(slots),
        }), 200
