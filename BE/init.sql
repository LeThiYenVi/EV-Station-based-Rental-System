-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create spatial index on stations table (will be created by migration)
-- This is just for reference, actual migration will handle