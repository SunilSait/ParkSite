"""
Booking routes — create, view, and cancel bookings.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.booking import Booking
from app.models.parking_slot import ParkingSlot
from app.models.parking_location import ParkingLocation
from app.models.user import User
from app.services.booking_service import create_booking, cancel_booking
from app.services.qr_service import generate_booking_qr

bookings_bp = Blueprint('bookings', __name__)


@bookings_bp.route('', methods=['POST'])
@jwt_required()
def create_new_booking():
    """
    POST /api/bookings
    Body: { slot_id, booking_date, start_time, end_time }
    Creates a new booking with overlap validation.
    """
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    result, status_code = create_booking(user_id, data)
    return jsonify(result), status_code


@bookings_bp.route('', methods=['GET'])
@jwt_required()
def get_my_bookings():
    """
    GET /api/bookings
    Returns all bookings for the current user.
    Query params: status (filter by booking status)
    """
    user_id = int(get_jwt_identity())
    status_filter = request.args.get('status')

    query = Booking.query.filter_by(user_id=user_id)

    if status_filter:
        query = query.filter_by(status=status_filter)

    bookings = query.order_by(Booking.created_at.desc()).all()

    # Enrich booking data with location info
    result = []
    for booking in bookings:
        booking_dict = booking.to_dict()
        # Add location info
        if booking.slot and booking.slot.location:
            booking_dict['location'] = booking.slot.location.to_dict()
        result.append(booking_dict)

    return jsonify({
        'bookings': result,
        'total': len(result),
    }), 200


@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking_detail(booking_id):
    """
    GET /api/bookings/:id
    Returns booking details with QR code.
    """
    user_id = int(get_jwt_identity())
    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    if booking.user_id != user_id:
        return jsonify({'error': 'Access denied'}), 403

    booking_dict = booking.to_dict()

    # Add location info
    if booking.slot and booking.slot.location:
        booking_dict['location'] = booking.slot.location.to_dict()

    # Generate QR code
    user = User.query.get(user_id)
    qr_data = {
        'booking_reference': booking.booking_reference,
        'user_name': user.name if user else 'N/A',
        'location_name': booking.slot.location.name if booking.slot and booking.slot.location else 'N/A',
        'slot_number': booking.slot.slot_number if booking.slot else 'N/A',
        'booking_date': str(booking.booking_date),
        'start_time': booking.start_time.strftime('%H:%M') if booking.start_time else 'N/A',
        'end_time': booking.end_time.strftime('%H:%M') if booking.end_time else 'N/A',
        'total_amount': str(booking.total_amount),
        'status': booking.status,
    }
    booking_dict['qr_code'] = generate_booking_qr(qr_data)

    return jsonify({'booking': booking_dict}), 200


@bookings_bp.route('/<int:booking_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_my_booking(booking_id):
    """
    PUT /api/bookings/:id/cancel
    Cancels a booking.
    """
    user_id = int(get_jwt_identity())
    result, status_code = cancel_booking(booking_id, user_id)
    return jsonify(result), status_code
