import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function getProfile(request: Request) {
  const token = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  if (!token) return null;

  const { data } = await supabase.auth
    .getClaims(token)
    .catch(() => ({ data: null }));

  if (!data) return null;

  const { sub: id, email = "" } = data.claims;

  await db
    .insert(profiles)
    .values({ id, email })
    .onConflictDoNothing();

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id));

  return profile;
}