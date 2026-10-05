import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Tindahan Ledger",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="flex gap-8 border-b border-neutral-200 px-16 py-4">
          <Link href="/">Home</Link>
          <Link href="/customers">Customers</Link>
        </header>

        {children}
      </body>
    </html>
  );
}