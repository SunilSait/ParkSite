"""
Custom decorators for route protection.
"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.models.user import User


def admin_required(fn):
    """
    Decorator that ensures the current user has the 'admin' role.
    Must be used AFTER @jwt_required() on a route.

    Usage:
        @route.get('/admin-only')
        @jwt_required()
        @admin_required
        def admin_dashboard():
            ...
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        return fn(*args, **kwargs)
    return wrapper
