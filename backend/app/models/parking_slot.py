"""
ParkingSlot model — individual parking slots within a location.
"""

from app.extensions import db
from datetime import datetime


class ParkingSlot(db.Model):
    __tablename__ = 'parking_slots'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    location_id = db.Column(db.Integer, db.ForeignKey('parking_locations.id', ondelete='CASCADE'), nullable=False)
    slot_number = db.Column(db.String(10), nullable=False)
    vehicle_type = db.Column(db.Enum('Car', 'Bike', 'EV', name='vehicle_type'), nullable=False)
    price_per_hour = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(
        db.Enum('available', 'occupied', 'maintenance', name='slot_status'),
        nullable=False,
        default='available'
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Unique constraint: slot_number must be unique per location
    __table_args__ = (
        db.UniqueConstraint('location_id', 'slot_number', name='uq_location_slot'),
        db.Index('idx_location_vehicle', 'location_id', 'vehicle_type'),
    )

    # Relationships
    bookings = db.relationship('Booking', backref='slot', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        """Convert slot to dictionary."""
        return {
            'id': self.id,
            'location_id': self.location_id,
            'slot_number': self.slot_number,
            'vehicle_type': self.vehicle_type,
            'price_per_hour': float(self.price_per_hour) if self.price_per_hour else 0,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<ParkingSlot {self.slot_number}>'
