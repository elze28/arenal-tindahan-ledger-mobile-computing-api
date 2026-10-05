"use client";

import { useActionState } from "react";
import {
  recordEntry,
  type EntryState,
} from "../actions";

const initialState: EntryState = {
  message: "",
  amount: "",
};

export function EntryForm({
  customerId,
}: {
  customerId: string;
}) {
  const [state, action, pending] = useActionState(
    recordEntry.bind(null, customerId),
    initialState
  );

  return (
    <form action={action}>
      <div className="flex flex-wrap gap-2">
        <input
          name="amount"
          inputMode="decimal"
          defaultValue={state.amount}
          placeholder="Amount"
          required
          className="w-36 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-100"
        />

        <button
          type="submit"
          name="kind"
          value="due"
          disabled={pending}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          Add due
        </button>

        <button
          type="submit"
          name="kind"
          value="payment"
          disabled={pending}
          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
        >
          Record payment
        </button>
      </div>

      {state.message && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}
    </form>
  );
}