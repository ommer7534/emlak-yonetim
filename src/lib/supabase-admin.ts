import { createClient } from "@supabase/supabase-js";

// Service role key bypasses RLS — only use server-side
export function getSupabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY eksik. .env.local dosyasına ekleyin:\n" +
        "SUPABASE_SERVICE_ROLE_KEY=eyJ...\n" +
        "(Supabase Dashboard → Settings → API → service_role)"
    );
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
