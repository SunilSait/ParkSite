"""
Authentication routes — register and login.
"""

from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    POST /api/auth/register
    Body: { name, email, phone, password }
    Returns: user info on success, error on failure.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    result, status_code = register_user(data)
    return jsonify(result), status_code


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    POST /api/auth/login
    Body: { email, password }
    Returns: JWT access_token + user info on success.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    result, status_code = login_user(data)
    return jsonify(result), status_code
