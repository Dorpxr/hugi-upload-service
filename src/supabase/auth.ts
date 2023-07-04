import { supabaseClient } from "./client";

export const signIn = async () => {
  return await supabaseClient.auth.signInWithPassword({
    email: process.env.SUPABASE_ACCOUNT_EMAIL || "",
    password: process.env.SUPABASE_ACCOUNT_PASSWORD || "",
  });
};
