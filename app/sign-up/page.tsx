'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Eye, EyeOff, PawPrint } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function SignUpPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setMessage('Реєстрація вже підготовлена. Потрібно підключити Supabase до проєкту.');
      return;
    }
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: location.origin + '/account',
      },
    });
    setLoading(false);
    if (error) return setMessage(error.message);
    if (data.session) router.push('/account');
    else setMessage('Перевір пошту — ми надіслали посилання для підтвердження реєстрації.');
  }

  return <main className="authPage wrap">
    <section className="authIntro">
      <div className="authBadge"><PawPrint size={16}/> LAPKA CLUB</div>
      <h1>Створи акаунт.<br/>Решту запам’ятаємо ми.</h1>
      <p>Замовлення, обране й профіль улюбленця — в одному місці. Без зайвих полів і довгих анкет.</p>
      <div className="authBenefits">
        <span><Check/>Швидше оформлення замовлень</span>
        <span><Check/>Персональний профіль тварини</span>
        <span><Check/>Історія покупок і повтор замовлення</span>
      </div>
    </section>
    <section className="authCard">
      <div>
        <span className="eyebrow">Реєстрація</span>
        <h2>Приєднатися до LAPKA</h2>
        <p>Займе менше хвилини.</p>
      </div>
      <form className="modernForm" onSubmit={submit}>
        <label>Ім’я<input name="name" autoComplete="name" required placeholder="Антон"/></label>
        <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label>
        <label>Пароль<div className="passwordField"><input name="password" type={show?'text':'password'} minLength={6} autoComplete="new-password" required placeholder="Мінімум 6 символів"/><button type="button" onClick={()=>setShow(v=>!v)} aria-label="Показати пароль">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        {message&&<div className="formMessage">{message}</div>}
        <button className="primary wide" disabled={loading}>{loading?'Створюємо акаунт…':<>Створити акаунт <ArrowRight size={18}/></>}</button>
      </form>
      <div className="authFoot">Вже є акаунт? <Link href="/sign-in">Увійти</Link></div>
    </section>
  </main>
}
