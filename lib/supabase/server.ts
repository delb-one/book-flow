import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY."
  );
}

export function createServerSupabaseClient() {
  return createClient(supabaseUrl as string, supabaseKey as string, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
