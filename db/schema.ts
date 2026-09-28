import { numeric, pgTable, text } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  balance: numeric("balance", { precision: 10, scale: 2, mode: "number" })
    .notNull()
    .default(0),
  lastPaid: text("last_paid").notNull().default("never"),
});
