import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  "https://rdknncflrnzreesbpnpc.supabase.co",
  process.env.SUPABASE_ANON_KEY || "",
  {
    auth: {
      persistSession: false,
    },
  }
);
