import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sulidxtbtblhkhwvggzy.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UZRENjCh8MgcoU6HleYS4w_F8UrDSGo';
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
