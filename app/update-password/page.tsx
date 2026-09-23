'use client';

import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function UpdatePassword(){
 const [show,setShow]=useState(false),[message,setMessage]=useState(''),[loading,setLoading]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();const supabase=getSupabaseBrowser();
  if(!supabase){setMessage('База акаунтів ще не підключена.');return}
  const fd=new FormData(e.currentTarget);setLoading(true);
  const {error}=await supabase.auth.updateUser({password:String(fd.get('password')||'')});
  setLoading(false);
  if(error)return setMessage('Не вдалося змінити пароль.');
  location.href='/account';
 }
 return <main className="authPage wrap authSingle"><section className="authCard"><span className="eyebrow">Безпека</span><h2>Новий пароль</h2><p>Вигадай новий пароль для акаунта.</p><form className="modernForm" onSubmit={submit}><label>Новий пароль<div className="passwordField"><input name="password" type={show?'text':'password'} minLength={8} required/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{message&&<div className="formMessage">{message}</div>}<button className="primary wide" disabled={loading}>{loading?'Зберігаємо…':'Зберегти пароль'}</button></form></section></main>
}
