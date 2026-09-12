"""
Booking service — handles booking creation, overlap checking, and price calculation.
"""

import uuid
from datetime import datetime, date, timedelta
from app.extensions import db
from app.models.booking import Booking
from app.models.parking_slot import ParkingSlot
from app.models.parking_location import ParkingLocation
from app.utils.validators import validate_booking_times


def generate_booking_reference():
    """Generate a unique booking reference like PK-20260910-A3X7."""
    date_part = datetime.now().strftime('%Y%m%d')
    unique_part = uuid.uuid4().hex[:4].upper()
    return f'PK-{date_part}-{unique_part}'


def calculate_total_hours(start_time, end_time):
    """
    Calculate total hours between two time objects.
    Returns hours as a float (e.g. 2.5 for 2 hours 30 minutes).
    """
    start_dt = datetime.combine(date.today(), start_time)
    end_dt = datetime.combine(date.today(), end_time)
    diff = end_dt - start_dt
    return round(diff.total_seconds() / 3600, 2)


def check_slot_availability(slot_id, booking_date, start_time, end_time, exclude_booking_id=None):
    """
    Check if a slot is available for the given date and time range.
    Returns True if available, False if there's a conflict.

    The overlap logic:
    Two bookings overlap if:
        existing.start_time < new.end_time AND existing.end_time > new.start_time
    """
    query = Booking.query.filter(
        Booking.slot_id == slot_id,
        Booking.booking_date == booking_date,
        Booking.status != 'cancelled',  # Ignore cancelled bookings
        Booking.start_time < end_time,
        Booking.end_time > start_time,
    )

    # Exclude a specific booking (useful for updates)
    if exclude_booking_id:
        query = query.filter(Booking.id != exclude_booking_id)

    conflicting = query.first()
    return conflicting is None  # True if no conflicts


def create_booking(user_id, data):
    """
    Create a new booking after validating availability.
    Returns (success_dict, status_code) or (error_dict, status_code).
    """
    slot_id = data.get('slot_id')
    booking_date_str = data.get('booking_date')
    start_time_str = data.get('start_time')
    end_time_str = data.get('end_time')

    # ── Validate required fields ─────────────────────────
    if not slot_id:
        return {'error': 'Slot ID is required'}, 400

    # ── Validate date/time inputs ────────────────────────
    is_valid, error, booking_date, start_time, end_time = validate_booking_times(
        booking_date_str, start_time_str, end_time_str
    )
    if not is_valid:
        return {'error': error}, 400

    # ── Check slot exists and is available ───────────────
    slot = ParkingSlot.query.get(slot_id)
    if not slot:
        return {'error': 'Parking slot not found'}, 404

    if slot.status == 'maintenance':
        return {'error': 'This slot is currently under maintenance'}, 400

    # ── Check location operating hours ───────────────────
    location = ParkingLocation.query.get(slot.location_id)
    if location:
        if start_time < location.opening_time or end_time > location.closing_time:
            return {
                'error': f'Booking must be within operating hours: '
                         f'{location.opening_time.strftime("%H:%M")} - '
                         f'{location.closing_time.strftime("%H:%M")}'
            }, 400

    # ── Check for overlapping bookings (CRITICAL) ────────
    if not check_slot_availability(slot_id, booking_date, start_time, end_time):
        return {'error': 'This slot is already booked for the selected time period'}, 409

    # ── Calculate pricing ────────────────────────────────
    total_hours = calculate_total_hours(start_time, end_time)
    total_amount = round(float(slot.price_per_hour) * total_hours, 2)

    # ── Create booking ───────────────────────────────────
    booking = Booking(
        user_id=user_id,
        slot_id=slot_id,
        booking_date=booking_date,
        start_time=start_time,
        end_time=end_time,
        total_hours=total_hours,
        total_amount=total_amount,
        booking_reference=generate_booking_reference(),
        status='confirmed',
    )
    db.session.add(booking)
    db.session.commit()

    return {
        'message': 'Booking created successfully',
        'booking': booking.to_dict(),
    }, 201


def cancel_booking(booking_id, user_id):
    """
    Cancel a booking. Only the booking owner can cancel.
    Returns (success_dict, status_code) or (error_dict, status_code).
    """
    booking = Booking.query.get(booking_id)
    if not booking:
        return {'error': 'Booking not found'}, 404

    if booking.user_id != user_id:
        return {'error': 'You can only cancel your own bookings'}, 403

    if booking.status == 'cancelled':
        return {'error': 'Booking is already cancelled'}, 400

    if booking.status == 'completed':
        return {'error': 'Cannot cancel a completed booking'}, 400

    booking.status = 'cancelled'
    db.session.commit()

    return {
        'message': 'Booking cancelled successfully',
        'booking': booking.to_dict(),
    }, 200


def get_available_slots(location_id, booking_date_str, start_time_str, end_time_str, vehicle_type=None):
    """
    Get all available slots for a location at a given date/time.
    Returns list of available slot dicts.
    """
    is_valid, error, booking_date, start_time, end_time = validate_booking_times(
        booking_date_str, start_time_str, end_time_str
    )
    if not is_valid:
        return {'error': error}, 400

    # Get all slots at this location
    query = ParkingSlot.query.filter_by(location_id=location_id)
    if vehicle_type:
        query = query.filter_by(vehicle_type=vehicle_type)

    slots = query.all()
    available = []

    for slot in slots:
        if slot.status == 'maintenance':
            slot_dict = slot.to_dict()
            slot_dict['is_available'] = False
            available.append(slot_dict)
            continue

        is_free = check_slot_availability(slot.id, booking_date, start_time, end_time)
        slot_dict = slot.to_dict()
        slot_dict['is_available'] = is_free
        available.append(slot_dict)

    return available, 200
