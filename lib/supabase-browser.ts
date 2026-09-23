import { createClient } from '@/lib/supabase/client';

export function getSupabaseBrowser() {
  return createClient();
}
