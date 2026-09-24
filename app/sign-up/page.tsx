'use client';
import Link from 'next/link';
import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Eye,EyeOff,LockKeyhole,Mail,UserRound} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

export default function SignUpPage(){
 const router=useRouter(),[show,setShow]=useState(false),[loading,setLoading]=useState(false),[message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setMessage('');
  const supabase=createClient();if(!supabase)return setMessage('Сервіс реєстрації тимчасово недоступний.');
  const fd=new FormData(e.currentTarget),name=String(fd.get('name')||'').trim(),email=String(fd.get('email')||'').trim(),password=String(fd.get('password')||'');
  setLoading(true);
  const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:location.origin+'/account'}});
  setLoading(false);if(error)return setMessage(error.message);
  if(data.session){router.replace('/account');router.refresh()}else setMessage('Перевір пошту та підтвердь email. Після цього можна увійти.');
 }
 return <main className="authSimple"><section className="authCardSimple">
  <div className="authLogo">LAPKA</div><h1>Створити акаунт</h1><p>Один акаунт для замовлень, обраного та профілів улюбленців.</p>
  <form className="modernForm" onSubmit={submit}>
   <label>Ім’я<div className="inputWithIcon"><UserRound size={17}/><input name="name" autoComplete="name" required placeholder="Як до вас звертатись"/></div></label>
   <label>Email<div className="inputWithIcon"><Mail size={17}/><input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></div></label>
   <label>Пароль<div className="inputWithIcon passwordField"><LockKeyhole size={17}/><input name="password" type={show?'text':'password'} minLength={6} autoComplete="new-password" required placeholder="Мінімум 6 символів"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
   {message&&<div className="formMessage">{message}</div>}
   <button className="primary wide" disabled={loading}>{loading?'Створюємо…':'Зареєструватися'}</button>
  </form>
  <div className="authFoot">Вже є акаунт? <Link href="/sign-in">Увійти</Link></div>
 </section></main>
}
