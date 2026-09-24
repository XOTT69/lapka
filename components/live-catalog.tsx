'use client';
import {FormEvent,useMemo,useState} from 'react';
import {Check,ChevronDown,Search,ShoppingBag,SlidersHorizontal,X} from 'lucide-react';
import {useStore,money} from '@/lib/store';
import type {ZooBazaProduct} from '@/lib/zoobaza';

const hash=(s:string)=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)||1};

type Sort='popular'|'price-asc'|'price-desc'|'name';

export default function LiveCatalog({items,initialQuery=''}:{items:ZooBazaProduct[];initialQuery?:string}){
 const [q,setQ]=useState(initialQuery),[category,setCategory]=useState(''),[brand,setBrand]=useState(''),[color,setColor]=useState(''),[min,setMin]=useState(''),[max,setMax]=useState(''),[onlyAvailable,setOnlyAvailable]=useState(true),[filtersOpen,setFiltersOpen]=useState(false),[sort,setSort]=useState<Sort>('popular');
 const {add}=useStore();

 const categories=useMemo(()=>[...new Set(items.map(i=>i.category).filter(Boolean) as string[])].sort(),[items]);
 const brands=useMemo(()=>[...new Set(items.map(i=>i.vendor).filter(Boolean) as string[])].sort(),[items]);
 const colors=useMemo(()=>[...new Set(items.map(i=>i.color).filter(Boolean) as string[])].sort(),[items]);

 const list=useMemo(()=>{
  const filtered=items.filter(p=>{
   const hay=(p.name+' '+(p.vendor||'')+' '+(p.vendorCode||'')+' '+(p.category||'')+' '+(p.color||'')).toLowerCase();
   return (!q.trim()||hay.includes(q.trim().toLowerCase()))
    &&(!category||p.category===category)
    &&(!brand||p.vendor===brand)
    &&(!color||p.color===color)
    &&(!min||p.price>=Number(min))
    &&(!max||p.price<=Number(max))
    &&(!onlyAvailable||p.available);
  });
  return [...filtered].sort((a,b)=>{
   if(sort==='price-asc')return a.price-b.price;
   if(sort==='price-desc')return b.price-a.price;
   if(sort==='name')return a.name.localeCompare(b.name,'uk');
   return Number(b.available)-Number(a.available);
  });
 },[items,q,category,brand,color,min,max,onlyAvailable,sort]);

 const clear=()=>{setBrand('');setColor('');setMin('');setMax('');setOnlyAvailable(true)};
 const filterCount=[brand,color,min,max,!onlyAvailable].filter(Boolean).length;
 const submit=(e:FormEvent)=>e.preventDefault();

 return <section className="storeCatalog">
  <form className="storeSearch" onSubmit={submit}>
   <Search size={20}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Знайти товар або бренд"/>
   {q&&<button type="button" aria-label="Очистити пошук" onClick={()=>setQ('')}><X size={18}/></button>}
  </form>

  <div className="categoryChips" role="list">
   <button className={!category?'selected':''} onClick={()=>setCategory('')}>Усі</button>
   {categories.map(x=><button key={x} className={category===x?'selected':''} onClick={()=>setCategory(x)}>{x}</button>)}
  </div>

  <div className="catalogControlRow">
   <button className={"shopFilterBtn "+(filterCount?'active':'')} onClick={()=>setFiltersOpen(true)}>
    <SlidersHorizontal size={18}/>Фільтри{filterCount>0&&<span>{filterCount}</span>}
   </button>
   <label className="sortControl"><span>Сортування</span><select value={sort} onChange={e=>setSort(e.target.value as Sort)}><option value="popular">Спочатку актуальні</option><option value="price-asc">Від дешевих</option><option value="price-desc">Від дорогих</option><option value="name">За назвою</option></select><ChevronDown size={16}/></label>
  </div>

  <div className="catalogSummary"><span><b>{list.length}</b> товарів</span>{category&&<span className="activeChip">{category}<button onClick={()=>setCategory('')}><X size={13}/></button></span>}{brand&&<span className="activeChip">{brand}<button onClick={()=>setBrand('')}><X size={13}/></button></span>}</div>

  {list.length?<div className="grid">{list.map(p=>{
   const product={id:hash('catalog-'+p.externalId),slug:'catalog-'+p.externalId,name:p.name,brand:p.vendor||'LAPKA',category:p.category||'Каталог',pet:'Собаки' as const,price:p.price,oldPrice:p.oldPrice,emoji:'🐾',description:p.description||'Товар із актуального каталогу.',stock:p.available?1:0,features:[p.vendorCode?'Артикул '+p.vendorCode:'LAPKA',p.color?'Колір: '+p.color:'Актуальна наявність'].filter(Boolean)};
   return <article className="product liveProduct" key={p.externalId}>
    <div className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name} loading="lazy"/>:<div className="imageFallback">LAPKA</div>}</div>
    <div className="meta">
     <small>{p.vendor||p.category||'LAPKA'}{p.color?' · '+p.color:''}</small>
     <h3>{p.name}</h3>
     <div className="productAvailability">{p.available?<><i></i>В наявності</>:<>Під замовлення</>}</div>
     <div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button aria-label="Додати у кошик" onClick={()=>add(product)}><ShoppingBag size={17}/></button></div>
    </div>
   </article>
  })}</div>:<div className="empty"><h2>Нічого не знайшли</h2><p>Зміни категорію, фільтри або пошуковий запит.</p></div>}

  {filtersOpen&&<div className="filterSheetBackdrop" onClick={()=>setFiltersOpen(false)}>
   <section className="filterSheet" onClick={e=>e.stopPropagation()}>
    <div className="filterSheetHead"><div><small>Каталог</small><h2>Фільтри</h2></div><button onClick={()=>setFiltersOpen(false)}><X size={20}/></button></div>

    <div className="filterBlock"><label>Бренд</label><div className="choiceList"><button className={!brand?'selected':''} onClick={()=>setBrand('')}>{!brand&&<Check size={16}/>}Усі бренди</button>{brands.map(x=><button key={x} className={brand===x?'selected':''} onClick={()=>setBrand(x)}>{brand===x&&<Check size={16}/>}<span>{x}</span></button>)}</div></div>

    {colors.length>0&&<div className="filterBlock"><label>Колір</label><select value={color} onChange={e=>setColor(e.target.value)}><option value="">Усі кольори</option>{colors.map(x=><option key={x}>{x}</option>)}</select></div>}

    <div className="filterBlock"><label>Ціна, ₴</label><div className="priceRange"><input inputMode="numeric" value={min} onChange={e=>setMin(e.target.value.replace(/\D/g,''))} placeholder="Від"/><span>—</span><input inputMode="numeric" value={max} onChange={e=>setMax(e.target.value.replace(/\D/g,''))} placeholder="До"/></div></div>

    <button className={"availabilityToggle "+(onlyAvailable?'selected':'')} onClick={()=>setOnlyAvailable(v=>!v)}><span className="checkBox">{onlyAvailable&&<Check size={15}/>}</span>Лише товари в наявності</button>

    <div className="filterSheetActions"><button className="secondary" onClick={clear}>Скинути</button><button className="primary" onClick={()=>setFiltersOpen(false)}>Показати {list.length}</button></div>
   </section>
  </div>}
 </section>
}