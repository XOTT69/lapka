'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowRight, KeyRound } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function ForgotPassword(){
 const [message,setMessage]=useState('');
 const [loading,setLoading]=useState(false);

 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const supabase=getSupabaseBrowser();
  if(!supabase){setMessage('Відновлення пароля буде доступне після підключення бази акаунтів.');return}
  const fd=new FormData(e.currentTarget);
  setLoading(true);
  const {error}=await supabase.auth.resetPasswordForEmail(String(fd.get('email')||''),{
   redirectTo:location.origin+'/auth/callback?next=/update-password'
  });
  setLoading(false);
  setMessage(error?'Не вдалося надіслати лист. Спробуй ще раз.':'Готово. Перевір пошту — там є посилання для зміни пароля.');
 }

 return <main className="authPage wrap authSingle"><section className="authCard">
  <div className="accountIcon"><KeyRound/></div><h2>Відновити пароль</h2><p>Вкажи email, з яким реєструвався в LAPKA.</p>
  <form className="modernForm" onSubmit={submit}><label>Email<input name="email" type="email" required autoComplete="email"/></label>{message&&<div className="formMessage">{message}</div>}<button className="primary wide" disabled={loading}>{loading?'Надсилаємо…':<>Надіслати посилання <ArrowRight size={18}/></>}</button></form>
  <div className="authFoot"><Link href="/sign-in">Повернутися до входу</Link></div>
 </section></main>
}
