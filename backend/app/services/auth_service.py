"""
Authentication service — handles user registration and login logic.
"""

from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.user import User
from app.utils.validators import validate_email, validate_phone, validate_password


def register_user(data):
    """
    Register a new user.
    Returns (success_dict, status_code) or (error_dict, status_code).
    """
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')

    # ── Validate inputs ──────────────────────────────────
    if not name:
        return {'error': 'Name is required'}, 400

    if not validate_email(email):
        return {'error': 'Invalid email address'}, 400

    if not validate_phone(phone):
        return {'error': 'Invalid phone number'}, 400

    is_valid_pw, pw_error = validate_password(password)
    if not is_valid_pw:
        return {'error': pw_error}, 400

    # ── Check if email already exists ────────────────────
    existing = User.query.filter_by(email=email).first()
    if existing:
        return {'error': 'Email already registered'}, 409

    # ── Create user ──────────────────────────────────────
    user = User(
        name=name,
        email=email,
        phone=phone if phone else None,
        password=generate_password_hash(password),
        role='user',
    )
    db.session.add(user)
    db.session.commit()

    return {
        'message': 'Registration successful',
        'user': user.to_dict(),
    }, 201


def login_user(data):
    """
    Authenticate a user and return a JWT token.
    Returns (success_dict, status_code) or (error_dict, status_code).
    """
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return {'error': 'Email and password are required'}, 400

    # ── Find user ────────────────────────────────────────
    user = User.query.filter_by(email=email).first()
    if not user:
        return {'error': 'Invalid email or password'}, 401

    # ── Verify password ──────────────────────────────────
    if not check_password_hash(user.password, password):
        return {'error': 'Invalid email or password'}, 401

    # ── Generate JWT ─────────────────────────────────────
    access_token = create_access_token(identity=str(user.id))

    return {
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict(),
    }, 200
