"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { getProfile, verifyUser } from "@/lib/auth";
import {
  CustomerSchema,
  EntrySchema,
} from "@/lib/definitions";
import {
  addEntry,
  readCustomer,
} from "@/lib/customers";

export async function addCustomer(formData: FormData) {
  const profile = await verifyUser();

  if (profile.role !== "admin") {
    return {
      error: "Forbidden",
    };
  }

  const parsed = CustomerSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      error: "Invalid customer name.",
    };
  }

  await db.insert(customers).values({
    name: parsed.data.name,
  });

  revalidatePath("/customers");
}

export type EntryState = {
  message: string;
  amount: string;
};

export async function recordEntry(
  customerId: string,
  _prev: EntryState,
  form: FormData
): Promise<EntryState> {
  const amount = String(form.get("amount") ?? "");

  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    return {
      message: "Only the admin can add dues and payments.",
      amount,
    };
  }

  const parsed = EntrySchema.safeParse({
    kind: form.get("kind"),
    amount,
  });

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0].message,
      amount,
    };
  }

  const customer = await readCustomer(customerId);

  if (!customer) {
    return {
      message: "This customer was removed.",
      amount,
    };
  }

  if (
  parsed.data.kind === "payment" &&
  parsed.data.amount > customer.balance
) {
  return {
    message: `The payment is more than the ₱${Number(
      customer.balance
    ).toFixed(2)} owed.`,
    amount,
  };
}

  await addEntry(
    customerId,
    parsed.data.kind,
    parsed.data.amount
  );

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);

  return {
    message: "",
    amount: "",
  };
}