"""
Payment model — stores demo payment records for bookings.
"""

from app.extensions import db
from datetime import datetime


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False, unique=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.Enum('UPI', 'Card', 'Cash', name='payment_method'), nullable=False)
    payment_status = db.Column(
        db.Enum('pending', 'completed', 'failed', name='payment_status'),
        nullable=False,
        default='pending'
    )
    transaction_reference = db.Column(db.String(50), unique=True, nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        """Convert payment to dictionary."""
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'amount': float(self.amount) if self.amount else 0,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'transaction_reference': self.transaction_reference,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
        }

    def __repr__(self):
        return f'<Payment {self.transaction_reference}>'
