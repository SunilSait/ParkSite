"""
User profile routes — view and update own profile.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from app.extensions import db
from app.models.user import User
from app.utils.validators import validate_email, validate_phone, validate_password

users_bp = Blueprint('users', __name__)


@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    GET /api/users/profile
    Returns the current user's profile.
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'user': user.to_dict()}), 200


@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    PUT /api/users/profile
    Body: { name, phone, password (optional) }
    Updates the current user's profile.
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    # Update name
    if 'name' in data:
        name = data['name'].strip()
        if not name:
            return jsonify({'error': 'Name cannot be empty'}), 400
        user.name = name

    # Update phone
    if 'phone' in data:
        phone = data['phone'].strip()
        if not validate_phone(phone):
            return jsonify({'error': 'Invalid phone number'}), 400
        user.phone = phone if phone else None

    # Update password (optional)
    if 'password' in data and data['password']:
        is_valid, error = validate_password(data['password'])
        if not is_valid:
            return jsonify({'error': error}), 400
        user.password = generate_password_hash(data['password'])

    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict(),
    }), 200
