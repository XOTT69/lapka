'use client';
import Link from 'next/link';
import {FormEvent,useState} from 'react';
import {Mail} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

export default function ForgotPassword(){
 const [message,setMessage]=useState(''),[loading,setLoading]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setMessage('');
  const supabase=createClient();if(!supabase)return setMessage('Сервіс авторизації тимчасово недоступний.');
  const fd=new FormData(e.currentTarget);setLoading(true);
  const {error}=await supabase.auth.resetPasswordForEmail(String(fd.get('email')||'').trim(),{redirectTo:location.origin+'/auth/callback?next=/update-password'});
  setLoading(false);
  setMessage(error?'Не вдалося надіслати лист. Спробуй ще раз.':'Перевір пошту — ми надіслали посилання для зміни пароля.');
 }
 return <main className="authSimple"><section className="authCardSimple">
  <div className="authLogo">LAPKA</div><h1>Відновити пароль</h1><p>Вкажи email свого акаунта. На нього прийде посилання для встановлення нового пароля.</p>
  <form className="modernForm" onSubmit={submit}><label>Email<div className="inputWithIcon"><Mail size={17}/><input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></div></label>{message&&<div className="formMessage">{message}</div>}<button className="primary wide" disabled={loading}>{loading?'Надсилаємо…':'Надіслати посилання'}</button></form>
  <div className="authFoot"><Link href="/sign-in">Повернутися до входу</Link></div>
 </section></main>
}
