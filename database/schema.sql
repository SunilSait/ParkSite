-- ============================================================
-- Parking Slot Booking System — Database Schema
-- MySQL 8.0+
-- ============================================================

-- Create the database (run this once)
CREATE DATABASE IF NOT EXISTS parking_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE parking_system;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE users (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    phone           VARCHAR(20)     DEFAULT NULL,
    password        VARCHAR(256)    NOT NULL COMMENT 'Werkzeug hashed password',
    role            ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_role (role)
) ENGINE=InnoDB;


-- ============================================================
-- 2. PARKING LOCATIONS
-- ============================================================
CREATE TABLE parking_locations (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    address         TEXT            NOT NULL,
    city            VARCHAR(100)    NOT NULL,
    latitude        DECIMAL(10, 8)  NOT NULL,
    longitude       DECIMAL(11, 8)  NOT NULL,
    description     TEXT            DEFAULT NULL,
    opening_time    TIME            NOT NULL,
    closing_time    TIME            NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_city (city)
) ENGINE=InnoDB;


-- ============================================================
-- 3. PARKING SLOTS
-- ============================================================
CREATE TABLE parking_slots (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    location_id     INT             NOT NULL,
    slot_number     VARCHAR(10)     NOT NULL,
    vehicle_type    ENUM('Car', 'Bike', 'EV') NOT NULL,
    price_per_hour  DECIMAL(10, 2)  NOT NULL,
    status          ENUM('available', 'occupied', 'maintenance')
                                    NOT NULL DEFAULT 'available',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Each slot number must be unique within a location
    UNIQUE KEY uq_location_slot (location_id, slot_number),

    -- Index for filtering by location + vehicle type
    INDEX idx_location_vehicle (location_id, vehicle_type),

    CONSTRAINT fk_slot_location
        FOREIGN KEY (location_id) REFERENCES parking_locations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 4. BOOKINGS
-- ============================================================
CREATE TABLE bookings (
    id                  INT             AUTO_INCREMENT PRIMARY KEY,
    user_id             INT             NOT NULL,
    slot_id             INT             NOT NULL,
    booking_date        DATE            NOT NULL,
    start_time          TIME            NOT NULL,
    end_time            TIME            NOT NULL,
    total_hours         DECIMAL(5, 2)   NOT NULL,
    total_amount        DECIMAL(10, 2)  NOT NULL,
    booking_reference   VARCHAR(20)     NOT NULL UNIQUE,
    status              ENUM('confirmed', 'cancelled', 'completed')
                                        NOT NULL DEFAULT 'confirmed',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Indexes for common queries
    INDEX idx_slot_date (slot_id, booking_date),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_booking_ref (booking_reference),

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_slot
        FOREIGN KEY (slot_id) REFERENCES parking_slots(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 5. PAYMENTS
-- ============================================================
CREATE TABLE payments (
    id                      INT             AUTO_INCREMENT PRIMARY KEY,
    booking_id              INT             NOT NULL UNIQUE,
    amount                  DECIMAL(10, 2)  NOT NULL,
    payment_method          ENUM('UPI', 'Card', 'Cash') NOT NULL,
    payment_status          ENUM('pending', 'completed', 'failed')
                                            NOT NULL DEFAULT 'pending',
    transaction_reference   VARCHAR(50)     DEFAULT NULL UNIQUE,
    paid_at                 DATETIME        DEFAULT NULL,

    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 6. NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    booking_id      INT             DEFAULT NULL,
    message         TEXT            NOT NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Index for fetching unread notifications per user
    INDEX idx_user_read (user_id, is_read),

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_notification_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;
