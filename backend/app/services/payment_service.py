"""
Payment service — handles demo payment simulation.
"""

import uuid
from datetime import datetime
from app.extensions import db
from app.models.payment import Payment
from app.models.booking import Booking


def generate_transaction_reference():
    """Generate a unique transaction reference like TXN-20260910-ABCD1234."""
    date_part = datetime.now().strftime('%Y%m%d')
    unique_part = uuid.uuid4().hex[:8].upper()
    return f'TXN-{date_part}-{unique_part}'


def process_demo_payment(user_id, data):
    """
    Simulate a payment for a booking.
    This is a DEMO payment system for the college project.

    Returns (success_dict, status_code) or (error_dict, status_code).
    """
    booking_id = data.get('booking_id')
    payment_method = data.get('payment_method')

    # ── Validate inputs ──────────────────────────────────
    if not booking_id:
        return {'error': 'Booking ID is required'}, 400

    allowed_methods = ['UPI', 'Card', 'Cash']
    if payment_method not in allowed_methods:
        return {'error': f'Invalid payment method. Choose from: {", ".join(allowed_methods)}'}, 400

    # ── Find the booking ─────────────────────────────────
    booking = Booking.query.get(booking_id)
    if not booking:
        return {'error': 'Booking not found'}, 404

    if booking.user_id != user_id:
        return {'error': 'You can only pay for your own bookings'}, 403

    if booking.status == 'cancelled':
        return {'error': 'Cannot pay for a cancelled booking'}, 400

    # ── Check if already paid ────────────────────────────
    existing_payment = Payment.query.filter_by(booking_id=booking_id).first()
    if existing_payment and existing_payment.payment_status == 'completed':
        return {'error': 'Payment already completed for this booking'}, 400

    # ── Simulate payment (always succeeds in demo) ───────
    if existing_payment:
        # Update existing pending payment
        existing_payment.payment_method = payment_method
        existing_payment.payment_status = 'completed'
        existing_payment.transaction_reference = generate_transaction_reference()
        existing_payment.paid_at = datetime.utcnow()
        payment = existing_payment
    else:
        # Create new payment record
        payment = Payment(
            booking_id=booking_id,
            amount=booking.total_amount,
            payment_method=payment_method,
            payment_status='completed',
            transaction_reference=generate_transaction_reference(),
            paid_at=datetime.utcnow(),
        )
        db.session.add(payment)

    db.session.commit()

    return {
        'message': 'Demo Payment Successful — College Project',
        'payment': payment.to_dict(),
        'booking': booking.to_dict(),
    }, 200
