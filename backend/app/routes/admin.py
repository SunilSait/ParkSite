"""
Admin routes — dashboard, user management, booking management, revenue.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, date, timedelta
from sqlalchemy import func
from app.extensions import db
from app.models.user import User
from app.models.parking_location import ParkingLocation
from app.models.parking_slot import ParkingSlot
from app.models.booking import Booking
from app.models.payment import Payment
from app.utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def dashboard():
    """
    GET /api/admin/dashboard
    Returns dashboard statistics for the admin panel.
    """
    total_users = User.query.filter_by(role='user').count()
    total_locations = ParkingLocation.query.count()
    total_slots = ParkingSlot.query.count()
    available_slots = ParkingSlot.query.filter_by(status='available').count()
    occupied_slots = ParkingSlot.query.filter_by(status='occupied').count()
    maintenance_slots = ParkingSlot.query.filter_by(status='maintenance').count()

    today = date.today()
    todays_bookings = Booking.query.filter(
        Booking.booking_date == today,
        Booking.status != 'cancelled',
    ).count()

    total_bookings = Booking.query.count()
    confirmed_bookings = Booking.query.filter_by(status='confirmed').count()
    cancelled_bookings = Booking.query.filter_by(status='cancelled').count()
    completed_bookings = Booking.query.filter_by(status='completed').count()

    # Total revenue (from completed payments)
    total_revenue = db.session.query(
        func.coalesce(func.sum(Payment.amount), 0)
    ).filter(Payment.payment_status == 'completed').scalar()

    return jsonify({
        'stats': {
            'total_users': total_users,
            'total_locations': total_locations,
            'total_slots': total_slots,
            'available_slots': available_slots,
            'occupied_slots': occupied_slots,
            'maintenance_slots': maintenance_slots,
            'todays_bookings': todays_bookings,
            'total_bookings': total_bookings,
            'confirmed_bookings': confirmed_bookings,
            'cancelled_bookings': cancelled_bookings,
            'completed_bookings': completed_bookings,
            'total_revenue': float(total_revenue),
        }
    }), 200


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users():
    """
    GET /api/admin/users
    Returns all users.
    """
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({
        'users': [u.to_dict() for u in users],
        'total': len(users),
    }), 200


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_user(user_id):
    """
    PUT /api/admin/users/:id
    Body: { role } — Admin can change user roles.
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    if 'role' in data:
        if data['role'] not in ['user', 'admin']:
            return jsonify({'error': 'Invalid role'}), 400
        user.role = data['role']

    db.session.commit()

    return jsonify({
        'message': 'User updated successfully',
        'user': user.to_dict(),
    }), 200


@admin_bp.route('/bookings', methods=['GET'])
@jwt_required()
@admin_required
def get_all_bookings():
    """
    GET /api/admin/bookings
    Returns all bookings across all users.
    Query params: status, date
    """
    status_filter = request.args.get('status')
    date_filter = request.args.get('date')

    query = Booking.query

    if status_filter:
        query = query.filter_by(status=status_filter)

    if date_filter:
        try:
            filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
            query = query.filter_by(booking_date=filter_date)
        except ValueError:
            pass

    bookings = query.order_by(Booking.created_at.desc()).all()

    result = []
    for booking in bookings:
        booking_dict = booking.to_dict()
        if booking.slot and booking.slot.location:
            booking_dict['location'] = booking.slot.location.to_dict()
        result.append(booking_dict)

    return jsonify({
        'bookings': result,
        'total': len(result),
    }), 200


@admin_bp.route('/revenue', methods=['GET'])
@jwt_required()
@admin_required
def get_revenue():
    """
    GET /api/admin/revenue
    Returns revenue statistics for charts.
    Query params: days (default 30)
    """
    days = int(request.args.get('days', 30))
    start_date = date.today() - timedelta(days=days)

    # Daily revenue for the chart
    daily_revenue = db.session.query(
        Booking.booking_date,
        func.sum(Booking.total_amount).label('revenue'),
        func.count(Booking.id).label('bookings')
    ).filter(
        Booking.booking_date >= start_date,
        Booking.status != 'cancelled',
    ).group_by(Booking.booking_date).order_by(Booking.booking_date).all()

    # Revenue by location
    revenue_by_location = db.session.query(
        ParkingLocation.name,
        func.sum(Booking.total_amount).label('revenue'),
        func.count(Booking.id).label('bookings')
    ).join(
        ParkingSlot, ParkingSlot.id == Booking.slot_id
    ).join(
        ParkingLocation, ParkingLocation.id == ParkingSlot.location_id
    ).filter(
        Booking.status != 'cancelled',
    ).group_by(ParkingLocation.name).all()

    # Revenue by vehicle type
    revenue_by_vehicle = db.session.query(
        ParkingSlot.vehicle_type,
        func.sum(Booking.total_amount).label('revenue'),
        func.count(Booking.id).label('bookings')
    ).join(
        ParkingSlot, ParkingSlot.id == Booking.slot_id
    ).filter(
        Booking.status != 'cancelled',
    ).group_by(ParkingSlot.vehicle_type).all()

    return jsonify({
        'daily_revenue': [
            {
                'date': str(row.booking_date),
                'revenue': float(row.revenue),
                'bookings': row.bookings,
            }
            for row in daily_revenue
        ],
        'revenue_by_location': [
            {
                'location': row.name,
                'revenue': float(row.revenue),
                'bookings': row.bookings,
            }
            for row in revenue_by_location
        ],
        'revenue_by_vehicle': [
            {
                'vehicle_type': row.vehicle_type,
                'revenue': float(row.revenue),
                'bookings': row.bookings,
            }
            for row in revenue_by_vehicle
        ],
    }), 200
