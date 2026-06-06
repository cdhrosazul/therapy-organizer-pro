import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let headers: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) headers = { Authorization: `Bearer ${token}` };
    }
    return next({ headers });
  },
);
