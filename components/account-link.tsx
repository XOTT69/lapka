'use client';
import Link from 'next/link';
import {UserRound} from 'lucide-react';
import {useEffect,useState} from 'react';
import {createClient} from '@/lib/supabase/client';

export default function AccountLink(){
 const [signedIn,setSignedIn]=useState<boolean|null>(null);
 useEffect(()=>{const supabase=createClient();if(!supabase){setSignedIn(false);return}supabase.auth.getSession().then(({data})=>setSignedIn(Boolean(data.session)));const {data}=supabase.auth.onAuthStateChange((_event,session)=>setSignedIn(Boolean(session)));return()=>data.subscription.unsubscribe()},[]);
 return <Link className="accountLink" href={signedIn===false?'/sign-in':'/account'}><UserRound size={18}/><span>{signedIn===false?'Увійти':'Профіль'}</span></Link>
}
