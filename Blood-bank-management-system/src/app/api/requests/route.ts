import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bloodRequests, bloodInventory } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const requests = await db
      .select()
      .from(bloodRequests)
      .orderBy(desc(bloodRequests.requestedAt));
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRequest = await db
      .insert(bloodRequests)
      .values({
        patientName: body.patientName,
        hospitalName: body.hospitalName,
        bloodGroup: body.bloodGroup,
        unitsNeeded: parseInt(body.unitsNeeded),
        urgency: body.urgency || "normal",
        status: body.status || "pending",
        contactPhone: body.contactPhone,
        notes: body.notes,
      })
      .returning();

    return NextResponse.json(newRequest[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const updatedRequest = await db
      .update(bloodRequests)
      .set({
        status,
        fulfilledAt: status === "fulfilled" ? new Date() : null,
      })
      .where(eq(bloodRequests.id, id))
      .returning();

    // If the request was approved/fulfilled, deduct matching blood units from the inventory
    if (status === "fulfilled" && updatedRequest[0]) {
      const req = updatedRequest[0];
      const inv = await db
        .select()
        .from(bloodInventory)
        .where(eq(bloodInventory.bloodGroup, req.bloodGroup))
        .limit(1);

      if (inv[0]) {
        const available = Math.max(0, inv[0].unitsAvailable - req.unitsNeeded);
        await db
          .update(bloodInventory)
          .set({
            unitsAvailable: available,
            lastUpdated: new Date(),
          })
          .where(eq(bloodInventory.bloodGroup, req.bloodGroup));
      }
    }

    return NextResponse.json(updatedRequest[0]);
  } catch (error) {
    console.error("Failed to update request", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
