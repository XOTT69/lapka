'use client';

import Link from 'next/link';
import { UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function AccountLink() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <Link className="accountLink" href={signedIn ? '/account' : '/sign-in'}>
      <UserRound size={18} />
      <span>{signedIn ? 'Профіль' : 'Увійти'}</span>
    </Link>
  );
}
