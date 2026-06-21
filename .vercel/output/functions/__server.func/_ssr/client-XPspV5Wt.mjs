import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
const url = "https://cllltdybhvqfpzaddtuc.supabase.co";
const key = "sb_publishable_2lbE1mzXqTwJ0s4Irm1lEA_kS6Vi6g4";
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : void 0
  }
});
export {
  supabase as s
};
