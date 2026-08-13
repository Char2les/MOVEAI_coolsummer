import { isSupabaseConfigured } from "@/lib/supabase/config";

export const useSupabaseData = () => process.env.NEXT_PUBLIC_DATA_SOURCE !== "mock" && isSupabaseConfigured();

export const requireData = <T>(data: T | null, error: { message: string } | null) => {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("Supabase returned no data.");
  return data;
};
