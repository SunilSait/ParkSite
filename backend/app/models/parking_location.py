"""
ParkingLocation model — stores parking facility information.
"""

from app.extensions import db
from datetime import datetime


class ParkingLocation(db.Model):
    __tablename__ = 'parking_locations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(100), nullable=False, index=True)
    latitude = db.Column(db.Numeric(10, 8), nullable=False)
    longitude = db.Column(db.Numeric(11, 8), nullable=False)
    description = db.Column(db.Text, nullable=True)
    opening_time = db.Column(db.Time, nullable=False)
    closing_time = db.Column(db.Time, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    slots = db.relationship('ParkingSlot', backref='location', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        """Convert location to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'latitude': float(self.latitude) if self.latitude else None,
            'longitude': float(self.longitude) if self.longitude else None,
            'description': self.description,
            'opening_time': self.opening_time.strftime('%H:%M') if self.opening_time else None,
            'closing_time': self.closing_time.strftime('%H:%M') if self.closing_time else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'total_slots': len(self.slots) if self.slots else 0,
            'available_slots': sum(1 for s in self.slots if s.status == 'available') if self.slots else 0,
        }

    def __repr__(self):
        return f'<ParkingLocation {self.name}>'
