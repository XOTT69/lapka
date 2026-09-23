'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Heart, LogOut, Package, PawPrint, Save, UserRound } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

type Pet = { name:string; type:'Собака'|'Кіт'; age:string; weight:string; breed:string; notes:string };

export default function AccountPage(){
 const [user,setUser]=useState<User|null>(null);
 const [loading,setLoading]=useState(true);
 const [saved,setSaved]=useState('');
 const [pet,setPet]=useState<Pet>({name:'',type:'Собака',age:'',weight:'',breed:'',notes:''});

 useEffect(()=>{
  const supabase=getSupabaseBrowser();
  if(!supabase){setLoading(false);return}
  supabase.auth.getUser().then(({data})=>{
   setUser(data.user||null);
   const p=data.user?.user_metadata?.pet as Pet|undefined;
   if(p)setPet(p);
   setLoading(false);
  });
 },[]);

 async function savePet(e:FormEvent){
  e.preventDefault(); setSaved('');
  const supabase=getSupabaseBrowser();
  if(!supabase)return setSaved('Потрібно підключити Supabase.');
  const {error}=await supabase.auth.updateUser({data:{pet}});
  setSaved(error?error.message:'Збережено ✓');
 }

 async function signOut(){
  const supabase=getSupabaseBrowser();
  if(supabase)await supabase.auth.signOut();
  location.href='/';
 }

 if(loading)return <main className="wrap page"><div className="empty">Завантажуємо профіль…</div></main>;
 if(!user)return <main className="wrap page narrow"><div className="accountEmpty"><div className="accountIcon"><UserRound/></div><h1>Твій профіль LAPKA</h1><p>Увійди або створи акаунт, щоб зберігати улюбленців і замовлення.</p><div className="heroBtns"><Link className="primary" href="/sign-in">Увійти</Link><Link className="secondary" href="/sign-up">Створити акаунт</Link></div></div></main>;

 const name=user.user_metadata?.full_name||'Мій профіль';

 return <main className="wrap page accountPage">
  <div className="accountTop">
   <div><span className="eyebrow">LAPKA CLUB</span><h1>Привіт, {name}</h1><p>{user.email}</p></div>
   <button className="secondary buttonLike" onClick={signOut}><LogOut size={17}/>Вийти</button>
  </div>
  <div className="accountQuick">
   <Link href="/orders"><Package/><div><b>Мої замовлення</b><small>Історія та статуси</small></div></Link>
   <Link href="/catalog?favorites=1"><Heart/><div><b>Обране</b><small>Товари, які сподобались</small></div></Link>
   <a href="#pet"><PawPrint/><div><b>Мій улюбленець</b><small>Профіль для підбору</small></div></a>
  </div>
  <section id="pet" className="accountSection">
   <div className="accountSectionCopy"><span className="sectionLabel">Профіль улюбленця</span><h2>Щоб радити менше випадкового.</h2><p>Ці дані зберігаються в твоєму акаунті. Їх можна змінити будь-коли.</p></div>
   <form className="card modernForm petAccountForm" onSubmit={savePet}>
    <div className="segmented modernSegmented"><button type="button" className={pet.type==='Собака'?'sel':''} onClick={()=>setPet({...pet,type:'Собака'})}>Собака</button><button type="button" className={pet.type==='Кіт'?'sel':''} onClick={()=>setPet({...pet,type:'Кіт'})}>Кіт</button></div>
    <label>Ім’я<input value={pet.name} onChange={e=>setPet({...pet,name:e.target.value})} required placeholder="Бейлі"/></label>
    <div className="two"><label>Вік<input value={pet.age} onChange={e=>setPet({...pet,age:e.target.value})} placeholder="6 місяців"/></label><label>Вага<input value={pet.weight} onChange={e=>setPet({...pet,weight:e.target.value})} placeholder="11 кг"/></label></div>
    <label>Порода або розмір<input value={pet.breed} onChange={e=>setPet({...pet,breed:e.target.value})} placeholder="Метис, середня порода"/></label>
    <label>Особливості<textarea value={pet.notes} onChange={e=>setPet({...pet,notes:e.target.value})} placeholder="Улюблені смаки, чутливість, інші важливі деталі"/></label>
    <div className="saveRow"><button className="primary" type="submit"><Save size={17}/>Зберегти</button>{saved&&<span className="savedText">{saved}</span>}</div>
   </form>
  </section>
 </main>
}
