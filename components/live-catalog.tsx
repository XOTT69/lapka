'use client';
import {FormEvent,useMemo,useState} from 'react';
import {Search,ShoppingBag,SlidersHorizontal,X} from 'lucide-react';
import {useStore,money} from '@/lib/store';
import type {ZooBazaProduct} from '@/lib/zoobaza';

const hash=(s:string)=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)||1};

export default function LiveCatalog({items,initialQuery=''}:{items:ZooBazaProduct[];initialQuery?:string}){
 const [q,setQ]=useState(initialQuery),[category,setCategory]=useState(''),[color,setColor]=useState(''),[min,setMin]=useState(''),[max,setMax]=useState(''),[onlyAvailable,setOnlyAvailable]=useState(true),[filtersOpen,setFiltersOpen]=useState(false);
 const {add}=useStore();

 const categories=useMemo(()=>[...new Set(items.map(i=>i.category).filter(Boolean) as string[])].sort(),[items]);
 const colors=useMemo(()=>[...new Set(items.map(i=>i.color).filter(Boolean) as string[])].sort().slice(0,40),[items]);

 const list=useMemo(()=>items.filter(p=>{
  const searchOk=!q.trim()||(`${p.name} ${p.vendor||''} ${p.vendorCode||''} ${p.category||''} ${p.color||''}`).toLowerCase().includes(q.trim().toLowerCase());
  const categoryOk=!category||p.category===category;
  const colorOk=!color||p.color===color;
  const minOk=!min||p.price>=Number(min);
  const maxOk=!max||p.price<=Number(max);
  const stockOk=!onlyAvailable||p.available;
  return searchOk&&categoryOk&&colorOk&&minOk&&maxOk&&stockOk;
 }),[items,q,category,color,min,max,onlyAvailable]);

 const clear=()=>{setCategory('');setColor('');setMin('');setMax('');setOnlyAvailable(true)};
 const active=Boolean(category||color||min||max||!onlyAvailable);
 const submit=(e:FormEvent)=>e.preventDefault();

 return <section>
  <div className="catalogToolbar">
   <form className="catalogSearch" onSubmit={submit}><Search size={19}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Пошук за назвою, брендом або артикулом"/>{q&&<button type="button" onClick={()=>setQ('')}><X size={16}/></button>}</form>
   <button className={"filterToggle "+(active?'active':'')} onClick={()=>setFiltersOpen(v=>!v)}><SlidersHorizontal size={18}/>Фільтри{active&&<b>•</b>}</button>
  </div>

  <div className={"filterPanel "+(filtersOpen?'open':'')}>
   <label>Категорія<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Усі категорії</option>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Колір<select value={color} onChange={e=>setColor(e.target.value)}><option value="">Усі кольори</option>{colors.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Ціна від<input inputMode="numeric" value={min} onChange={e=>setMin(e.target.value.replace(/\D/g,''))} placeholder="0"/></label>
   <label>Ціна до<input inputMode="numeric" value={max} onChange={e=>setMax(e.target.value.replace(/\D/g,''))} placeholder="5000"/></label>
   <label className="switchRow"><input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)}/><span>Лише в наявності</span></label>
   {active&&<button className="clearFilters" onClick={clear}>Скинути фільтри</button>}
  </div>

  <div className="catalogResultBar"><b>{list.length}</b><span>товарів</span></div>

  {list.length?<div className="grid">{list.map(p=>{
    const product={id:hash('catalog-'+p.externalId),slug:'catalog-'+p.externalId,name:p.name,brand:p.vendor||'LAPKA',category:p.category||'Каталог',pet:'Собаки' as const,price:p.price,oldPrice:p.oldPrice,emoji:'🐾',description:p.description||'Товар із актуального каталогу.',stock:p.available?1:0,features:[p.vendorCode?'Артикул '+p.vendorCode:'LAPKA',p.color?'Колір: '+p.color:'Актуальна наявність'].filter(Boolean)};
    return <article className="product liveProduct" key={p.externalId}>
      <div className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name} loading="lazy"/>:<div className="imageFallback">LAPKA</div>}{p.available&&<i>В наявності</i>}</div>
      <div className="meta"><small>{p.vendor||p.category||'LAPKA'} {p.color?'• '+p.color:''}</small><h3>{p.name}</h3><div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button aria-label="Додати у кошик" onClick={()=>add(product)}><ShoppingBag size={17}/></button></div></div>
    </article>
  })}</div>:<div className="empty"><h2>Нічого не знайшли</h2><p>Спробуй змінити фільтри або пошуковий запит.</p></div>}
 </section>
}
