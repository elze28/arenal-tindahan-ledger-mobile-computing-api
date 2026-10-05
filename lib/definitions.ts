import { z } from "zod";

export const CustomerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export const CredentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const EntrySchema = z.object({
  kind: z.enum(["due", "payment"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});
