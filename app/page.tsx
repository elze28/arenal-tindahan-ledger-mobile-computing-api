import Link from "next/link";

export default function Home() {
  return (
    <main className="px-16 py-12">
      <h1 className="mb-6 text-4xl font-bold">Tindahan Ledger</h1>

      <Link
        href="/customers"
        className="underline underline-offset-4"
      >
        View customers
      </Link>
    </main>
  );
}