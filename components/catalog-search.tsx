'use client';
import Link from 'next/link';
import {Search,X} from 'lucide-react';
import {FormEvent,useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import type {CatalogProduct} from '@/lib/catalog';
import {money} from '@/lib/store';

export default function CatalogSearch({mobile=false}:{mobile?:boolean}){
 const router=useRouter(),[q,setQ]=useState(''),[items,setItems]=useState<CatalogProduct[]>([]),[open,setOpen]=useState(false),[loading,setLoading]=useState(false);
 const root=useRef<HTMLDivElement|null>(null);

 useEffect(()=>{
  const value=q.trim();
  if(value.length<2){setItems([]);setOpen(false);return}
  const t=setTimeout(async()=>{
   setLoading(true);
   try{
    const r=await fetch('/api/catalog?q='+encodeURIComponent(value)+'&limit=6');
    const j=await r.json();
    setItems(j.items||[]);setOpen(true);
   }finally{setLoading(false)}
  },220);
  return()=>clearTimeout(t);
 },[q]);

 useEffect(()=>{
  const close=(e:MouseEvent)=>{if(root.current&&!root.current.contains(e.target as Node))setOpen(false)};
  document.addEventListener('mousedown',close);
  return()=>document.removeEventListener('mousedown',close);
 },[]);

 const submit=(e:FormEvent)=>{e.preventDefault();const value=q.trim();router.push(value?'/catalog?q='+encodeURIComponent(value):'/catalog');setOpen(false)};
 return <div className={mobile?'searchShell mobileSearchShell':'searchShell'} ref={root}>
  <form className={mobile?'mobileHeaderSearch':'headerSearch'} onSubmit={submit}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>q.trim().length>=2&&setOpen(true)} placeholder={mobile?'Знайти товар або код':'Пошук за назвою, брендом або кодом'}/>{q&&<button type="button" className="searchClear" onClick={()=>{setQ('');setItems([]);setOpen(false)}} aria-label="Очистити"><X size={15}/></button>}<button type="submit" className="searchSubmit">Знайти</button></form>
  {open&&<div className="searchSuggestions">
   <div className="searchSuggestHead">{loading?'Шукаємо…':items.length?'Товари':'Нічого не знайдено'}</div>
   {items.map(p=><Link key={p.externalId} href={'/product/'+encodeURIComponent(p.externalId)} onClick={()=>setOpen(false)}>
    <div className="suggestImage">{p.picture?<img src={p.picture} alt=""/>:<span>L</span>}</div>
    <div className="suggestText"><b>{p.name}</b><span>Код: {p.sku}</span></div>
    <strong>{money(p.price)}</strong>
   </Link>)}
   {items.length>0&&<button className="allResults" onClick={()=>{router.push('/catalog?q='+encodeURIComponent(q.trim()));setOpen(false)}}>Показати всі результати</button>}
  </div>}
 </div>
}
