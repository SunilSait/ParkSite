"""
Models package — imports all models so SQLAlchemy/Alembic can detect them.
"""

from .user import User
from .parking_location import ParkingLocation
from .parking_slot import ParkingSlot
from .booking import Booking
from .payment import Payment
from .notification import Notification

__all__ = [
    'User',
    'ParkingLocation',
    'ParkingSlot',
    'Booking',
    'Payment',
    'Notification',
]
