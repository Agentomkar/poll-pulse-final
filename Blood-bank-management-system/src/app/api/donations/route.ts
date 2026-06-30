import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { donations, donors, bloodInventory } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donorId, location, notes, unitsDonated } = body;

    const units = parseInt(unitsDonated) || 1;

    // Find the donor
    const donorList = await db
      .select()
      .from(donors)
      .where(eq(donors.id, donorId))
      .limit(1);

    const donor = donorList[0];
    if (!donor) {
      return NextResponse.json({ error: "Donor not found" }, { status: 404 });
    }

    // 1. Insert donation record
    const newDonation = await db
      .insert(donations)
      .values({
        donorId,
        bloodGroup: donor.bloodGroup,
        unitsDonated: units,
        location: location || "Central Clinic",
        notes: notes || "Regular donation",
      })
      .returning();

    // 2. Update donor status and last donation date
    await db
      .update(donors)
      .set({
        lastDonation: new Date(),
        status: "Active Donor",
      })
      .where(eq(donors.id, donorId));

    // 3. Increment units in blood inventory
    const inv = await db
      .select()
      .from(bloodInventory)
      .where(eq(bloodInventory.bloodGroup, donor.bloodGroup))
      .limit(1);

    if (inv[0]) {
      await db
        .update(bloodInventory)
        .set({
          unitsAvailable: inv[0].unitsAvailable + units,
          lastUpdated: new Date(),
        })
        .where(eq(bloodInventory.bloodGroup, donor.bloodGroup));
    }

    return NextResponse.json(newDonation[0], { status: 201 });
  } catch (error) {
    console.error("Donation logging failed", error);
    return NextResponse.json(
      { error: "Failed to log donation" },
      { status: 500 }
    );
  }
}
