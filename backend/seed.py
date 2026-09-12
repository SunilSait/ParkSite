"""
Database seed script — populates the database with sample data for demo.

Usage:
    cd backend
    python seed.py

This will create:
    - 1 admin user
    - 1 regular user
    - 3 parking locations (Chennai area)
    - Multiple parking slots per location
"""

import sys
import os

# Add the backend directory to path so we can import the app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import time
from werkzeug.security import generate_password_hash
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.parking_location import ParkingLocation
from app.models.parking_slot import ParkingSlot


def seed_database():
    """Populate the database with sample data."""

    app = create_app()

    with app.app_context():
        print("🌱 Starting database seed...")

        # ── Check if data already exists ─────────────────
        if User.query.first():
            print("⚠️  Database already has data. Skipping seed.")
            print("   To re-seed, drop all tables first and run migrations again.")
            return

        # ══════════════════════════════════════════════════
        # 1. CREATE USERS
        # ══════════════════════════════════════════════════
        print("👤 Creating users...")

        admin = User(
            name='Admin User',
            email='admin@example.com',
            phone='+91 9876543210',
            password=generate_password_hash('admin123'),
            role='admin',
        )

        user = User(
            name='John Doe',
            email='user@example.com',
            phone='+91 9876543211',
            password=generate_password_hash('user123'),
            role='user',
        )

        db.session.add_all([admin, user])
        db.session.commit()
        print(f"   ✅ Admin: admin@example.com / admin123")
        print(f"   ✅ User:  user@example.com / user123")

        # ══════════════════════════════════════════════════
        # 2. CREATE PARKING LOCATIONS (Chennai area)
        # ══════════════════════════════════════════════════
        print("\n📍 Creating parking locations...")

        location1 = ParkingLocation(
            name='City Mall Parking',
            address='No. 45, Anna Salai, Near Spencer Plaza, Chennai',
            city='Chennai',
            latitude=13.0604,
            longitude=80.2496,
            description='Multi-level parking facility at City Mall with 24/7 security, CCTV surveillance, and easy access from Anna Salai. Suitable for cars, bikes, and electric vehicles.',
            opening_time=time(6, 0),
            closing_time=time(23, 0),
        )

        location2 = ParkingLocation(
            name='Railway Station Parking',
            address='Chennai Central, Park Town, Chennai',
            city='Chennai',
            latitude=13.0827,
            longitude=80.2707,
            description='Convenient parking near Chennai Central Railway Station. Ideal for travellers. Well-lit with attendant on duty.',
            opening_time=time(5, 0),
            closing_time=time(23, 59),
        )

        location3 = ParkingLocation(
            name='College Campus Parking',
            address='University Road, Guindy, Chennai',
            city='Chennai',
            latitude=13.0067,
            longitude=80.2206,
            description='Open-air parking facility near the college campus. Affordable rates for students and faculty.',
            opening_time=time(7, 0),
            closing_time=time(21, 0),
        )

        db.session.add_all([location1, location2, location3])
        db.session.commit()
        print(f"   ✅ {location1.name}")
        print(f"   ✅ {location2.name}")
        print(f"   ✅ {location3.name}")

        # ══════════════════════════════════════════════════
        # 3. CREATE PARKING SLOTS
        # ══════════════════════════════════════════════════
        print("\n🅿️  Creating parking slots...")

        slots = []

        # --- City Mall Parking: 12 slots ---
        for i in range(1, 7):
            slots.append(ParkingSlot(
                location_id=location1.id,
                slot_number=f'A{i:02d}',
                vehicle_type='Car',
                price_per_hour=40.00,
                status='available',
            ))
        for i in range(1, 5):
            slots.append(ParkingSlot(
                location_id=location1.id,
                slot_number=f'B{i:02d}',
                vehicle_type='Bike',
                price_per_hour=20.00,
                status='available',
            ))
        for i in range(1, 3):
            slots.append(ParkingSlot(
                location_id=location1.id,
                slot_number=f'E{i:02d}',
                vehicle_type='EV',
                price_per_hour=50.00,
                status='available',
            ))

        # --- Railway Station Parking: 10 slots ---
        for i in range(1, 5):
            slots.append(ParkingSlot(
                location_id=location2.id,
                slot_number=f'A{i:02d}',
                vehicle_type='Car',
                price_per_hour=35.00,
                status='available',
            ))
        for i in range(1, 5):
            slots.append(ParkingSlot(
                location_id=location2.id,
                slot_number=f'B{i:02d}',
                vehicle_type='Bike',
                price_per_hour=15.00,
                status='available',
            ))
        for i in range(1, 3):
            slots.append(ParkingSlot(
                location_id=location2.id,
                slot_number=f'E{i:02d}',
                vehicle_type='EV',
                price_per_hour=45.00,
                status='available',
            ))

        # --- College Campus Parking: 8 slots ---
        for i in range(1, 4):
            slots.append(ParkingSlot(
                location_id=location3.id,
                slot_number=f'A{i:02d}',
                vehicle_type='Car',
                price_per_hour=25.00,
                status='available',
            ))
        for i in range(1, 5):
            slots.append(ParkingSlot(
                location_id=location3.id,
                slot_number=f'B{i:02d}',
                vehicle_type='Bike',
                price_per_hour=10.00,
                status='available',
            ))
        # One EV slot
        slots.append(ParkingSlot(
            location_id=location3.id,
            slot_number='E01',
            vehicle_type='EV',
            price_per_hour=30.00,
            status='available',
        ))

        # Set one slot to 'maintenance' for demo
        slots[5].status = 'maintenance'  # A06 at City Mall

        db.session.add_all(slots)
        db.session.commit()
        print(f"   ✅ City Mall Parking: 12 slots (6 Car, 4 Bike, 2 EV)")
        print(f"   ✅ Railway Station Parking: 10 slots (4 Car, 4 Bike, 2 EV)")
        print(f"   ✅ College Campus Parking: 8 slots (3 Car, 4 Bike, 1 EV)")

        print("\n" + "=" * 50)
        print("✅ Database seeded successfully!")
        print("=" * 50)
        print("\n📋 Demo Accounts:")
        print("   Admin → admin@example.com / admin123")
        print("   User  → user@example.com / user123")
        print()


if __name__ == '__main__':
    seed_database()
