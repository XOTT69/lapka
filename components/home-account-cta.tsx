'use client';
import Link from 'next/link';
import {ArrowRight,UserRound} from 'lucide-react';
import {useEffect,useState} from 'react';
import {createClient} from '@/lib/supabase/client';

export default function HomeAccountCta({light=false}:{light?:boolean}){
 const [signedIn,setSignedIn]=useState<boolean|null>(null);
 useEffect(()=>{const s=createClient();if(!s){setSignedIn(false);return}s.auth.getSession().then(({data})=>setSignedIn(Boolean(data.session)));const {data}=s.auth.onAuthStateChange((_e,session)=>setSignedIn(Boolean(session)));return()=>data.subscription.unsubscribe()},[]);
 const href=signedIn?'/account':'/sign-up';
 const text=signedIn?'Мій профіль':'Створити профіль';
 return <Link className={light?'primary lightButton':'secondary'} href={href}><UserRound size={17}/>{text}<ArrowRight size={16}/></Link>
}
