import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bloodInventory } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const inventory = await db.select().from(bloodInventory);
    return NextResponse.json(inventory);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bloodGroup, unitsAvailable, unitsReserved } = body;

    const updated = await db
      .update(bloodInventory)
      .set({
        unitsAvailable: parseInt(unitsAvailable) ?? 0,
        unitsReserved: parseInt(unitsReserved) ?? 0,
        lastUpdated: new Date(),
      })
      .where(eq(bloodInventory.bloodGroup, bloodGroup))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Failed to update inventory", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}
