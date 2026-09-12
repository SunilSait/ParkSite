"""
Flask Application Factory.
Creates and configures the Flask app instance.
"""

import os
from flask import Flask, jsonify
from .config import config_by_name
from .extensions import db, migrate, jwt, cors


def create_app(config_name=None):
    """
    Create and configure the Flask application.

    Args:
        config_name: 'development' or 'production'. Defaults to FLASK_ENV env var.

    Returns:
        Configured Flask app instance.
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # ── Initialize extensions ──────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # ── Import models so Alembic can detect them ───────────
    from .models import user, parking_location, parking_slot, booking, payment, notification

    # ── Register blueprints (API routes) ───────────────────
    from .routes.auth import auth_bp
    from .routes.users import users_bp
    from .routes.locations import locations_bp
    from .routes.slots import slots_bp
    from .routes.bookings import bookings_bp
    from .routes.payments import payments_bp
    from .routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(locations_bp, url_prefix='/api/locations')
    app.register_blueprint(slots_bp, url_prefix='/api/slots')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # ── Health check endpoint ──────────────────────────────
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'ok', 'message': 'Parking System API is running'}), 200

    # ── Global error handlers ──────────────────────────────
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not Found', 'message': 'The requested resource was not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal Server Error', 'message': 'Something went wrong'}), 500

    return app
