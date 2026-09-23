'use client';
import Link from 'next/link';
import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {ArrowRight,Check,Eye,EyeOff,LockKeyhole,Mail,UserRound} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

export default function SignUpPage(){
 const router=useRouter(); const [show,setShow]=useState(false); const [loading,setLoading]=useState(false); const [message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setMessage('');
  const supabase=createClient(); if(!supabase)return setMessage('Реєстрація вже готова в коді. Залишилось створити Supabase-проєкт.');
  const fd=new FormData(e.currentTarget),name=String(fd.get('name')||'').trim(),email=String(fd.get('email')||'').trim(),password=String(fd.get('password')||'');
  setLoading(true);
  const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:location.origin+'/account'}});
  setLoading(false); if(error)return setMessage(error.message);
  if(data.session){router.replace('/account');router.refresh()} else setMessage('Готово. Перевір пошту та підтвердь email — після цього можна увійти.');
 }
 return <main className="authShell"><section className="authVisual authVisualGreen"><span className="authPill">LAPKA CLUB</span><h1>Менше рутини.<br/>Більше турботи.</h1><p>Один акаунт для покупок, доставки та профілю твого улюбленця.</p><div className="authChecklist"><span><Check/>Швидше оформлення</span><span><Check/>Історія замовлень</span><span><Check/>Підбір під тварину</span></div></section><section className="authPanel"><div className="authCard"><div className="authHead"><h2>Створити акаунт</h2><p>Займе менше хвилини.</p></div><form className="modernForm" onSubmit={submit}><label>Ім’я<div className="inputWithIcon"><UserRound size={18}/><input name="name" autoComplete="name" required placeholder="Як до вас звертатись"/></div></label><label>Email<div className="inputWithIcon"><Mail size={18}/><input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></div></label><label>Пароль<div className="inputWithIcon passwordField"><LockKeyhole size={18}/><input name="password" type={show?'text':'password'} minLength={6} autoComplete="new-password" required placeholder="Мінімум 6 символів"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{message&&<div className="formMessage">{message}</div>}<button className="primary wide" disabled={loading}>{loading?'Створюємо…':<>Зареєструватися <ArrowRight size={18}/></>}</button></form><div className="authFoot">Вже є акаунт? <Link href="/sign-in">Увійти</Link></div></div></section></main>
}
