'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff, PawPrint } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function SignInPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setMessage('Вхід підготовлений. Завершуємо підключення бази акаунтів.');
      return;
    }
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get('email') || ''),
      password: String(fd.get('password') || ''),
    });
    setLoading(false);
    if (error) return setMessage('Не вдалося увійти. Перевір email і пароль.');
    location.href = '/account';
  }

  return <main className="authPage wrap authSingle">
    <section className="authCard">
      <div className="authLogo"><span className="logo"><PawPrint size={18}/></span>LAPKA</div>
      <div><span className="eyebrow">Вхід</span><h2>З поверненням</h2><p>Увійди, щоб продовжити з профілем і замовленнями.</p></div>
      <form className="modernForm" onSubmit={submit}>
        <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label>
        <label>Пароль
          <div className="passwordField">
            <input name="password" type={show?'text':'password'} autoComplete="current-password" required/>
            <button type="button" onClick={()=>setShow(v=>!v)} aria-label="Показати пароль">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button>
          </div>
        </label>
        <div className="formAside"><Link href="/forgot-password">Забули пароль?</Link></div>
        {message&&<div className="formMessage">{message}</div>}
        <button className="primary wide" disabled={loading}>{loading?'Входимо…':<>Увійти <ArrowRight size={18}/></>}</button>
      </form>
      <div className="authFoot">Ще немає акаунта? <Link href="/sign-up">Зареєструватися</Link></div>
    </section>
  </main>
}
