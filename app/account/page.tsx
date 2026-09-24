'use client';
import Link from 'next/link';
import {FormEvent,useEffect,useState} from 'react';
import {Heart,LogOut,Package,PawPrint,Plus,Save,Trash2,UserRound,X} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import type {User} from '@supabase/supabase-js';

type Pet={id?:string;name:string;type:'Собака'|'Кіт';birth_date:string;weight:string;breed:string;notes:string};
const emptyPet=():Pet=>({name:'',type:'Собака',birth_date:'',weight:'',breed:'',notes:''});

function ageFromBirthDate(value:string){
 if(!value)return '';
 const birth=new Date(value+'T12:00:00');const now=new Date();if(Number.isNaN(birth.getTime())||birth>now)return '';
 let years=now.getFullYear()-birth.getFullYear();let months=now.getMonth()-birth.getMonth();if(now.getDate()<birth.getDate())months--;if(months<0){years--;months+=12}
 if(years<=0)return months<=0?'менше 1 міс.':months+' міс.';
 return years+' '+(years===1?'рік':years>=2&&years<=4?'роки':'років')+(months>0?' '+months+' міс.':'');
}

export default function AccountPage(){
 const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[saved,setSaved]=useState('');
 const [pets,setPets]=useState<Pet[]>([]),[editing,setEditing]=useState<Pet|null>(null),[savingPet,setSavingPet]=useState(false);

 async function loadPets(uid:string){
  const supabase=createClient();if(!supabase)return;
  const {data,error}=await supabase.from('pets').select('id,name,type,birth_date,weight,breed,notes,created_at').eq('user_id',uid).order('created_at',{ascending:true});
  if(!error)setPets((data||[]).map((p:any)=>({...p,birth_date:p.birth_date||''})) as Pet[]);
 }

 useEffect(()=>{const supabase=createClient();if(!supabase){setLoading(false);return}supabase.auth.getUser().then(async({data})=>{const u=data.user||null;setUser(u);if(u)await loadPets(u.id);setLoading(false)})},[]);

 async function savePet(e:FormEvent){e.preventDefault();if(!editing||!user||savingPet)return;setSaved('');setSavingPet(true);
  const supabase=createClient();if(!supabase){setSavingPet(false);return}
  const payload={user_id:user.id,name:editing.name.trim(),type:editing.type,birth_date:editing.birth_date||null,weight:editing.weight.trim(),breed:editing.breed.trim(),notes:editing.notes.trim()};
  let error=null;
  if(editing.id){
   const result=await supabase.from('pets').update(payload).eq('id',editing.id).eq('user_id',user.id).select('id').single();error=result.error;
  }else{
   const result=await supabase.from('pets').insert(payload).select('id').single();error=result.error;
  }
  if(error){setSaved('Не вдалося зберегти. Спробуй ще раз.');setSavingPet(false);return}
  await loadPets(user.id);setEditing(null);setSaved('');setSavingPet(false);
 }

 async function removePet(id?:string){if(!id||!user)return;const supabase=createClient();if(!supabase)return;const {error}=await supabase.from('pets').delete().eq('id',id).eq('user_id',user.id);if(!error)await loadPets(user.id)}
 async function signOut(){const supabase=createClient();if(supabase)await supabase.auth.signOut();location.href='/'}

 if(loading)return <main className="wrap page"><div className="empty">Завантажуємо профіль…</div></main>;
 if(!user)return <main className="wrap page narrow"><div className="accountEmpty"><div className="accountIcon"><UserRound/></div><h1>Профіль LAPKA</h1><p>Увійди або створи акаунт, щоб зберігати замовлення й профілі улюбленців.</p><div className="heroBtns"><Link className="primary" href="/sign-in">Увійти</Link><Link className="secondary" href="/sign-up">Створити акаунт</Link></div></div></main>;

 const name=user.user_metadata?.full_name||'Привіт';
 return <main className="wrap page accountPage"><div className="accountTop"><div><span className="eyebrow">Мій акаунт</span><h1>{name}</h1><p>{user.email}</p></div><button className="secondary buttonLike" onClick={signOut}><LogOut size={17}/>Вийти</button></div>
 <div className="accountQuick"><Link href="/orders"><Package/><div><b>Замовлення</b><small>Історія покупок</small></div></Link><Link href="/favorites"><Heart/><div><b>Обране</b><small>Збережені товари</small></div></Link><a href="#pets"><PawPrint/><div><b>Улюбленці</b><small>{pets.length?pets.length+' профілів':'Додати профіль'}</small></div></a></div>

 <section id="pets" className="petsSection"><div className="petsHeader"><div><span className="sectionLabel">Мої улюбленці</span><h2>Кожен — окремим профілем.</h2><p>Додавай стільки тварин, скільки потрібно. Новий профіль не змінює попередній.</p></div><button className="primary" onClick={()=>{setSaved('');setEditing(emptyPet())}}><Plus size={17}/>Додати тварину</button></div>
 {pets.length?<div className="petsGrid">{pets.map(p=><article className="petProfileCard" key={p.id}><div className="petAvatar">{p.type==='Кіт'?'🐱':'🐶'}</div><div className="petProfileInfo"><span>{p.type}</span><h3>{p.name}</h3><p>{[ageFromBirthDate(p.birth_date),p.weight,p.breed].filter(Boolean).join(' · ')||'Додай більше даних'}</p></div><div className="petActions"><button onClick={()=>{setSaved('');setEditing({...p})}}>Редагувати</button><button aria-label="Видалити" onClick={()=>removePet(p.id)}><Trash2 size={16}/></button></div></article>)}</div>:<div className="empty"><h3>Поки немає улюбленців</h3><p>Додай собаку, кота або кількох тварин — усі збережуться окремо.</p></div>}

 {editing&&<div className="petEditorOverlay"><div className="petEditor card"><div className="petEditorHead"><div><span className="sectionLabel">{editing.id?'Редагування':'Новий профіль'}</span><h3>{editing.id?editing.name:'Додати улюбленця'}</h3></div><button className="iconButton" onClick={()=>setEditing(null)}><X size={18}/></button></div><form className="modernForm" onSubmit={savePet}><div className="segmented"><button type="button" className={editing.type==='Собака'?'sel':''} onClick={()=>setEditing({...editing,type:'Собака'})}>🐶 Собака</button><button type="button" className={editing.type==='Кіт'?'sel':''} onClick={()=>setEditing({...editing,type:'Кіт'})}>🐱 Кіт</button></div><label>Ім’я<input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} required placeholder="Наприклад, Бейлі"/></label><div className="two"><label>Дата народження<input type="date" max={new Date().toISOString().slice(0,10)} value={editing.birth_date} onChange={e=>setEditing({...editing,birth_date:e.target.value})}/>{editing.birth_date&&<small className="fieldHint">Вік: {ageFromBirthDate(editing.birth_date)}</small>}</label><label>Вага<input value={editing.weight} onChange={e=>setEditing({...editing,weight:e.target.value})} placeholder="11 кг"/></label></div><label>Порода або розмір<input value={editing.breed} onChange={e=>setEditing({...editing,breed:e.target.value})} placeholder="Метис, середня порода"/></label><label>Особливості<textarea value={editing.notes} onChange={e=>setEditing({...editing,notes:e.target.value})} placeholder="Смаки, чутливість, алергії, важливі деталі"/></label>{saved&&<div className="formMessage">{saved}</div>}<button disabled={savingPet} className="primary wide" type="submit"><Save size={17}/>{savingPet?'Зберігаємо…':'Зберегти профіль'}</button></form></div></div>}
 </section></main>
}
