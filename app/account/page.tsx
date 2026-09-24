'use client';
import Link from 'next/link';
import {FormEvent,useEffect,useState} from 'react';
import {Heart,LogOut,Package,PawPrint,Plus,Save,Trash2,UserRound,X} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import type {User} from '@supabase/supabase-js';

type Pet={id?:string;name:string;type:'Собака'|'Кіт';age:string;weight:string;breed:string;notes:string};
const emptyPet:Pet={name:'',type:'Собака',age:'',weight:'',breed:'',notes:''};

export default function AccountPage(){
 const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[saved,setSaved]=useState('');
 const [pets,setPets]=useState<Pet[]>([]),[editing,setEditing]=useState<Pet|null>(null);

 async function loadPets(uid:string){
  const supabase=createClient(); if(!supabase)return;
  const {data}=await supabase.from('pets').select('id,name,type,age,weight,breed,notes,created_at').eq('user_id',uid).order('created_at',{ascending:true});
  setPets((data||[]) as Pet[]);
 }

 useEffect(()=>{const supabase=createClient();if(!supabase){setLoading(false);return}supabase.auth.getUser().then(async({data})=>{const u=data.user||null;setUser(u);if(u)await loadPets(u.id);setLoading(false)})},[]);

 async function savePet(e:FormEvent){e.preventDefault();if(!editing||!user)return;setSaved('');
  const supabase=createClient();if(!supabase)return;
  const payload={user_id:user.id,name:editing.name,type:editing.type,age:editing.age,weight:editing.weight,breed:editing.breed,notes:editing.notes};
  const {error}=editing.id?await supabase.from('pets').update(payload).eq('id',editing.id):await supabase.from('pets').insert(payload);
  if(error){setSaved('Не вдалося зберегти');return}
  await loadPets(user.id);setSaved('Збережено');setEditing(null);
 }

 async function removePet(id?:string){if(!id||!user)return;const supabase=createClient();if(!supabase)return;await supabase.from('pets').delete().eq('id',id);await loadPets(user.id);if(editing?.id===id)setEditing(null)}
 async function signOut(){const supabase=createClient();if(supabase)await supabase.auth.signOut();location.href='/'}

 if(loading)return <main className="wrap page"><div className="empty">Завантажуємо профіль…</div></main>;
 if(!user)return <main className="wrap page narrow"><div className="accountEmpty"><div className="accountIcon"><UserRound/></div><h1>Профіль LAPKA</h1><p>Увійди або створи акаунт, щоб зберігати замовлення й профілі улюбленців.</p><div className="heroBtns"><Link className="primary" href="/sign-in">Увійти</Link><Link className="secondary" href="/sign-up">Створити акаунт</Link></div></div></main>;

 const name=user.user_metadata?.full_name||'Привіт';
 return <main className="wrap page accountPage">
  <div className="accountTop"><div><span className="eyebrow">Мій акаунт</span><h1>{name}</h1><p>{user.email}</p></div><button className="secondary buttonLike" onClick={signOut}><LogOut size={17}/>Вийти</button></div>
  <div className="accountQuick"><Link href="/orders"><Package/><div><b>Замовлення</b><small>Історія покупок</small></div></Link><Link href="/catalog?favorites=1"><Heart/><div><b>Обране</b><small>Збережені товари</small></div></Link><a href="#pets"><PawPrint/><div><b>Улюбленці</b><small>{pets.length||'Додати профіль'}</small></div></a></div>

  <section id="pets" className="petsSection">
   <div className="petsHeader"><div><span className="sectionLabel">Мої улюбленці</span><h2>Окремий профіль для кожного.</h2><p>Собака, кіт чи кілька тварин — кожна зберігається окремо.</p></div><button className="primary" onClick={()=>setEditing({...emptyPet})}><Plus size={17}/>Додати тварину</button></div>

   {pets.length?<div className="petsGrid">{pets.map(p=><article className="petProfileCard" key={p.id}>
    <div className="petAvatar">{p.type==='Кіт'?'🐱':'🐶'}</div><div className="petProfileInfo"><span>{p.type}</span><h3>{p.name}</h3><p>{[p.age,p.weight,p.breed].filter(Boolean).join(' · ')||'Додай більше даних'}</p></div>
    <div className="petActions"><button onClick={()=>setEditing({...p})}>Редагувати</button><button aria-label="Видалити" onClick={()=>removePet(p.id)}><Trash2 size={16}/></button></div>
   </article>)}</div>:<div className="empty"><h3>Поки немає улюбленців</h3><p>Створи перший профіль — він не буде перезаписувати наступні.</p></div>}

   {editing&&<div className="petEditorOverlay"><div className="petEditor card"><div className="petEditorHead"><div><span className="sectionLabel">{editing.id?'Редагування':'Нова тварина'}</span><h3>{editing.id?editing.name:'Додати улюбленця'}</h3></div><button className="iconButton" onClick={()=>setEditing(null)}><X size={18}/></button></div>
    <form className="modernForm" onSubmit={savePet}><div className="segmented"><button type="button" className={editing.type==='Собака'?'sel':''} onClick={()=>setEditing({...editing,type:'Собака'})}>Собака</button><button type="button" className={editing.type==='Кіт'?'sel':''} onClick={()=>setEditing({...editing,type:'Кіт'})}>Кіт</button></div>
    <label>Ім’я<input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} required placeholder="Бейлі"/></label>
    <div className="two"><label>Вік<input value={editing.age} onChange={e=>setEditing({...editing,age:e.target.value})} placeholder="6 місяців"/></label><label>Вага<input value={editing.weight} onChange={e=>setEditing({...editing,weight:e.target.value})} placeholder="11 кг"/></label></div>
    <label>Порода або розмір<input value={editing.breed} onChange={e=>setEditing({...editing,breed:e.target.value})} placeholder="Метис, середня порода"/></label>
    <label>Особливості<textarea value={editing.notes} onChange={e=>setEditing({...editing,notes:e.target.value})} placeholder="Смаки, чутливість, важливі деталі"/></label>
    <div className="saveRow"><button className="primary" type="submit"><Save size={17}/>Зберегти</button>{saved&&<span className="savedText">{saved}</span>}</div></form>
   </div></div>}
  </section>
 </main>
}
