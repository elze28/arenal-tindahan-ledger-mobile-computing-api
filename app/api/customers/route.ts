import { NextResponse } from "next/server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { getProfile } from "@/lib/auth";

export async function GET(request: Request) {
  const profile = await getProfile(request);

  if (!profile) {
    return new NextResponse("", { status: 401 });
  }

  return NextResponse.json(await db.select().from(customers));
}

export async function POST(request: Request) {
  const profile = await getProfile(request);

  if (!profile) {
    return new NextResponse("", { status: 401 });
  }

  if (profile.role !== "admin") {
    return new NextResponse("", { status: 403 });
  }

  const { name, balance } = await request.json();

  const [row] = await db
    .insert(customers)
    .values({ name, balance })
    .returning();

  return NextResponse.json(row, { status: 201 });
}