import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { getProfile } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const profile = await getProfile(request);

  if (!profile) {
    return new NextResponse("", { status: 401 });
  }

  const { id } = await params;

  const [row] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id));

  return row
    ? NextResponse.json(row)
    : new NextResponse("", { status: 404 });
}