import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

// This uses only the publishable key. It never exposes a service-role key and
// is therefore still bound by RLS. Privileged order writes belong in a future
// authenticated server action or route handler.
export const getSupabaseServerClient = () => {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  return createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
};
