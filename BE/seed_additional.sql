-- filepath: /home/khang/Dev/Java/EV-Station-based-Rental-System/BE/seed_additional.sql
-- Additional seed data for local testing: bookings (various statuses), payments, feedbacks, blogs.
-- NOTE: Intentionally do NOT insert or modify users here — we rely on users created by init.sql.
-- This file assumes init.sql has been applied (stations, users, vehicles exist).

-- Helper: use existing renter created by init.sql (email: viltyse182544@fpt.edu.vn)

-- 1) Create bookings in different statuses
-- Note: checked_out_by is NOT NULL in schema; use an existing STAFF user from users table

-- PENDING booking (not yet confirmed)
INSERT INTO bookings (booking_code, renter_id, vehicle_id, station_id, start_time, expected_end_time, status, checked_out_by, base_price, deposit_paid, total_amount, payment_status, pickup_note, created_at)
VALUES (
  'BOOK-PEND-0001',
  (SELECT id FROM users WHERE email = 'viltyse182544@fpt.edu.vn' LIMIT 1),
  (SELECT id FROM vehicles WHERE license_plate = '51A-12345' LIMIT 1),
  (SELECT id FROM stations WHERE name = 'Station A' LIMIT 1),
  TIMESTAMP '2025-12-15 09:00:00',
  TIMESTAMP '2025-12-15 12:00:00',
  'PENDING',
  (SELECT id FROM users WHERE role = 'STAFF' LIMIT 1),
  50000,
  20000,
  70000,
  'PENDING',
  'Please have the helmets ready',
  CURRENT_TIMESTAMP
);

-- CONFIRMED booking
INSERT INTO bookings (booking_code, renter_id, vehicle_id, station_id, start_time, expected_end_time, status, checked_out_by, base_price, deposit_paid, total_amount, payment_status, pickup_note, created_at)
VALUES (
  'BOOK-CONF-0001',
  (SELECT id FROM users WHERE email = 'viltyse182544@fpt.edu.vn' LIMIT 1),
  (SELECT id FROM vehicles WHERE license_plate = '51B-67890' LIMIT 1),
  (SELECT id FROM stations WHERE name = 'Station B' LIMIT 1),
  TIMESTAMP '2025-12-10 08:00:00',
  TIMESTAMP '2025-12-10 18:00:00',
  'CONFIRMED',
  (SELECT id FROM users WHERE role = 'STAFF' LIMIT 1),
  250000,
  150000,
  400000,
  'DEPOSIT_PAID',
  'Confirmed by staff on duty',
  CURRENT_TIMESTAMP
);

-- ONGOING booking
INSERT INTO bookings (booking_code, renter_id, vehicle_id, station_id, start_time, expected_end_time, status, checked_out_by, base_price, deposit_paid, total_amount, payment_status, pickup_note, created_at)
VALUES (
  'BOOK-ONGO-0001',
  (SELECT id FROM users WHERE email = 'viltyse182544@fpt.edu.vn' LIMIT 1),
  (SELECT id FROM vehicles WHERE license_plate = '51C-11111' LIMIT 1),
  (SELECT id FROM stations WHERE name = 'Station C' LIMIT 1),
  TIMESTAMP '2025-12-05 10:00:00',
  TIMESTAMP '2025-12-05 14:00:00',
  'ONGOING',
  (SELECT id FROM users WHERE role = 'STAFF' LIMIT 1),
  140000,
  50000,
  190000,
  'DEPOSIT_PAID',
  'Started today',
  CURRENT_TIMESTAMP
);

-- COMPLETED booking (with payment)
INSERT INTO bookings (booking_code, renter_id, vehicle_id, station_id, start_time, expected_end_time, actual_end_time, status, checked_out_by, checked_in_by, base_price, deposit_paid, extra_fee, total_amount, payment_status, pickup_note, return_note, created_at)
VALUES (
  'BOOK-COMP-0001',
  (SELECT id FROM users WHERE email = 'viltyse182544@fpt.edu.vn' LIMIT 1),
  (SELECT id FROM vehicles WHERE license_plate = '51A-12345' LIMIT 1),
  (SELECT id FROM stations WHERE name = 'Station A' LIMIT 1),
  TIMESTAMP '2025-11-20 09:00:00',
  TIMESTAMP '2025-11-20 17:00:00',
  TIMESTAMP '2025-11-20 16:45:00',
  'COMPLETED',
  (SELECT id FROM users WHERE role = 'STAFF' LIMIT 1),
  (SELECT id FROM users WHERE role = 'STAFF' LIMIT 1),
  400000,
  200000,
  0,
  400000,
  'PAID',
  'Pickup note',
  'Car returned in good condition',
  CURRENT_TIMESTAMP
);

-- CANCELLED booking
INSERT INTO bookings (booking_code, renter_id, vehicle_id, station_id, start_time, expected_end_time, status, checked_out_by, base_price, deposit_paid, total_amount, payment_status, pickup_note, created_at)
VALUES (
  'BOOK-CANC-0001',
  (SELECT id FROM users WHERE email = 'viltyse182544@fpt.edu.vn' LIMIT 1),
  (SELECT id FROM vehicles WHERE license_plate = '51B-67890' LIMIT 1),
  (SELECT id FROM stations WHERE name = 'Station B' LIMIT 1),
  TIMESTAMP '2025-11-25 09:00:00',
  TIMESTAMP '2025-11-25 12:00:00',
  'CANCELLED',
  (SELECT id FROM users WHERE role = 'STAFF' LIMIT 1),
  30000,
  0,
  0,
  'PENDING',
  'Cancelled by user',
  CURRENT_TIMESTAMP
);

-- 2) Payments for the COMPLETED booking
INSERT INTO payments (booking_id, amount, payment_method, status, processed_by, transaction_id, paid_at, created_at)
VALUES (
  (SELECT id FROM bookings WHERE booking_code = 'BOOK-COMP-0001' LIMIT 1),
  400000,
  'MOMO',
  'PAID',
  (SELECT id FROM users WHERE role = 'STAFF' LIMIT 1),
  'TXN-BOOK-COMP-0001',
  TIMESTAMP '2025-11-20 16:50:00',
  CURRENT_TIMESTAMP
);

-- 3) Feedback for the COMPLETED booking
INSERT INTO feedbacks (booking_id, renter_id, vehicle_rating, station_rating, comment, is_edit, response, responded_by, responded_at, created_at)
VALUES (
  (SELECT id FROM bookings WHERE booking_code = 'BOOK-COMP-0001' LIMIT 1),
  (SELECT renter_id FROM bookings WHERE booking_code = 'BOOK-COMP-0001' LIMIT 1),
  4.8,
  4.5,
  'Great ride. Vehicle was clean and battery full.',
  false,
  'Thank you for your feedback',
  (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- 4) Add a few blog posts (author = existing admin user id)
INSERT INTO blogs (id, title, content, thumbnail_url, author_id, published, view_count, published_at, created_at, updated_at)
VALUES
(uuid_generate_v4(), 'How to prepare for your EV rental', 'Content: Tips and checklist before renting an EV...', 'https://example.com/thumb1.jpg', (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), true, 120, TIMESTAMP '2025-10-01 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Charging tips for long rides', 'Content: Best practices for charging on the road...', 'https://example.com/thumb2.jpg', (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), true, 85, TIMESTAMP '2025-10-20 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
;

-- 5) Quick sanity-check selects (optional - helpful when running via psql)
-- SELECT COUNT(*) FROM stations;
-- SELECT id, email, role FROM users ORDER BY created_at DESC LIMIT 10;
-- SELECT booking_code, status, start_time, expected_end_time FROM bookings ORDER BY created_at DESC LIMIT 10;

-- End of seed_additional.sql

