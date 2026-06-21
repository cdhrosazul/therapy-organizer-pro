import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
let cached = null;
function getSupabaseAdmin() {
  if (cached) return cached;
  const url = process.env.APP_SUPABASE_URL;
  const key = process.env.APP_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "APP_SUPABASE_URL ou APP_SUPABASE_SERVICE_ROLE_KEY ausentes. Configure as secrets no Lovable Cloud."
    );
  }
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return cached;
}
function getSupabaseAsUser(accessToken) {
  const url = process.env.APP_SUPABASE_URL;
  const key = process.env.APP_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server env ausentes.");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } }
  });
}
export {
  getSupabaseAdmin,
  getSupabaseAsUser
};
