import Link from "next/link";

import { verifyUser } from "@/lib/auth";
import { readCustomers } from "@/lib/customers";
import { createClient } from "@/lib/supabase/server";
import { addCustomer } from "./actions";

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
}

async function addCustomerAction(formData: FormData) {
  "use server";

  await addCustomer(formData);
}

export default async function CustomersPage() {
  const profile = await verifyUser();
  const customers = await readCustomers();

  return (
    <main className="px-16 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>

          <p className="mt-2 text-sm text-neutral-600">
            {profile.email} · {profile.role}
          </p>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded border px-4 py-2"
          >
            Sign out
          </button>
        </form>
      </div>

      {profile.role === "admin" && (
        <form
          action={addCustomerAction}
          className="mb-8 flex max-w-lg gap-3"
        >
          <input
            type="text"
            name="name"
            placeholder="Customer name"
            required
            className="flex-1 rounded border px-3 py-2"
          />

          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Add customer
          </button>
        </form>
      )}

      <div className="space-y-3">
        {customers.map((customer) => (
          <Link
            key={customer.id}
            href={`/customers/${customer.id}`}
            className="block rounded border p-4"
          >
            <div className="font-medium">
              {customer.name}
            </div>

            <div className="text-sm text-neutral-600">
              Balance: ₱{customer.balance}
            </div>

            <div className="text-sm text-neutral-600">
              Last paid: {customer.lastPaid}
            </div>
          </Link>
        ))}

        {customers.length === 0 && (
          <p className="text-neutral-600">
            No customers yet.
          </p>
        )}
      </div>
    </main>
  );
}