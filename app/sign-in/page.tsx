'use client';
import Link from 'next/link';
import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Eye,EyeOff,LockKeyhole,Mail} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

export default function SignInPage(){
 const router=useRouter(),[show,setShow]=useState(false),[loading,setLoading]=useState(false),[message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setMessage('');
  const supabase=createClient();if(!supabase)return setMessage('Сервіс авторизації тимчасово недоступний.');
  const fd=new FormData(e.currentTarget);setLoading(true);
  const {error}=await supabase.auth.signInWithPassword({email:String(fd.get('email')||'').trim(),password:String(fd.get('password')||'')});
  setLoading(false);if(error)return setMessage('Не вдалося увійти. Перевір email і пароль.');
  router.replace('/account');router.refresh();
 }
 return <main className="authSimple"><section className="authCardSimple">
  <div className="authLogo">LAPKA</div><h1>Вхід</h1><p>Увійди, щоб бачити замовлення, обране та профілі улюбленців.</p>
  <form className="modernForm" onSubmit={submit}>
   <label>Email<div className="inputWithIcon"><Mail size={17}/><input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></div></label>
   <label>Пароль<div className="inputWithIcon passwordField"><LockKeyhole size={17}/><input name="password" type={show?'text':'password'} autoComplete="current-password" required/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
   {message&&<div className="formMessage">{message}</div>}
   <button className="primary wide" disabled={loading}>{loading?'Входимо…':'Увійти'}</button>
  </form>
  <div className="authFoot">Немає акаунта? <Link href="/sign-up">Зареєструватися</Link></div>
 </section></main>
}
