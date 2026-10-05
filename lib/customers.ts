import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { customers, entries } from "@/db/schema";

export type EntryKind = "due" | "payment";

export async function readCustomers() {
  return db
    .select()
    .from(customers)
    .orderBy(customers.name);
}

export async function readCustomer(id: string) {
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id));

  return customer;
}

export async function readEntries(customerId: string) {
  return db
    .select()
    .from(entries)
    .where(eq(entries.customerId, customerId))
    .orderBy(desc(entries.createdAt));
}

export async function addEntry(
  customerId: string,
  kind: EntryKind,
  amount: number
) {
  // Add dues to the balance and subtract payments
  const change = kind === "due" ? amount : -amount;

  // Automatically get the date when the transaction happens
  // Example: "Oct 5"
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return db.transaction(async (tx) => {
    // Save the due/payment transaction
    const [entry] = await tx
      .insert(entries)
      .values({
        customerId,
        kind,
        amount,
      })
      .returning();

    // Update the customer's balance
    // lastPaid only changes when the transaction is a payment
    await tx
      .update(customers)
      .set({
        balance: sql`${customers.balance} + ${change}`,
        ...(kind === "payment"
          ? {
              lastPaid: today,
            }
          : {}),
      })
      .where(eq(customers.id, customerId));

    return entry;
  });
}