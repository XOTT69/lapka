'use client';
import {FormEvent,useMemo,useState} from 'react';
import {ChevronDown,Search,ShoppingBag,SlidersHorizontal,X} from 'lucide-react';
import {useStore,money} from '@/lib/store';
import type {ZooBazaProduct} from '@/lib/zoobaza';

const hash=(s:string)=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)||1};
const clean=(v?:string)=>v?.trim()||'';
const genericColor=(p:ZooBazaProduct)=>{
 const explicit=clean(p.color); if(explicit)return explicit;
 const n=p.name.toLowerCase();
 const colors=[['Чорний',/чорн|black/],['Білий',/біл|white/],['Сірий',/сір|gray|grey/],['Синій',/син|blue/],['Зелений',/зелен|green/],['Червоний',/черв|red/],['Рожевий',/рожев|pink/],['Бежевий',/беж|beige/],['Коричневий',/корич|brown/]];
 return colors.find(([,r])=>(r as RegExp).test(n))?.[0] as string||'';
};

export default function LiveCatalog({items,initialQuery=''}:{items:ZooBazaProduct[];initialQuery?:string}){
 const [q,setQ]=useState(initialQuery),[category,setCategory]=useState(''),[color,setColor]=useState(''),[min,setMin]=useState(''),[max,setMax]=useState(''),[onlyAvailable,setOnlyAvailable]=useState(true),[filtersOpen,setFiltersOpen]=useState(false);
 const {add}=useStore();
 const categories=useMemo(()=>Array.from(new Set(items.map(p=>clean(p.category)).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'uk')).slice(0,80),[items]);
 const colors=useMemo(()=>Array.from(new Set(items.map(genericColor).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'uk')),[items]);
 const list=useMemo(()=>items.filter(p=>{
   const text=(p.name+' '+(p.vendor||'')+' '+(p.vendorCode||'')+' '+(p.category||'')+' '+genericColor(p)).toLowerCase();
   const queryOk=!q.trim()||text.includes(q.trim().toLowerCase());
   const categoryOk=!category||p.category===category;
   const colorOk=!color||genericColor(p)===color;
   const minOk=!min||p.price>=Number(min);
   const maxOk=!max||p.price<=Number(max);
   return queryOk&&categoryOk&&colorOk&&minOk&&maxOk&&(!onlyAvailable||p.available);
 }),[items,q,category,color,min,max,onlyAvailable]);
 const clear=()=>{setCategory('');setColor('');setMin('');setMax('');setOnlyAvailable(true)};
 const submit=(e:FormEvent)=>e.preventDefault();
 return <section>
  <form className="catalogSearch" onSubmit={submit}><Search size={19}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Пошук за назвою, брендом або артикулом"/>{q&&<button type="button" onClick={()=>setQ('')}><X size={16}/> <span>Очистити</span></button>}</form>
  <button className="mobileFilterButton" type="button" onClick={()=>setFiltersOpen(v=>!v)}><SlidersHorizontal size={18}/> Фільтри <ChevronDown size={16}/></button>
  <div className="catalogWithFilters">
   <aside className={'catalogFilters '+(filtersOpen?'open':'')}>
    <div className="filterTitle"><b>Фільтри</b><button type="button" onClick={clear}>Скинути</button></div>
    <label>Категорія<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Усі категорії</option>{categories.map(c=><option value={c} key={c}>{c}</option>)}</select></label>
    <label>Колір<select value={color} onChange={e=>setColor(e.target.value)}><option value="">Усі кольори</option>{colors.map(c=><option value={c} key={c}>{c}</option>)}</select></label>
    <div className="priceFilter"><span>Ціна, ₴</span><div><input inputMode="numeric" value={min} onChange={e=>setMin(e.target.value.replace(/[^0-9]/g,''))} placeholder="від"/><input inputMode="numeric" value={max} onChange={e=>setMax(e.target.value.replace(/[^0-9]/g,''))} placeholder="до"/></div></div>
    <label className="switchRow"><input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)}/><span>Тільки в наявності</span></label>
   </aside>
   <div className="catalogMain"><div className="catalogResultBar"><b>{list.length}</b><span>товарів</span>{category&&<i>{category}</i>}{color&&<i>{color}</i>}</div>
   {list.length?<div className="grid">{list.map(p=>{
    const product={id:hash('catalog-'+p.externalId),slug:'catalog-'+p.externalId,name:p.name,brand:p.vendor||'LAPKA',category:p.category||'Каталог',pet:'Собаки' as const,price:p.price,oldPrice:p.oldPrice,emoji:'🐾',description:p.description||'Актуальний товар із каталогу LAPKA.',stock:p.available?1:0,features:[p.vendorCode?'Артикул '+p.vendorCode:'LAPKA',p.category||'Каталог']};
    return <article className="product liveProduct" key={p.externalId}>
      <div className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name} loading="lazy"/>:<div className="imageFallback">LAPKA</div>}{p.available&&<i>В наявності</i>}</div>
      <div className="meta"><small>{p.vendor||p.category||'LAPKA'} {p.vendorCode?'• '+p.vendorCode:''}</small><h3>{p.name}</h3>{p.color&&<div className="productAttribute">{p.color}</div>}<div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button aria-label="Додати у кошик" onClick={()=>add(product)}><ShoppingBag size={17}/></button></div></div>
    </article>
   })}</div>:<div className="empty"><h2>Нічого не знайшли</h2><p>Зміни фільтри або пошуковий запит.</p><button className="secondary" onClick={clear}>Скинути фільтри</button></div>}</div>
  </div>
 </section>
}
