# 🅿️ ParkSite — Parking Slot Booking and Management System

A full-stack web application for booking and managing parking slots. Built with **React.js**, **Flask**, and **MySQL** — running entirely on a local computer for college demonstration.

> **⚠️ Demo Payment System** — This is a college project. No real payments are processed.

---

## 📋 Features

### User Features
- ✅ Register and login with JWT authentication
- ✅ Browse parking locations with search and city filter
- ✅ View parking slots with real-time availability
- ✅ Visual slot grid (color-coded: Available/Occupied/Selected/Maintenance)
- ✅ Select date, time, and vehicle type
- ✅ Book parking slots with overlap prevention
- ✅ Demo payment (UPI, Card, Cash)
- ✅ QR code booking confirmation with download
- ✅ View booking history and details
- ✅ Cancel bookings
- ✅ User dashboard with statistics
- ✅ Profile management

### Admin Features
- ✅ Admin dashboard with Chart.js analytics
- ✅ Manage parking locations (CRUD)
- ✅ Manage parking slots (CRUD)
- ✅ Manage users (view, toggle roles)
- ✅ View all bookings
- ✅ Revenue reports and charts

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, Vite, Bootstrap 5, React Router v6, Axios, Chart.js, Leaflet |
| **Backend** | Python 3, Flask, Flask-JWT-Extended, SQLAlchemy, Flask-Migrate |
| **Database** | MySQL 8.0 Community Edition |
| **Auth** | JWT tokens + Werkzeug password hashing |
| **QR Codes** | Python `qrcode` library |
| **Maps** | Leaflet + OpenStreetMap (free) |

---

## 📁 Project Structure

```
ParkSite/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory
│   │   ├── config.py            # Configuration
│   │   ├── extensions.py        # SQLAlchemy, JWT, etc.
│   │   ├── models/              # Database models (6 files)
│   │   ├── routes/              # API routes (7 blueprints)
│   │   ├── services/            # Business logic
│   │   └── utils/               # Decorators, validators
│   ├── migrations/              # Flask-Migrate
│   ├── seed.py                  # Sample data seeder
│   ├── requirements.txt
│   ├── run.py                   # Entry point
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   │   ├── public/          # Home, About, Login, etc.
│   │   │   ├── user/            # Dashboard, Bookings, etc.
│   │   │   └── admin/           # Admin Dashboard, CRUD, etc.
│   │   ├── layouts/             # MainLayout, UserLayout, AdminLayout
│   │   ├── services/            # API service wrappers
│   │   ├── context/             # Auth context
│   │   └── utils/               # Constants, helpers
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql               # Full SQL schema
├── .gitignore
└── README.md
```

---

## 📦 Prerequisites

Make sure you have these installed before starting:

| Software | Version | Download |
|----------|---------|----------|
| **Python** | 3.10+ | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **MySQL** | 8.0+ | [MySQL Community](https://dev.mysql.com/downloads/mysql/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd ParkSite
```

### Step 2: Create MySQL Database

Open **MySQL Command Line Client** or any MySQL tool and run:

```sql
CREATE DATABASE IF NOT EXISTS parking_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Step 3: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Edit the `backend/.env` file and set your MySQL password:

```env
DB_PASSWORD=your-mysql-root-password
```

### Step 5: Run Database Migrations

```bash
# Still in the backend folder with venv activated
flask db upgrade
```

### Step 6: Seed Sample Data

```bash
# Windows (to handle emojis):
set PYTHONIOENCODING=utf-8 && python seed.py

# Or with PowerShell:
$env:PYTHONIOENCODING='utf-8'; python seed.py
```

### Step 7: Start Backend Server

```bash
python run.py
# Backend runs on http://localhost:5000
```

### Step 8: Setup Frontend (in a NEW terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 9: Open the Application

Open your browser and go to: **http://localhost:5173**

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@example.com | admin123 |
| **User** | user@example.com | user123 |

---

## 🗄️ Database Design

### ER Diagram

The system uses 6 tables with proper foreign key relationships:

- **users** — User accounts (hashed passwords, roles)
- **parking_locations** — Parking facility info (name, address, coordinates, hours)
- **parking_slots** — Individual slots (vehicle type, price, status)
- **bookings** — Reservations (date, time, amount, reference, status)
- **payments** — Demo payment records
- **notifications** — User notifications

### Key Constraint: No Double-Booking

The server validates that no two confirmed bookings overlap:

```sql
-- Overlap check: reject if any existing booking conflicts
SELECT COUNT(*) FROM bookings
WHERE slot_id = :slot_id
  AND booking_date = :booking_date
  AND status != 'cancelled'
  AND start_time < :new_end_time
  AND end_time > :new_start_time;
```

---

## 🔌 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile` | JWT | Get profile |
| PUT | `/api/users/profile` | JWT | Update profile |

### Parking Locations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/locations` | — | List all (with search) |
| GET | `/api/locations/:id` | — | Get details |
| POST | `/api/locations` | Admin | Create |
| PUT | `/api/locations/:id` | Admin | Update |
| DELETE | `/api/locations/:id` | Admin | Delete |
| GET | `/api/locations/:id/slots` | — | List slots |

### Slots
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/slots` | Admin | Create slot |
| PUT | `/api/slots/:id` | Admin | Update slot |
| DELETE | `/api/slots/:id` | Admin | Delete slot |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | JWT | Create booking |
| GET | `/api/bookings` | JWT | My bookings |
| GET | `/api/bookings/:id` | JWT | Booking detail + QR |
| PUT | `/api/bookings/:id/cancel` | JWT | Cancel booking |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/demo` | JWT | Demo payment |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | All users |
| PUT | `/api/admin/users/:id` | Admin | Update user role |
| GET | `/api/admin/bookings` | Admin | All bookings |
| GET | `/api/admin/revenue` | Admin | Revenue analytics |

---

## 🔒 Security

- ✅ Password hashing with Werkzeug
- ✅ JWT authentication (24-hour expiry)
- ✅ Role-based authorization (admin_required decorator)
- ✅ CORS configuration
- ✅ Input validation (server-side)
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ Environment variables for secrets

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register a new user
- [ ] Login as user
- [ ] Login as admin
- [ ] Browse parking locations
- [ ] Search locations by name/city
- [ ] View parking detail and slots
- [ ] Check availability for date/time
- [ ] Select a slot and book
- [ ] Complete demo payment
- [ ] View booking details and QR code
- [ ] Download QR code
- [ ] Cancel a booking
- [ ] Try booking an already-booked slot (should fail with 409)
- [ ] Admin: Add a new location
- [ ] Admin: Add slots to location
- [ ] Admin: View dashboard stats
- [ ] Admin: View all bookings
- [ ] Admin: View revenue reports
- [ ] Admin: Manage users

---

## 🚀 Future Enhancements

- Real-time slot status updates with WebSockets
- Google Maps integration
- Email notifications
- Real payment gateway integration
- Mobile app (React Native)
- Parking lot occupancy sensors
- Automated booking completion
- Multi-language support
- Dark mode theme

---

## 👨‍💻 Built By

College Project — Parking Slot Booking and Management System

**Technology Stack:** React.js + Flask + MySQL

---

*© 2026 ParkSite — All rights reserved.*
