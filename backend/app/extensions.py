"""
Flask extension instances.
Created here to avoid circular imports — initialized in the app factory.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Database ORM
db = SQLAlchemy()

# Database migrations (Alembic wrapper)
migrate = Migrate()

# JWT authentication
jwt = JWTManager()

# Cross-Origin Resource Sharing
cors = CORS()
