'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, PawPrint } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function SignUpPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setMessage('Реєстрація підготовлена. Завершуємо підключення бази акаунтів.');
      return;
    }

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone },
        emailRedirectTo: location.origin + '/auth/callback?next=/account',
      },
    });
    setLoading(false);

    if (error) return setMessage(error.message);
    if (data.session) {
      location.href = '/account';
      return;
    }
    setSuccess(true);
  }

  if (success) return <main className="authPage wrap authSingle">
    <section className="authCard authSuccess">
      <div className="successIcon">✓</div>
      <h2>Перевір пошту</h2>
      <p>Ми надіслали лист для підтвердження акаунта. Після переходу за посиланням ти автоматично повернешся в LAPKA.</p>
      <Link className="secondary wide" href="/sign-in">До входу</Link>
    </section>
  </main>;

  return <main className="authPage wrap">
    <section className="authIntro">
      <div className="authBadge"><PawPrint size={16}/> LAPKA CLUB</div>
      <h1>Акаунт, який<br/>економить час.</h1>
      <p>Збережемо контакти, замовлення та профіль улюбленця. Без зайвих анкет і десятків полів.</p>
      <div className="authBenefits">
        <span><Check/>Швидше оформлення наступних замовлень</span>
        <span><Check/>Профіль собаки або кота</span>
        <span><Check/>Обране та історія покупок</span>
      </div>
    </section>

    <section className="authCard">
      <div>
        <span className="eyebrow">Реєстрація</span>
        <h2>Створити акаунт</h2>
        <p>Потрібно менше хвилини.</p>
      </div>
      <form className="modernForm" onSubmit={submit}>
        <label>Ім’я<input name="name" autoComplete="name" required placeholder="Антон"/></label>
        <label>Телефон<input name="phone" type="tel" autoComplete="tel" placeholder="+380..."/></label>
        <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label>
        <label>Пароль
          <div className="passwordField">
            <input name="password" type={show?'text':'password'} minLength={8} autoComplete="new-password" required placeholder="Мінімум 8 символів"/>
            <button type="button" onClick={()=>setShow(v=>!v)} aria-label="Показати пароль">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button>
          </div>
        </label>
        {message&&<div className="formMessage">{message}</div>}
        <button className="primary wide" disabled={loading}>{loading?'Створюємо…':<>Створити акаунт <ArrowRight size={18}/></>}</button>
      </form>
      <div className="authFoot">Вже є акаунт? <Link href="/sign-in">Увійти</Link></div>
    </section>
  </main>
}
