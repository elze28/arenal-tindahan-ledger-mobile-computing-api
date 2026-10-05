import { notFound } from "next/navigation";

import { verifyUser } from "@/lib/auth";
import { readCustomer, readEntries } from "@/lib/customers";
import { EntryForm } from "./entry-form";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await verifyUser();

  const { id } = await params;

  const customer = await readCustomer(id);

  if (!customer) {
    notFound();
  }

  const entries = await readEntries(id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      {/* Customer information */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {customer.name}
        </h1>

        <p className="mt-5 text-2xl font-semibold text-neutral-900">
          ₱
          {Number(customer.balance).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          Last paid {customer.lastPaid}
        </p>

        {/* Admin only */}
        {profile.role === "admin" && (
          <div className="mt-7">
            <EntryForm customerId={customer.id} />
          </div>
        )}
      </section>

      {/* Transaction history */}
      <section className="mt-9">
        <h2 className="text-xl font-bold text-neutral-900">
          Dues and payments
        </h2>

        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {entries.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-neutral-500">
              No dues or payments recorded yet.
            </p>
          ) : (
            entries.map((entry) => {
              const isPayment = entry.kind === "payment";

              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium capitalize text-neutral-900">
                      {entry.kind}
                    </span>

                    <span className="text-sm text-neutral-500">
                      {entry.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-neutral-900">
                    {isPayment ? "−" : "+"} ₱
                    {Number(entry.amount).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}