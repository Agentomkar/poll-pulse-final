import { NextResponse } from "next/server";
import { db } from "@/db";
import { bloodInventory, donors, bloodRequests } from "@/db/schema";
import { sql, eq, desc, gte } from "drizzle-orm";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      inventoryData,
      donorCount,
      requestCount,
      pendingCount,
      newRegistrationCount,
      recentDonors,
      bloodGroupStats,
    ] =
      await Promise.all([
        db.select().from(bloodInventory),
        db
          .select({ count: sql<number>`cast(count(*) as int)` })
          .from(donors),
        db
          .select({ count: sql<number>`cast(count(*) as int)` })
          .from(bloodRequests),
        db
          .select({ count: sql<number>`cast(count(*) as int)` })
          .from(bloodRequests)
          .where(eq(bloodRequests.status, "pending")),
        db
          .select({ count: sql<number>`cast(count(*) as int)` })
          .from(donors)
          .where(gte(donors.createdAt, today)),
        db
          .select({
            id: donors.id,
            donorId: donors.donorId,
            firstName: donors.firstName,
            lastName: donors.lastName,
            email: donors.email,
            phone: donors.phone,
            bloodGroup: donors.bloodGroup,
            status: donors.status,
            createdAt: donors.createdAt,
          })
          .from(donors)
          .orderBy(desc(donors.createdAt))
          .limit(8),
        db
          .select({
            bloodGroup: donors.bloodGroup,
            count: sql<number>`cast(count(*) as int)`,
          })
          .from(donors)
          .groupBy(donors.bloodGroup),
      ]);

    const totalUnits = (inventoryData as any[]).reduce(
      (sum: number, row: any) => sum + row.unitsAvailable,
      0
    );

    return NextResponse.json({
      totalUnits,
      donorCount: donorCount[0]?.count ?? 0,
      newRegistrations: newRegistrationCount[0]?.count ?? 0,
      requestCount: requestCount[0]?.count ?? 0,
      pendingRequests: pendingCount[0]?.count ?? 0,
      inventory: inventoryData,
      recentDonors,
      bloodGroupStats,
    });
  } catch (error) {
    console.error("Stats fetch failed", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
