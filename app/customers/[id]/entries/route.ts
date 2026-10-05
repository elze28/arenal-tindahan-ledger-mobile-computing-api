import { NextResponse } from "next/server";

import { getProfile } from "@/lib/auth";
import {
  addEntry,
  readCustomer,
  readEntries,
} from "@/lib/customers";
import { EntrySchema } from "@/lib/definitions";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: Context
) {
  const profile = await getProfile(request);

  if (!profile) {
    return new NextResponse("", { status: 401 });
  }

  const { id } = await params;

  const entries = await readEntries(id);

  return NextResponse.json(entries);
}

export async function POST(
  request: Request,
  { params }: Context
) {
  const profile = await getProfile(request);

  if (!profile) {
    return new NextResponse("", { status: 401 });
  }

  if (profile.role !== "admin") {
    return new NextResponse("", { status: 403 });
  }

  const { id } = await params;

  const customer = await readCustomer(id);

  if (!customer) {
    return new NextResponse("", { status: 404 });
  }

  const parsed = EntrySchema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: parsed.error.issues[0].message,
      },
      {
        status: 400,
      }
    );
  }

  if (
    parsed.data.kind === "payment" &&
    parsed.data.amount > customer.balance
  ) {
    return NextResponse.json(
      {
        message: `The payment is more than the ₱${Number(
          customer.balance
        ).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} owed.`,
      },
      {
        status: 400,
      }
    );
  }

  const entry = await addEntry(
    id,
    parsed.data.kind,
    parsed.data.amount
  );

  return NextResponse.json(entry, {
    status: 201,
  });
}
