import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const bloodGroupEnum = pgEnum("blood_group", [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "approved",
  "fulfilled",
  "rejected",
  "urgent",
]);

export const urgencyEnum = pgEnum("urgency_level", [
  "normal",
  "urgent",
  "critical",
]);

// Blood inventory table
export const bloodInventory = pgTable("blood_inventory", {
  id: serial("id").primaryKey(),
  bloodGroup: bloodGroupEnum("blood_group").notNull(),
  unitsAvailable: integer("units_available").notNull().default(0),
  unitsReserved: integer("units_reserved").notNull().default(0),
  expiryDate: timestamp("expiry_date"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

// Donors table
export const donors = pgTable("donors", {
  id: serial("id").primaryKey(),
  donorId: varchar("donor_id", { length: 32 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  bloodGroup: bloodGroupEnum("blood_group").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  weight: integer("weight_kg"),
  lastDonation: timestamp("last_donation"),
  isEligible: boolean("is_eligible").notNull().default(true),
  status: varchar("status", { length: 32 }).notNull().default("Registered"),
  address: text("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Blood requests table
export const bloodRequests = pgTable("blood_requests", {
  id: serial("id").primaryKey(),
  patientName: varchar("patient_name", { length: 200 }).notNull(),
  hospitalName: varchar("hospital_name", { length: 200 }).notNull(),
  bloodGroup: bloodGroupEnum("blood_group").notNull(),
  unitsNeeded: integer("units_needed").notNull(),
  urgency: urgencyEnum("urgency").notNull().default("normal"),
  status: requestStatusEnum("status").notNull().default("pending"),
  contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
  notes: text("notes"),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  fulfilledAt: timestamp("fulfilled_at"),
});

// Donations history
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorId: integer("donor_id")
    .notNull()
    .references(() => donors.id),
  bloodGroup: bloodGroupEnum("blood_group").notNull(),
  unitsDonated: integer("units_donated").notNull().default(1),
  donationDate: timestamp("donation_date").notNull().defaultNow(),
  location: varchar("location", { length: 200 }),
  notes: text("notes"),
});
