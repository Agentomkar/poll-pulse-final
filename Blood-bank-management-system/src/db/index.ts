import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { Pool } from "pg";
import { PGlite } from "@electric-sql/pglite";
import path from "path";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __pgliteInstance?: PGlite;
  __pgliteInitPromise?: Promise<void>;
  __drizzleDb?: any;
};

async function typeExists(client: PGlite, typeName: string) {
  try {
    const res = await client.query(`SELECT 1 FROM pg_type WHERE typname = $1`, [typeName]);
    return res.rows.length > 0;
  } catch {
    return false;
  }
}

async function initializeSchema(client: PGlite) {
  try {
    // Create enums if they don't exist
    if (!(await typeExists(client, "blood_group"))) {
      await client.query(`CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')`);
    }
    if (!(await typeExists(client, "request_status"))) {
      await client.query(`CREATE TYPE request_status AS ENUM ('pending', 'approved', 'fulfilled', 'rejected', 'urgent')`);
    }
    if (!(await typeExists(client, "urgency_level"))) {
      await client.query(`CREATE TYPE urgency_level AS ENUM ('normal', 'urgent', 'critical')`);
    }

    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS blood_inventory (
        id SERIAL PRIMARY KEY,
        blood_group blood_group NOT NULL,
        units_available INTEGER NOT NULL DEFAULT 0,
        units_reserved INTEGER NOT NULL DEFAULT 0,
        expiry_date TIMESTAMP,
        last_updated TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
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
    `);

    await client.query(`
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
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        donor_id INTEGER NOT NULL REFERENCES donors(id),
        blood_group blood_group NOT NULL,
        units_donated INTEGER NOT NULL DEFAULT 1,
        donation_date TIMESTAMP NOT NULL DEFAULT NOW(),
        location VARCHAR(200),
        notes TEXT
      );
    `);

    // Seed blood_inventory if empty
    const invCount = await client.query('SELECT count(*) as count FROM blood_inventory');
    if (parseInt((invCount.rows[0] as any).count as string) === 0) {
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
      for (const bg of bloodGroups) {
        const units = Math.floor(Math.random() * 80) + 20; // 20 to 100 units
        const reserved = Math.floor(Math.random() * 10);
        await client.query(
          `INSERT INTO blood_inventory (blood_group, units_available, units_reserved, expiry_date) VALUES ($1, $2, $3, NOW() + INTERVAL '30 days')`,
          [bg, units, reserved]
        );
      }
      console.log("Database seeded successfully with local blood inventory.");
    }
  } catch (err) {
    console.error("Failed to initialize PGLite schema", err);
  }
}

function createInitAwaitingClient(client: PGlite) {
  return new Proxy(client, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === "function") {
        return async function (...args: any[]) {
          if (globalForDb.__pgliteInitPromise) {
            await globalForDb.__pgliteInitPromise;
          }
          return value.apply(target, args);
        };
      }
      return value;
    },
  });
}

function getPgliteDb() {
  if (!globalForDb.__drizzleDb) {
    let client = globalForDb.__pgliteInstance;
    if (!client) {
      const dbPath = path.resolve(process.cwd(), "./db-local");
      client = new PGlite(dbPath);
      globalForDb.__pgliteInstance = client;
      globalForDb.__pgliteInitPromise = initializeSchema(client);
    }
    const wrappedClient = createInitAwaitingClient(client);
    globalForDb.__drizzleDb = drizzlePglite(wrappedClient as any);
  }
  return globalForDb.__drizzleDb;
}

export const pool = databaseUrl
  ? globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    })
  : undefined;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = pool ? drizzle(pool) : getPgliteDb();
