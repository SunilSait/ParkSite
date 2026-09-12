"""
Booking model — stores parking slot reservations.
"""

from app.extensions import db
from datetime import datetime


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    slot_id = db.Column(db.Integer, db.ForeignKey('parking_slots.id', ondelete='CASCADE'), nullable=False)
    booking_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    total_hours = db.Column(db.Numeric(5, 2), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    booking_reference = db.Column(db.String(20), nullable=False, unique=True)
    status = db.Column(
        db.Enum('confirmed', 'cancelled', 'completed', name='booking_status'),
        nullable=False,
        default='confirmed'
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        db.Index('idx_slot_date', 'slot_id', 'booking_date'),
        db.Index('idx_user', 'user_id'),
        db.Index('idx_status', 'status'),
    )

    # Relationships
    payment = db.relationship('Payment', backref='booking', uselist=False, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='booking', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        """Convert booking to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'slot_id': self.slot_id,
            'booking_date': self.booking_date.isoformat() if self.booking_date else None,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'total_hours': float(self.total_hours) if self.total_hours else 0,
            'total_amount': float(self.total_amount) if self.total_amount else 0,
            'booking_reference': self.booking_reference,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            # Include related slot and user info if loaded
            'slot': self.slot.to_dict() if self.slot else None,
            'user': self.user.to_dict() if self.user else None,
            'payment': self.payment.to_dict() if self.payment else None,
        }

    def __repr__(self):
        return f'<Booking {self.booking_reference}>'
