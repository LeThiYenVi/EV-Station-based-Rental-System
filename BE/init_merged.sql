-- Merged initializer: original schema + base data + Saigon stations and vehicles
-- Includes PostGIS/uuid extensions, schema DDL, indexes, original base inserts, and appended Saigon seeds.

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

-- Base stations
INSERT INTO stations (name, address, latitude, longitude, hotline, status, photo, start_time, end_time, location) VALUES
('Station A', '123 Main Street, District 1, Ho Chi Minh City', 10.762622, 106.660172, '+84901234567', 'ACTIVE', 'https://example.com/station-a.jpg', '2024-01-01 06:00:00', '2024-01-01 22:00:00', ST_SetSRID(ST_MakePoint(106.660172, 10.762622), 4326)),
('Station B', '456 Nguyen Hue Blvd, District 1, Ho Chi Minh City', 10.774929, 106.701234, '+84901234568', 'ACTIVE', 'https://example.com/station-b.jpg', '2024-01-01 07:00:00', '2024-01-01 21:00:00', ST_SetSRID(ST_MakePoint(106.701234, 10.774929), 4326)),
('Station C', '789 Le Loi Street, District 3, Ho Chi Minh City', 10.776889, 106.692789, '+84901234569', 'ACTIVE', 'https://example.com/station-c.jpg', '2024-01-01 06:00:00', '2024-01-01 23:00:00', ST_SetSRID(ST_MakePoint(106.692789, 10.776889), 4326));

-- Base users
INSERT INTO users (id, email, full_name, phone, address, cognito_sub, avatar_url, role, license_number, identity_number, license_card_front_image_url, license_card_back_image_url, is_license_verified, verified_at, station_id, created_at, updated_at) VALUES
('fb698478-d7a4-430d-b89a-c076037cad64', 'tranngocchuongtnc@gmail.com', 'Tran Ngoc Chuong', '0123456789', NULL, 'f96a155c-b0f1-7072-35a3-b63f80fe4085', 'https://avatar.iran.liara.run/public/84', 'ADMIN', NULL, NULL, NULL, NULL, false, NULL, NULL, '2025-11-06 09:27:37.308294', '2025-11-06 09:27:37.308294'),
(uuid_generate_v4(), 'truongnguyenthaibinh1050@gmail.com', 'Truong Nguyen Thai Binh', NULL, NULL, '79eac58c-8001-7058-f289-a9ee365e0a70', 'https://avatar.iran.liara.run/public/1', 'STAFF', NULL, NULL, NULL, NULL, false, NULL, (SELECT id FROM stations WHERE name = 'Station A' LIMIT 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'viltyse182544@fpt.edu.vn', 'Vi', NULL, NULL, 'e90a15cc-90e1-709c-215b-a55b9f129d47', 'https://avatar.iran.liara.run/public/2', 'RENTER', NULL, NULL, NULL, NULL, false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Additional users (optional fields empty, preserving schema fields)
INSERT INTO users (id, email, full_name, phone, address, cognito_sub, avatar_url, role, license_number, identity_number, license_card_front_image_url, license_card_back_image_url, is_license_verified, verified_at, station_id, created_at, updated_at) VALUES
(uuid_generate_v4(), 'user1@example.com', 'Nguyen Van A', '', '', NULL, 'https://avatar.iran.liara.run/public/10', 'RENTER', '', '', '', '', false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'user2@example.com', 'Tran Thi B', '', '', NULL, 'https://avatar.iran.liara.run/public/11', 'RENTER', '', '', '', '', false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'staff1@example.com', 'Le Van Staff', '', '', NULL, 'https://avatar.iran.liara.run/public/12', 'STAFF', '', '', '', '', false, NULL, (SELECT id FROM stations WHERE name = 'Ben Thanh Market Station' LIMIT 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'admin2@example.com', 'Pham Admin', '', '', NULL, 'https://avatar.iran.liara.run/public/13', 'ADMIN', '', '', '', '', false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Base vehicles
INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count)
SELECT s.id, '51A-12345', 'VinFast VF e34', 'VinFast', 'White', 'ELECTRICITY', 5, 'AVAILABLE', 50000, 400000, 2000000, 4.5, 10
FROM stations s WHERE s.name = 'Station A' LIMIT 1;

INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count)
SELECT s.id, '51B-67890', 'Honda Vision', 'Honda', 'Red', 'GASOLINE', 2, 'AVAILABLE', 30000, 250000, 1500000, 4.8, 25
FROM stations s WHERE s.name = 'Station B' LIMIT 1;

INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count)
SELECT s.id, '51C-11111', 'Yamaha NVX', 'Yamaha', 'Black', 'GASOLINE', 2, 'AVAILABLE', 35000, 280000, 1800000, 4.3, 15
FROM stations s WHERE s.name = 'Station C' LIMIT 1;

-- Saigon stations (new) + 5 vehicles per station
INSERT INTO stations (name, address, latitude, longitude, hotline, status, photo, start_time, end_time, location)
VALUES
  (
    'Landmark 81 Station',
    'Vinhomes Central Park, 208 Nguyen Huu Canh, Ward 22, Binh Thanh District, Ho Chi Minh City',
    10.794046,
    106.720940,
    '+84901234570',
    'ACTIVE',
    'https://example.com/station-landmark81.jpg',
    '2024-01-01 06:00:00',
    '2024-01-01 22:00:00',
    ST_SetSRID(ST_MakePoint(106.720940, 10.794046), 4326)
  ),
  (
    'Ben Thanh Market Station',
    'Ben Thanh Market, Le Loi, Ben Thanh Ward, District 1, Ho Chi Minh City',
    10.772359,
    106.698894,
    '+84901234571',
    'ACTIVE',
    'https://example.com/station-benthanh.jpg',
    '2024-01-01 06:00:00',
    '2024-01-01 22:30:00',
    ST_SetSRID(ST_MakePoint(106.698894, 10.772359), 4326)
  ),
  (
    'Tan Son Nhat Airport Station',
    'Tan Son Nhat International Airport, Truong Son, Ward 2, Tan Binh District, Ho Chi Minh City',
    10.818530,
    106.658728,
    '+84901234572',
    'ACTIVE',
    'https://example.com/station-tsn.jpg',
    '2024-01-01 05:30:00',
    '2024-01-01 23:00:00',
    ST_SetSRID(ST_MakePoint(106.658728, 10.818530), 4326)
  ),
  (
    'Notre-Dame Cathedral Station',
    'Notre-Dame Cathedral Basilica of Saigon, 01 Cong Xa Paris, Ben Nghe Ward, District 1, Ho Chi Minh City',
    10.780353,
    106.699652,
    '+84901234573',
    'ACTIVE',
    'https://example.com/station-notredame.jpg',
    '2024-01-01 06:30:00',
    '2024-01-01 22:00:00',
    ST_SetSRID(ST_MakePoint(106.699652, 10.780353), 4326)
  ),
  (
    'Bitexco Tower Station',
    'Bitexco Financial Tower, 2 Hai Trieu, Ben Nghe Ward, District 1, Ho Chi Minh City',
    10.771997,
    106.704034,
    '+84901234574',
    'ACTIVE',
    'https://example.com/station-bitexco.jpg',
    '2024-01-01 07:00:00',
    '2024-01-01 23:00:00',
    ST_SetSRID(ST_MakePoint(106.704034, 10.771997), 4326)
  );

-- Vehicles per newly inserted Saigon station (5 vehicles each)
INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count)
SELECT s.id, lp, nm, br, cl, ft, cap, 'AVAILABLE', hr, dr, dep, rt, rc
FROM stations s
JOIN (
  VALUES
    ('59A-81811', 'VinFast VF 5', 'VinFast', 'Blue', 'ELECTRICITY', 5, 45000, 360000, 1800000, 4.4, 12),
    ('59A-81812', 'VinFast VF 6', 'VinFast', 'White', 'ELECTRICITY', 5, 50000, 400000, 2000000, 4.5, 10),
    ('59A-81813', 'Toyota Vios', 'Toyota', 'Silver', 'GASOLINE', 5, 60000, 450000, 2500000, 4.2, 20),
    ('59A-81814', 'Honda City', 'Honda', 'Black', 'GASOLINE', 5, 55000, 430000, 2200000, 4.3, 15),
    ('59A-81815', 'Yamaha Grande', 'Yamaha', 'Red', 'GASOLINE', 2, 30000, 240000, 1500000, 4.6, 30)
) v(lp, nm, br, cl, ft, cap, hr, dr, dep, rt, rc)
ON TRUE
WHERE s.name = 'Landmark 81 Station';

INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count)
SELECT s.id, lp, nm, br, cl, ft, cap, 'AVAILABLE', hr, dr, dep, rt, rc
FROM stations s
JOIN (
  VALUES
    ('59B-77201', 'VinFast VF e34', 'VinFast', 'White', 'ELECTRICITY', 5, 50000, 400000, 2000000, 4.6, 22),
    ('59B-77202', 'Hyundai Accent', 'Hyundai', 'Blue', 'GASOLINE', 5, 58000, 460000, 2300000, 4.1, 18),
    ('59B-77203', 'Toyota Corolla Cross', 'Toyota', 'Gray', 'GASOLINE', 5, 70000, 520000, 2800000, 4.5, 25),
    ('59B-77204', 'Honda SH Mode', 'Honda', 'Red', 'GASOLINE', 2, 35000, 270000, 1600000, 4.7, 35),
    ('59B-77205', 'Piaggio Liberty', 'Piaggio', 'Black', 'GASOLINE', 2, 38000, 300000, 1700000, 4.4, 28)
) v(lp, nm, br, cl, ft, cap, hr, dr, dep, rt, rc)
ON TRUE
WHERE s.name = 'Ben Thanh Market Station';

INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count)
SELECT s.id, lp, nm, br, cl, ft, cap, 'AVAILABLE', hr, dr, dep, rt, rc
FROM stations s
JOIN (
  VALUES
    ('59C-81801', 'Kia Seltos', 'Kia', 'Black', 'GASOLINE', 5, 80000, 600000, 3000000, 4.3, 16),
    ('59C-81802', 'Mitsubishi Xpander', 'Mitsubishi', 'White', 'GASOLINE', 7, 90000, 650000, 3200000, 4.2, 12),
    ('59C-81803', 'VinFast VF 8', 'VinFast', 'Green', 'ELECTRICITY', 5, 85000, 620000, 3100000, 4.5, 9),
    ('59C-81804', 'Honda Air Blade', 'Honda', 'Blue', 'GASOLINE', 2, 35000, 270000, 1600000, 4.6, 40),
    ('59C-81805', 'Yamaha NVX', 'Yamaha', 'Gray', 'GASOLINE', 2, 36000, 280000, 1700000, 4.3, 22)
) v(lp, nm, br, cl, ft, cap, hr, dr, dep, rt, rc)
ON TRUE
WHERE s.name = 'Tan Son Nhat Airport Station';

INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count)
SELECT s.id, lp, nm, br, cl, ft, cap, 'AVAILABLE', hr, dr, dep, rt, rc
FROM stations s
JOIN (
  VALUES
    ('59D-78001', 'Mazda 3', 'Mazda', 'Red', 'GASOLINE', 5, 75000, 560000, 2900000, 4.5, 14),
    ('59D-78002', 'Toyota Camry', 'Toyota', 'Silver', 'GASOLINE', 5, 95000, 720000, 3500000, 4.6, 11),
    ('59D-78003', 'VinFast VF 7', 'VinFast', 'Blue', 'ELECTRICITY', 5, 90000, 680000, 3300000, 4.4, 8),
    ('59D-78004', 'Honda Vision', 'Honda', 'Pink', 'GASOLINE', 2, 32000, 250000, 1500000, 4.7, 36),
    ('59D-78005', 'Piaggio Vespa', 'Piaggio', 'White', 'GASOLINE', 2, 42000, 320000, 1800000, 4.5, 27)
) v(lp, nm, br, cl, ft, cap, hr, dr, dep, rt, rc)
ON TRUE
WHERE s.name = 'Notre-Dame Cathedral Station';

INSERT INTO vehicles (station_id, license_plate, name, brand, color, fuel_type, capacity, status, hourly_rate, daily_rate, deposit_amount, rating, rent_count)
SELECT s.id, lp, nm, br, cl, ft, cap, 'AVAILABLE', hr, dr, dep, rt, rc
FROM stations s
JOIN (
  VALUES
    ('59E-77101', 'Hyundai i10', 'Hyundai', 'Orange', 'GASOLINE', 4, 60000, 450000, 2300000, 4.1, 18),
    ('59E-77102', 'Toyota Raize', 'Toyota', 'Black', 'GASOLINE', 5, 70000, 520000, 2800000, 4.3, 20),
    ('59E-77103', 'VinFast VF 9', 'VinFast', 'Gray', 'ELECTRICITY', 7, 120000, 900000, 4500000, 4.6, 7),
    ('59E-77104', 'Honda SH 150i', 'Honda', 'White', 'GASOLINE', 2, 45000, 340000, 2000000, 4.8, 38),
    ('59E-77105', 'Yamaha Grande', 'Yamaha', 'Blue', 'GASOLINE', 2, 38000, 300000, 1700000, 4.5, 29)
) v(lp, nm, br, cl, ft, cap, hr, dr, dep, rt, rc)
ON TRUE
WHERE s.name = 'Bitexco Tower Station';

-- Blogs per station (sample content - Vietnamese)
INSERT INTO blogs (title, content, thumbnail_url, author_id, published, view_count, published_at)
SELECT CONCAT(s.name, ' Khai trương'),
       CONCAT('Chúng tôi rất vui mừng thông báo khai trương trạm ', s.name, ' tại địa chỉ ', s.address, '. Ưu đãi đặc biệt cho khách hàng đầu tiên!'),
       'https://picsum.photos/seed/opening/800/400',
       (SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at LIMIT 1),
       true,
       100 + FLOOR(RANDOM()*200),
       CURRENT_TIMESTAMP
FROM stations s;

INSERT INTO blogs (title, content, thumbnail_url, author_id, published, view_count, published_at)
SELECT CONCAT('Top phương tiện tại ', s.name),
       CONCAT('Khám phá các phương tiện được đánh giá cao nhất tại ', s.name, '. Đặt ngay để trải nghiệm chuyến đi thoải mái khắp TP.HCM.'),
       'https://picsum.photos/seed/vehicles/800/400',
       (SELECT id FROM users WHERE role = 'STAFF' ORDER BY created_at LIMIT 1),
       true,
       80 + FLOOR(RANDOM()*150),
       CURRENT_TIMESTAMP
FROM stations s;

-- Additional 8 blog posts (Vietnamese topics)
INSERT INTO blogs (title, content, thumbnail_url, author_id, published, view_count, published_at) VALUES
('Mẹo sạc xe điện ở Sài Gòn', 'Học cách sạc hiệu quả và lên kế hoạch chuyến đi bằng xe điện quanh TP.HCM với các mẹo hữu ích.', 'https://picsum.photos/seed/evtips/800/400', (SELECT id FROM users WHERE role='ADMIN' ORDER BY created_at LIMIT 1), true, 210, CURRENT_TIMESTAMP),
('Phương tiện cho chuyến đi cuối tuần', 'Bạn đang lên kế hoạch du lịch cuối tuần? Xem ngay các phương tiện phù hợp cho chuyến đi dài và gia đình.', 'https://picsum.photos/seed/weekend/800/400', (SELECT id FROM users WHERE role='STAFF' ORDER BY created_at LIMIT 1), true, 185, CURRENT_TIMESTAMP),
('Phương án di chuyển trong thành phố', 'Danh sách phương tiện nhỏ gọn, linh hoạt dành cho việc đi lại hàng ngày trong đô thị đông đúc.', 'https://picsum.photos/seed/commuter/800/400', (SELECT id FROM users WHERE role='ADMIN' ORDER BY created_at LIMIT 1), true, 167, CURRENT_TIMESTAMP),
('5 cung đường đẹp nên trải nghiệm', 'Khám phá các cung đường đẹp trong và xung quanh Sài Gòn để tận hưởng cùng phương tiện thuê.', 'https://picsum.photos/seed/scenic/800/400', (SELECT id FROM users WHERE role='STAFF' ORDER BY created_at LIMIT 1), true, 142, CURRENT_TIMESTAMP),
('Checklist an toàn & bảo dưỡng', 'Trước khi lên đường, hãy xem qua checklist an toàn để có hành trình trọn vẹn.', 'https://picsum.photos/seed/safety/800/400', (SELECT id FROM users WHERE role='ADMIN' ORDER BY created_at LIMIT 1), true, 230, CURRENT_TIMESTAMP),
('Khuyến mãi mùa lễ hội', 'Nhận ưu đãi đặc biệt trong mùa lễ tại các trạm và phương tiện được chọn.', 'https://picsum.photos/seed/holiday/800/400', (SELECT id FROM users WHERE role='ADMIN' ORDER BY created_at LIMIT 1), true, 298, CURRENT_TIMESTAMP),
('Câu chuyện khách hàng', 'Đọc hành trình và trải nghiệm của khách hàng với dịch vụ thuê xe của chúng tôi.', 'https://picsum.photos/seed/stories/800/400', (SELECT id FROM users WHERE role='STAFF' ORDER BY created_at LIMIT 1), true, 156, CURRENT_TIMESTAMP),
('Hướng dẫn đặt xe & thanh toán', 'Hướng dẫn từng bước để tạo booking, thanh toán tiền cọc và phần còn lại qua MoMo.', 'https://picsum.photos/seed/guide/800/400', (SELECT id FROM users WHERE role='ADMIN' ORDER BY created_at LIMIT 1), true, 212, CURRENT_TIMESTAMP);

-- Feedback per station (Vietnamese comments/responses)
INSERT INTO feedbacks (booking_id, renter_id, vehicle_rating, station_rating, comment, is_edit, response, responded_by, responded_at)
SELECT NULL,
       u.id,
       ROUND(3 + (RANDOM()*2)::numeric, 1),
       ROUND(4 + (RANDOM()*1)::numeric, 1),
       CONCAT('Dịch vụ tại ', s.name, ' rất tốt. Nhân viên thân thiện và hỗ trợ nhiệt tình.'),
       false,
       'Cảm ơn bạn đã phản hồi! Hẹn gặp lại bạn trong những chuyến đi tới.',
       (SELECT id FROM users WHERE role = 'STAFF' AND station_id = s.id LIMIT 1),
       CURRENT_TIMESTAMP
FROM stations s
JOIN users u ON u.role = 'RENTER'
LIMIT 10;

INSERT INTO feedbacks (booking_id, renter_id, vehicle_rating, station_rating, comment, is_edit, response, responded_by, responded_at)
SELECT NULL,
       u.id,
       ROUND(4 + (RANDOM()*1)::numeric, 1),
       ROUND(3 + (RANDOM()*2)::numeric, 1),
       CONCAT('Phương tiện sạch sẽ và được bảo dưỡng tốt tại ', s.name, '.'),
       false,
       'Chúng tôi trân trọng đánh giá của bạn và sẽ tiếp tục nâng cao chất lượng dịch vụ.',
       (SELECT id FROM users WHERE role = 'STAFF' AND station_id = s.id LIMIT 1),
       CURRENT_TIMESTAMP
FROM stations s
JOIN users u ON u.role = 'RENTER'
LIMIT 10;

-- 50 feedback entries distributed across vehicles and stations (Vietnamese)
WITH renters AS (
  SELECT id FROM users WHERE role='RENTER'
), vehicles_sample AS (
  SELECT v.id AS vehicle_id, v.station_id FROM vehicles v ORDER BY v.created_at LIMIT 50
), staff_per_station AS (
  SELECT s.id AS station_id, (SELECT u.id FROM users u WHERE u.role='STAFF' AND u.station_id = s.id LIMIT 1) AS staff_id FROM stations s
)
INSERT INTO feedbacks (booking_id, renter_id, vehicle_rating, station_rating, comment, is_edit, response, responded_by, responded_at)
SELECT NULL,
       (SELECT id FROM renters ORDER BY RANDOM() LIMIT 1),
       ROUND(3 + (RANDOM()*2)::numeric, 1),
       ROUND(3 + (RANDOM()*2)::numeric, 1),
       CONCAT('Đánh giá phương tiện tại trạm ', (SELECT name FROM stations WHERE id = vs.station_id LIMIT 1), ': xe vận hành êm ái, trải nghiệm tốt.'),
       false,
       'Cảm ơn bạn đã đánh giá! Rất vui vì bạn hài lòng với chuyến đi.',
       (SELECT staff_id FROM staff_per_station WHERE station_id = vs.station_id),
       CURRENT_TIMESTAMP
FROM vehicles_sample vs;

WITH renters AS (
  SELECT id FROM users WHERE role='RENTER'
), vehicles_sample AS (
  SELECT v.id AS vehicle_id, v.station_id FROM vehicles v ORDER BY RANDOM() LIMIT 20
), staff_per_station AS (
  SELECT s.id AS station_id, (SELECT u.id FROM users u WHERE u.role='STAFF' AND u.station_id = s.id LIMIT 1) AS staff_id FROM stations s
)
INSERT INTO feedbacks (booking_id, renter_id, vehicle_rating, station_rating, comment, is_edit, response, responded_by, responded_at)
SELECT NULL,
       (SELECT id FROM renters ORDER BY RANDOM() LIMIT 1),
       ROUND(4 + (RANDOM()*1)::numeric, 1),
       ROUND(4 + (RANDOM()*1)::numeric, 1),
       CONCAT('Dịch vụ tại trạm ', (SELECT name FROM stations WHERE id = vs.station_id LIMIT 1), ' nhanh gọn, thủ tục nhận/trả xe thuận tiện.'),
       false,
       'Cảm ơn bạn! Đội ngũ của chúng tôi sẽ tiếp tục cải thiện mỗi ngày.',
       (SELECT staff_id FROM staff_per_station WHERE station_id = vs.station_id),
       CURRENT_TIMESTAMP
FROM vehicles_sample vs;
