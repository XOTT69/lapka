'use client';
import Link from 'next/link';
import {FormEvent,useEffect,useMemo,useState} from 'react';
import {CheckCircle2,Heart,LogOut,Package,PawPrint,Plus,Save,Star,Trash2,UserRound,X} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import type {User} from '@supabase/supabase-js';

type Pet={id?:string;name:string;type:'Собака'|'Кіт';age:string;weight:string;breed:string;notes:string;is_primary:boolean};
const emptyPet:Pet={name:'',type:'Собака',age:'',weight:'',breed:'',notes:'',is_primary:false};

export default function AccountPage(){
 const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[saved,setSaved]=useState('');
 const [pets,setPets]=useState<Pet[]>([]),[editing,setEditing]=useState<Pet|null>(null);
 const active=useMemo(()=>pets.find(p=>p.is_primary)||pets[0]||null,[pets]);

 async function reloadPets(uid:string){
  const supabase=createClient(); if(!supabase)return;
  const {data}=await supabase.from('pets').select('id,name,type,age,weight,breed,notes,is_primary').eq('user_id',uid).order('is_primary',{ascending:false}).order('created_at',{ascending:true});
  setPets((data||[]) as Pet[]);
 }
 useEffect(()=>{const supabase=createClient();if(!supabase){setLoading(false);return}supabase.auth.getUser().then(async({data})=>{const u=data.user||null;setUser(u);if(u)await reloadPets(u.id);setLoading(false)})},[]);

 async function savePet(e:FormEvent){e.preventDefault();setSaved('');const supabase=createClient();if(!supabase||!user||!editing)return;
  const payload={user_id:user.id,name:editing.name.trim(),type:editing.type,age:editing.age.trim(),weight:editing.weight.trim(),breed:editing.breed.trim(),notes:editing.notes.trim(),is_primary:editing.is_primary};
  if(payload.is_primary)await supabase.from('pets').update({is_primary:false}).eq('user_id',user.id);
  const q=editing.id?supabase.from('pets').update(payload).eq('id',editing.id):supabase.from('pets').insert(payload);
  const {error}=await q; if(error){setSaved('Не вдалося зберегти');return}
  await reloadPets(user.id); setEditing(null); setSaved('Збережено');
 }
 async function removePet(id:string){const supabase=createClient();if(!supabase||!user)return;if(!confirm('Видалити цього улюбленця?'))return;await supabase.from('pets').delete().eq('id',id);await reloadPets(user.id);if(editing?.id===id)setEditing(null)}
 async function makePrimary(id:string){const supabase=createClient();if(!supabase||!user)return;await supabase.from('pets').update({is_primary:false}).eq('user_id',user.id);await supabase.from('pets').update({is_primary:true}).eq('id',id);await reloadPets(user.id)}
 async function signOut(){const supabase=createClient();if(supabase)await supabase.auth.signOut();location.href='/'}

 if(loading)return <main className="wrap page"><div className="empty">Завантажуємо профіль…</div></main>;
 if(!user)return <main className="wrap page narrow"><div className="accountEmpty"><div className="accountIcon"><UserRound/></div><h1>Профіль LAPKA</h1><p>Увійди або створи акаунт, щоб зберігати замовлення й усіх своїх улюбленців.</p><div className="heroBtns"><Link className="primary" href="/sign-in">Увійти</Link><Link className="secondary" href="/sign-up">Створити акаунт</Link></div></div></main>;

 const name=user.user_metadata?.full_name||'Привіт';
 return <main className="wrap page accountPage">
  <div className="accountTop"><div><span className="eyebrow">Мій акаунт</span><h1>{name}</h1><p>{user.email}</p></div><button className="secondary buttonLike" onClick={signOut}><LogOut size={17}/>Вийти</button></div>
  <div className="accountQuick"><Link href="/orders"><Package/><div><b>Замовлення</b><small>Історія покупок</small></div></Link><Link href="/catalog?favorites=1"><Heart/><div><b>Обране</b><small>Збережені товари</small></div></Link><a href="#pets"><PawPrint/><div><b>Улюбленці</b><small>{pets.length?pets.length+' у профілі':'Додати першого'}</small></div></a></div>

  <section id="pets" className="petsSection">
   <div className="petsSectionHead"><div><span className="sectionLabel">Мої улюбленці</span><h2>Кожному — свій профіль.</h2><p>Додавай стільки тварин, скільки потрібно. Основний профіль використаємо для персональних рекомендацій.</p></div><button className="primary" onClick={()=>setEditing({...emptyPet,is_primary:pets.length===0})}><Plus size={17}/>Додати улюбленця</button></div>
   {saved&&<div className="savedBanner"><CheckCircle2 size={17}/>{saved}</div>}
   {pets.length?<div className="petGrid">{pets.map(p=><article className={'petProfileCard '+(p.is_primary?'primaryPet':'')} key={p.id}>
    <div className="petCardTop"><div className="petAvatar">{p.type==='Кіт'?'🐱':'🐶'}</div>{p.is_primary&&<span className="primaryBadge"><Star size={13} fill="currentColor"/>Основний</span>}</div>
    <h3>{p.name}</h3><p>{[p.type,p.age,p.weight,p.breed].filter(Boolean).join(' · ')}</p>{p.notes&&<small>{p.notes}</small>}
    <div className="petCardActions"><button className="secondary" onClick={()=>setEditing({...p})}>Редагувати</button>{!p.is_primary&&<button className="ghostButton" onClick={()=>makePrimary(String(p.id))}><Star size={15}/>Зробити основним</button>}<button className="iconDanger" onClick={()=>removePet(String(p.id))} aria-label="Видалити"><Trash2 size={16}/></button></div>
   </article>)}</div>:<div className="empty petEmpty"><div className="accountIcon"><PawPrint/></div><h3>Поки нікого не додано</h3><p>Створи профіль собаки, котика або кількох улюбленців одразу.</p><button className="primary" onClick={()=>setEditing({...emptyPet,is_primary:true})}><Plus size={17}/>Додати улюбленця</button></div>}
  </section>

  {editing&&<div className="modalBackdrop" onMouseDown={e=>{if(e.currentTarget===e.target)setEditing(null)}}><div className="petModal"><div className="modalHead"><div><span className="sectionLabel">{editing.id?'Редагування':'Новий улюбленець'}</span><h2>{editing.id?editing.name||'Улюбленець':'Додати улюбленця'}</h2></div><button className="modalClose" onClick={()=>setEditing(null)}><X/></button></div><form className="modernForm" onSubmit={savePet}>
   <div className="segmented modernSegmented"><button type="button" className={editing.type==='Собака'?'sel':''} onClick={()=>setEditing({...editing,type:'Собака'})}>🐶 Собака</button><button type="button" className={editing.type==='Кіт'?'sel':''} onClick={()=>setEditing({...editing,type:'Кіт'})}>🐱 Кіт</button></div>
   <label>Ім’я<input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} required placeholder="Наприклад, Бейлі"/></label>
   <div className="two"><label>Вік<input value={editing.age} onChange={e=>setEditing({...editing,age:e.target.value})} placeholder="6 місяців"/></label><label>Вага<input value={editing.weight} onChange={e=>setEditing({...editing,weight:e.target.value})} placeholder="11 кг"/></label></div>
   <label>Порода або розмір<input value={editing.breed} onChange={e=>setEditing({...editing,breed:e.target.value})} placeholder="Метис, середня порода"/></label>
   <label>Особливості<textarea value={editing.notes} onChange={e=>setEditing({...editing,notes:e.target.value})} placeholder="Алергії, чутливість, улюблені смаки…"/></label>
   <label className="switchRow primarySwitch"><input type="checkbox" checked={editing.is_primary} onChange={e=>setEditing({...editing,is_primary:e.target.checked})}/><span><b>Основний улюбленець</b><small>Використовувати для персональних рекомендацій</small></span></label>
   <div className="modalActions"><button type="button" className="secondary" onClick={()=>setEditing(null)}>Скасувати</button><button className="primary" type="submit"><Save size={17}/>Зберегти</button></div>
  </form></div></div>}
 </main>
}
