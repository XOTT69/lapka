'use client';
import {FormEvent,useMemo,useState} from 'react';
import {Search,ShoppingBag} from 'lucide-react';
import {useStore,money} from '@/lib/store';
import type {ZooBazaProduct} from '@/lib/zoobaza';

const hash=(s:string)=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)||1};

export default function LiveCatalog({items,initialQuery=''}:{items:ZooBazaProduct[];initialQuery?:string}){
 const [q,setQ]=useState(initialQuery);
 const {add}=useStore();
 const list=useMemo(()=>items.filter(p=>!q.trim()||(`${p.name} ${p.vendor||''} ${p.vendorCode||''}`).toLowerCase().includes(q.trim().toLowerCase())),[items,q]);
 const submit=(e:FormEvent)=>e.preventDefault();
 return <section>
  <form className="catalogSearch" onSubmit={submit}><Search size={19}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Пошук за назвою, брендом або артикулом"/>{q&&<button type="button" onClick={()=>setQ('')}>Очистити</button>}</form>
  <div className="catalogResultBar"><b>{list.length}</b><span>товарів</span></div>
  {list.length?<div className="grid">{list.map(p=>{
    const product={id:hash('zoobaza-'+p.externalId),slug:'zoobaza-'+p.externalId,name:p.name,brand:p.vendor||'ZooBaza',category:'ZooBaza',pet:'Собаки' as const,price:p.price,oldPrice:p.oldPrice,emoji:'🐾',description:p.description||'Товар із живого каталогу ZooBaza.',stock:p.available?1:0,features:[p.vendorCode?'Артикул '+p.vendorCode:'ZooBaza','Актуальний фід постачальника']};
    return <article className="product liveProduct" key={p.externalId}>
      <div className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name} loading="lazy"/>:<div className="imageFallback">LAPKA</div>}{p.available&&<i>В наявності</i>}</div>
      <div className="meta"><small>{p.vendor||'ZooBaza'} {p.vendorCode?'• '+p.vendorCode:''}</small><h3>{p.name}</h3><div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button aria-label="Додати у кошик" onClick={()=>add(product)}><ShoppingBag size={17}/></button></div></div>
    </article>
  })}</div>:<div className="empty"><h2>Нічого не знайшли</h2><p>Спробуй іншу назву або артикул.</p></div>}
 </section>
}