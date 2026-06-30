import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { donors } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function createDonorId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LSD-${stamp}-${suffix}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const phone = searchParams.get("phone")?.trim();

    if (email || phone) {
      const matches = await db
        .select()
        .from(donors)
        .where(
          email && phone
            ? or(eq(donors.email, email), eq(donors.phone, phone))
            : email
            ? eq(donors.email, email)
            : eq(donors.phone, phone as string)
        )
        .limit(1);

      return NextResponse.json(matches[0] ?? null);
    }

    const allDonors = await db
      .select()
      .from(donors)
      .orderBy(desc(donors.createdAt));
    return NextResponse.json(allDonors);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch donors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const bloodGroup = String(body.bloodGroup ?? "").trim();

    if (
      !body.firstName ||
      !body.lastName ||
      !email ||
      !phone ||
      !bloodGroups.includes(bloodGroup) ||
      !body.dateOfBirth ||
      !body.weight ||
      !body.address
    ) {
      return NextResponse.json(
        { error: "Please complete every donor registration field." },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(donors)
      .where(or(eq(donors.email, email), eq(donors.phone, phone)))
      .limit(1);

    if (existing[0]) {
      return NextResponse.json(
        {
          error: "This email or phone number is already registered.",
          donor: existing[0],
        },
        { status: 409 }
      );
    }

    const newDonor = await db
      .insert(donors)
      .values({
        donorId: createDonorId(),
        firstName: String(body.firstName).trim(),
        lastName: String(body.lastName).trim(),
        email,
        phone,
        bloodGroup: bloodGroup as "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-",
        dateOfBirth: new Date(body.dateOfBirth),
        weight: body.weight ? parseInt(body.weight) : null,
        address: String(body.address).trim(),
        status: "Registered",
      })
      .returning();

    return NextResponse.json(newDonor[0], { status: 201 });
  } catch (error) {
    console.error("Donor registration failed", error);
    return NextResponse.json(
      { error: "Failed to register donor" },
      { status: 500 }
    );
  }
}
