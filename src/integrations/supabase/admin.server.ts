import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.APP_SUPABASE_URL;
  const key = process.env.APP_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "APP_SUPABASE_URL ou APP_SUPABASE_SERVICE_ROLE_KEY ausentes. Configure as secrets no Lovable Cloud.",
    );
  }
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

export function getSupabaseAsUser(accessToken: string): SupabaseClient {
  const url = process.env.APP_SUPABASE_URL;
  const key = process.env.APP_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server env ausentes.");
  // Use the service key client but with the user's JWT for auth.getUser validation.
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
