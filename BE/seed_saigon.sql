-- Seed additional Saigon stations with real latitude/longitude and add 5 vehicles per new station
-- This file keeps existing Users and Stations intact. PostGIS's spatial_ref_sys is assumed to exist via CREATE EXTENSION postgis.

-- Additional Stations in Ho Chi Minh City (Saigon)
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

-- Vehicles per newly inserted station (5 vehicles each)
-- Landmark 81 Station
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

-- Ben Thanh Market Station
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

-- Tan Son Nhat Airport Station
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

-- Notre-Dame Cathedral Station
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

-- Bitexco Tower Station
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

