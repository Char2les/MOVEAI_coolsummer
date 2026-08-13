import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

let browserClient: ReturnType<typeof createClient> | undefined;

export const getSupabaseBrowserClient = () => {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  browserClient ??= createClient(config.url, config.key);
  return browserClient;
};
