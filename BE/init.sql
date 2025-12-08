CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS stations CASCADE;

CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    address VARCHAR(500) NOT NULL,
    rating DOUBLE PRECISION DEFAULT 0.0,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    hotline VARCHAR(20),
    location GEOGRAPHY(Point, 4326),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    photo TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_station_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    CONSTRAINT chk_station_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(500),
    cognito_sub VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'RENTER',
    license_number VARCHAR(50),
    identity_number VARCHAR(50),
    license_card_front_image_url TEXT,
    license_card_back_image_url TEXT,
    is_license_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    station_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('RENTER', 'STAFF', 'ADMIN')),
    CONSTRAINT fk_user_station FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE SET NULL
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255),
    brand VARCHAR(100),
    color VARCHAR(50),
    fuel_type VARCHAR(20),
    rating DOUBLE PRECISION,
    capacity INTEGER,
    rent_count INTEGER DEFAULT 0,
    photos TEXT[],
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    hourly_rate NUMERIC(10, 2),
    daily_rate NUMERIC(10, 2),
    deposit_amount NUMERIC(10, 2),
    polices TEXT[],
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicle_station FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    CONSTRAINT chk_vehicle_fuel_type CHECK (fuel_type IN ('GASOLINE', 'ELECTRICITY')),
    CONSTRAINT chk_vehicle_status CHECK (status IN ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'CHARGING', 'UNAVAILABLE')),
    CONSTRAINT chk_vehicle_rating CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
    CONSTRAINT chk_vehicle_capacity CHECK (capacity > 0),
    CONSTRAINT chk_vehicle_rates CHECK (hourly_rate >= 0 AND daily_rate >= 0 AND deposit_amount >= 0)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(50) UNIQUE,
    renter_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    station_id UUID NOT NULL,
    start_time TIMESTAMP,
    expected_end_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING',
    checked_out_by UUID NOT NULL,
    checked_in_by UUID,
    base_price NUMERIC(10, 2),
    PARTIALLY_PAID NUMERIC(10, 2),
    extra_fee NUMERIC(10, 2),
    total_amount NUMERIC(10, 2),
    pickup_note TEXT,
    return_note TEXT,
    payment_status VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_renter FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_station FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_checked_out_by FOREIGN KEY (checked_out_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_checked_in_by FOREIGN KEY (checked_in_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_booking_status CHECK (status IN ('PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_booking_payment_status CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'PARTIALLY_PAID')),
    CONSTRAINT chk_booking_times CHECK (expected_end_time > start_time),
    CONSTRAINT chk_booking_amounts CHECK (base_price >= 0 AND PARTIALLY_PAID >= 0 AND extra_fee >= 0 AND total_amount >= 0)
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20),
    status VARCHAR(20),
    processed_by UUID,
    transaction_id VARCHAR(255),
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    CONSTRAINT fk_payment_processed_by FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('CASH', 'MOMO')),
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'PARTIALLY_PAID')),
    CONSTRAINT chk_payment_amount CHECK (amount >= 0)
);

CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE,
    renter_id UUID NOT NULL,
    vehicle_rating DOUBLE PRECISION,
    station_rating DOUBLE PRECISION,
    comment TEXT,
    is_edit BOOLEAN DEFAULT FALSE,
    response TEXT,
    responded_by UUID,
    responded_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_renter FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_responded_by FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_feedback_vehicle_rating CHECK (vehicle_rating IS NULL OR (vehicle_rating >= 0 AND vehicle_rating <= 5)),
    CONSTRAINT chk_feedback_station_rating CHECK (station_rating IS NULL OR (station_rating >= 0 AND station_rating <= 5))
);

CREATE INDEX idx_stations_location ON stations USING GIST(location);
CREATE INDEX idx_stations_status ON stations(status);
CREATE INDEX idx_stations_rating ON stations(rating);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_cognito_sub ON users(cognito_sub);
CREATE INDEX idx_users_station_id ON users(station_id);

CREATE INDEX idx_vehicles_station_id ON vehicles(station_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);

CREATE INDEX idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_station_id ON bookings(station_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_booking_code ON bookings(booking_code);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

CREATE INDEX idx_feedbacks_booking_id ON feedbacks(booking_id);
CREATE INDEX idx_feedbacks_renter_id ON feedbacks(renter_id);

CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url TEXT,
    author_id UUID NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_blog_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_blogs_author_id ON blogs(author_id);
CREATE INDEX idx_blogs_published ON blogs(published);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);
CREATE INDEX idx_blogs_view_count ON blogs(view_count);

INSERT INTO stations (name, address, latitude, longitude, hotline, status, photo, start_time, end_time, location) VALUES
('Station A', '123 Main Street, District 1, Ho Chi Minh City', 10.762622, 106.660172, '+84901234567', 'ACTIVE', 'https://example.com/station-a.jpg', '2024-01-01 06:00:00', '2024-01-01 22:00:00', ST_SetSRID(ST_MakePoint(106.660172, 10.762622), 4326)),
('Station B', '456 Nguyen Hue Blvd, District 1, Ho Chi Minh City', 10.774929, 106.701234, '+84901234568', 'ACTIVE', 'https://example.com/station-b.jpg', '2024-01-01 07:00:00', '2024-01-01 21:00:00', ST_SetSRID(ST_MakePoint(106.701234, 10.774929), 4326)),
('Station C', '789 Le Loi Street, District 3, Ho Chi Minh City', 10.776889, 106.692789, '+84901234569', 'ACTIVE', 'https://example.com/station-c.jpg', '2024-01-01 06:00:00', '2024-01-01 23:00:00', ST_SetSRID(ST_MakePoint(106.692789, 10.776889), 4326));

INSERT INTO users (id, email, full_name, phone, address, cognito_sub, avatar_url, role, license_number, identity_number, license_card_front_image_url, license_card_back_image_url, is_license_verified, verified_at, station_id, created_at, updated_at) VALUES
('fb698478-d7a4-430d-b89a-c076037cad64', 'tranngocchuongtnc@gmail.com', 'Tran Ngoc Chuong', '0123456789', NULL, 'f96a155c-b0f1-7072-35a3-b63f80fe4085', 'https://avatar.iran.liara.run/public/84', 'ADMIN', NULL, NULL, NULL, NULL, false, NULL, NULL, '2025-11-06 09:27:37.308294', '2025-11-06 09:27:37.308294'),
(uuid_generate_v4(), 'truongnguyenthaibinh1050@gmail.com', 'Truong Nguyen Thai Binh', NULL, NULL, '79eac58c-8001-7058-f289-a9ee365e0a70', 'https://avatar.iran.liara.run/public/1', 'STAFF', NULL, NULL, NULL, NULL, false, NULL, (SELECT id FROM stations WHERE name = 'Station A' LIMIT 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'viltyse182544@fpt.edu.vn', 'Vi', NULL, NULL, 'e90a15cc-90e1-709c-215b-a55b9f129d47', 'https://avatar.iran.liara.run/public/2', 'RENTER', NULL, NULL, NULL, NULL, false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count) 
SELECT 
    s.id,
    '51A-12345',
    'VinFast VF e34',
    'VinFast',
    'White',
    'ELECTRICITY',
    5,
    'AVAILABLE',
    50000,
    400000,
    2000000,
    4.5,
    10
FROM stations s WHERE s.name = 'Station A' LIMIT 1;

INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count) 
SELECT 
    s.id,
    '51B-67890',
    'Honda Vision',
    'Honda',
    'Red',
    'GASOLINE',
    2,
    'AVAILABLE',
    30000,
    250000,
    1500000,
    4.8,
    25
FROM stations s WHERE s.name = 'Station B' LIMIT 1;

INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count) 
SELECT 
    s.id,
    '51C-11111',
    'Yamaha NVX',
    'Yamaha',
    'Black',
    'GASOLINE',
    2,
    'AVAILABLE',
    35000,
    280000,
    1800000,
    4.3,
    15
FROM stations s WHERE s.name = 'Station C' LIMIT 1;

