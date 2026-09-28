import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";

export async function GET() {
  return NextResponse.json(await db.select().from(customers));
}

export async function POST(request: Request) {
  const { name, balance } = await request.json();
  const [row] = await db.insert(customers).values({ name, balance }).returning();
  return NextResponse.json(row, { status: 201 });
}