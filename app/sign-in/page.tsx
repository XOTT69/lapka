'use client';
import Link from 'next/link';
import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {ArrowRight,Eye,EyeOff,LockKeyhole,Mail} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

export default function SignInPage(){
 const router=useRouter(); const [show,setShow]=useState(false); const [loading,setLoading]=useState(false); const [message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setMessage('');
  const supabase=createClient(); if(!supabase)return setMessage('Реєстрація ще не активована: потрібно підключити Supabase-проєкт.');
  const fd=new FormData(e.currentTarget); setLoading(true);
  const {error}=await supabase.auth.signInWithPassword({email:String(fd.get('email')||'').trim(),password:String(fd.get('password')||'')});
  setLoading(false); if(error)return setMessage('Не вдалося увійти. Перевір email і пароль.');
  router.replace('/account'); router.refresh();
 }
 return <main className="authShell"><section className="authVisual"><span className="authPill">LAPKA CLUB</span><h1>Тут зберігається<br/>все важливе.</h1><p>Замовлення, обране та профіль улюбленця — без повторного заповнення.</p><div className="authPetMark">🐾</div></section><section className="authPanel"><div className="authCard"><div className="authHead"><h2>Увійти</h2><p>Раді бачити знову.</p></div><form className="modernForm" onSubmit={submit}><label>Email<div className="inputWithIcon"><Mail size={18}/><input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></div></label><label>Пароль<div className="inputWithIcon passwordField"><LockKeyhole size={18}/><input name="password" type={show?'text':'password'} autoComplete="current-password" required placeholder="Ваш пароль"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{message&&<div className="formMessage">{message}</div>}<button className="primary wide" disabled={loading}>{loading?'Входимо…':<>Увійти <ArrowRight size={18}/></>}</button></form><div className="authFoot">Ще немає акаунта? <Link href="/sign-up">Створити</Link></div></div></section></main>
}
