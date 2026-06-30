const fs = require('fs');
const { Client } = require('pg');

const envContent = fs.readFileSync('.env', 'utf8');
const envLine = envContent.split(/\r?\n/).find((line) => line.startsWith('DATABASE_URL='));
if (!envLine) {
  throw new Error('DATABASE_URL not found in .env');
}
const connectionString = envLine.split('=')[1].trim().replace(/^"|"$/g, '');

const sql = `
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blood_group') THEN
    CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
    CREATE TYPE request_status AS ENUM ('pending', 'approved', 'fulfilled', 'rejected', 'urgent');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'urgency_level') THEN
    CREATE TYPE urgency_level AS ENUM ('normal', 'urgent', 'critical');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS donors (
  id SERIAL PRIMARY KEY,
  donor_id VARCHAR(32) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  blood_group blood_group NOT NULL,
  date_of_birth TIMESTAMP NOT NULL,
  weight_kg INTEGER,
  last_donation TIMESTAMP,
  is_eligible BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(32) NOT NULL DEFAULT 'Registered',
  address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blood_inventory (
  id SERIAL PRIMARY KEY,
  blood_group blood_group NOT NULL,
  units_available INTEGER NOT NULL DEFAULT 0,
  units_reserved INTEGER NOT NULL DEFAULT 0,
  expiry_date TIMESTAMP,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blood_requests (
  id SERIAL PRIMARY KEY,
  patient_name VARCHAR(200) NOT NULL,
  hospital_name VARCHAR(200) NOT NULL,
  blood_group blood_group NOT NULL,
  units_needed INTEGER NOT NULL,
  urgency urgency_level NOT NULL DEFAULT 'normal',
  status request_status NOT NULL DEFAULT 'pending',
  contact_phone VARCHAR(20) NOT NULL,
  notes TEXT,
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  fulfilled_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER NOT NULL REFERENCES donors(id),
  blood_group blood_group NOT NULL,
  units_donated INTEGER NOT NULL DEFAULT 1,
  donation_date TIMESTAMP NOT NULL DEFAULT NOW(),
  location VARCHAR(200),
  notes TEXT
);
`;

(async () => {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to Supabase.');
    await client.query(sql);
    console.log('Schema created or confirmed successfully.');
  } catch (err) {
    console.error('Error creating schema:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
