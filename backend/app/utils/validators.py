"""
Input validation helpers.
"""

import re
from datetime import date, time, datetime


def validate_email(email):
    """Validate email format. Returns True if valid."""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone):
    """Validate phone number (optional field). Returns True if valid or empty."""
    if not phone:
        return True  # Phone is optional
    pattern = r'^\+?[\d\s\-]{7,20}$'
    return bool(re.match(pattern, phone))


def validate_password(password):
    """
    Validate password strength.
    Must be at least 6 characters long.
    Returns (is_valid, error_message).
    """
    if not password:
        return False, 'Password is required'
    if len(password) < 6:
        return False, 'Password must be at least 6 characters long'
    return True, None


def validate_booking_times(booking_date_str, start_time_str, end_time_str):
    """
    Validate booking date and time inputs.
    Returns (is_valid, error_message, parsed_date, parsed_start, parsed_end).
    """
    try:
        booking_date = datetime.strptime(booking_date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        return False, 'Invalid booking date format. Use YYYY-MM-DD', None, None, None

    try:
        start_time = datetime.strptime(start_time_str, '%H:%M').time()
    except (ValueError, TypeError):
        return False, 'Invalid start time format. Use HH:MM', None, None, None

    try:
        end_time = datetime.strptime(end_time_str, '%H:%M').time()
    except (ValueError, TypeError):
        return False, 'Invalid end time format. Use HH:MM', None, None, None

    # Check date is not in the past
    if booking_date < date.today():
        return False, 'Booking date cannot be in the past', None, None, None

    # Check end time is after start time
    if end_time <= start_time:
        return False, 'End time must be after start time', None, None, None

    return True, None, booking_date, start_time, end_time


def validate_vehicle_type(vehicle_type):
    """Validate vehicle type is one of the allowed values."""
    allowed = ['Car', 'Bike', 'EV']
    return vehicle_type in allowed
