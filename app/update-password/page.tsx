'use client';
import {FormEvent,useState} from 'react';
import {Eye,EyeOff,LockKeyhole} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

export default function UpdatePassword(){
 const [show,setShow]=useState(false),[message,setMessage]=useState(''),[loading,setLoading]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setMessage('');
  const supabase=createClient();if(!supabase)return setMessage('Сервіс авторизації тимчасово недоступний.');
  const fd=new FormData(e.currentTarget);setLoading(true);
  const {error}=await supabase.auth.updateUser({password:String(fd.get('password')||'')});
  setLoading(false);if(error)return setMessage('Не вдалося змінити пароль. Відкрий посилання з листа ще раз.');
  location.href='/account';
 }
 return <main className="authSimple"><section className="authCardSimple">
  <div className="authLogo">LAPKA</div><h1>Новий пароль</h1><p>Вигадай новий пароль для свого акаунта.</p>
  <form className="modernForm" onSubmit={submit}><label>Новий пароль<div className="inputWithIcon passwordField"><LockKeyhole size={17}/><input name="password" type={show?'text':'password'} minLength={8} autoComplete="new-password" required placeholder="Мінімум 8 символів"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{message&&<div className="formMessage">{message}</div>}<button className="primary wide" disabled={loading}>{loading?'Зберігаємо…':'Зберегти пароль'}</button></form>
 </section></main>
}
