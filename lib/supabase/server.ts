import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// lib/supabase/server.ts
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(URL, PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(list) {
        try {
          list.forEach((c) =>
            cookieStore.set(c.name, c.value, c.options)
          );
        } catch {}
      },
    },
  });
}