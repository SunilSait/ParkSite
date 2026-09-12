"""
Payment routes — demo payment processing.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.payment_service import process_demo_payment

payments_bp = Blueprint('payments', __name__)


@payments_bp.route('/demo', methods=['POST'])
@jwt_required()
def demo_payment():
    """
    POST /api/payments/demo
    Body: { booking_id, payment_method }
    Simulates a payment (always succeeds for demo).
    """
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    result, status_code = process_demo_payment(user_id, data)
    return jsonify(result), status_code
