'use client';
import {useEffect,useRef,useState} from 'react';
import {Check,ChevronDown,Search,SlidersHorizontal,X} from 'lucide-react';
import type {CatalogFacets,CatalogProduct} from '@/lib/catalog';
import ProductGrid from '@/components/product-grid';

type Sort='popular'|'price-asc'|'price-desc'|'name';

export default function CatalogBrowser({initialItems,initialTotal,facets,initialQuery='',initialCategory=''}:{initialItems:CatalogProduct[];initialTotal:number;facets:CatalogFacets;initialQuery?:string;initialCategory?:string}){
 const [items,setItems]=useState(initialItems),[total,setTotal]=useState(initialTotal);
 const [q,setQ]=useState(initialQuery),[category,setCategory]=useState(initialCategory),[brand,setBrand]=useState(''),[color,setColor]=useState('');
 const [min,setMin]=useState(''),[max,setMax]=useState(''),[available,setAvailable]=useState(true),[sort,setSort]=useState<Sort>('popular');
 const [filtersOpen,setFiltersOpen]=useState(false),[loading,setLoading]=useState(false),[loadingMore,setLoadingMore]=useState(false);
 const first=useRef(true);

 const queryString=(offset=0)=>{
  const p=new URLSearchParams();
  if(q.trim())p.set('q',q.trim());if(category)p.set('category',category);if(brand)p.set('brand',brand);if(color)p.set('color',color);
  if(min)p.set('min',min);if(max)p.set('max',max);if(!available)p.set('available','false');if(sort!=='popular')p.set('sort',sort);
  p.set('limit','48');p.set('offset',String(offset));
  return p.toString();
 };

 async function load(reset=true){
  const controller=new AbortController();
  reset?setLoading(true):setLoadingMore(true);
  try{
   const res=await fetch('/api/catalog?'+queryString(reset?0:items.length),{signal:controller.signal});
   const j=await res.json();
   if(res.ok){setTotal(j.total||0);setItems(v=>reset?(j.items||[]):[...v,...(j.items||[])])}
  }finally{reset?setLoading(false):setLoadingMore(false)}
  return ()=>controller.abort();
 }

 useEffect(()=>{
  if(first.current){first.current=false;return}
  const t=setTimeout(()=>{load(true);const p=new URLSearchParams();if(q.trim())p.set('q',q.trim());if(category)p.set('category',category);if(brand)p.set('brand',brand);if(color)p.set('color',color);if(min)p.set('min',min);if(max)p.set('max',max);if(sort!=='popular')p.set('sort',sort);window.history.replaceState(null,'',p.size?'/catalog?'+p.toString():'/catalog')},280);
  return()=>clearTimeout(t);
 },[q,category,brand,color,min,max,available,sort]);

 const reset=()=>{setCategory('');setBrand('');setColor('');setMin('');setMax('');setAvailable(true);setSort('popular')};
 const activeCount=[category,brand,color,min,max,!available].filter(Boolean).length;

 const filters=<>
  <div className="filterGroup"><div className="filterGroupTitle">Категорія</div><div className="filterRadioList"><button className={!category?'active':''} onClick={()=>setCategory('')}><span>{!category&&<Check size={13}/>}</span>Усі товари</button>{facets.categories.map(x=><button key={x} className={category===x?'active':''} onClick={()=>setCategory(x)}><span>{category===x&&<Check size={13}/>}</span>{x}</button>)}</div></div>
  <div className="filterGroup"><div className="filterGroupTitle">Бренд</div><select className="filterSelect" value={brand} onChange={e=>setBrand(e.target.value)}><option value="">Усі бренди</option>{facets.brands.map(x=><option key={x} value={x}>{x}</option>)}</select></div>
  {facets.colors.length>0&&<div className="filterGroup"><div className="filterGroupTitle">Колір</div><select className="filterSelect" value={color} onChange={e=>setColor(e.target.value)}><option value="">Усі кольори</option>{facets.colors.map(x=><option key={x} value={x}>{x}</option>)}</select></div>}
  <div className="filterGroup"><div className="filterGroupTitle">Ціна</div><div className="priceInputs"><input inputMode="numeric" value={min} onChange={e=>setMin(e.target.value.replace(/\D/g,''))} placeholder={'Від '+Math.floor(facets.minPrice)}/><span>—</span><input inputMode="numeric" value={max} onChange={e=>setMax(e.target.value.replace(/\D/g,''))} placeholder={'До '+Math.ceil(facets.maxPrice)}/></div></div>
  <label className="stockToggle"><input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/><span><Check size={13}/></span>Лише в наявності</label>
 </>;

 return <div className="catalogLayout">
  <aside className="catalogSidebar"><div className="sidebarTop"><b>Фільтри</b>{activeCount>0&&<button onClick={reset}>Скинути</button>}</div>{filters}</aside>

  <section className="catalogMain">
   <div className="catalogSearchRow">
    <div className="catalogSearchBox"><Search size={19}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Назва, бренд, код товару або EAN"/>{q&&<button onClick={()=>setQ('')} aria-label="Очистити"><X size={17}/></button>}</div>
   </div>

   <div className="catalogToolbarNew">
    <div className="catalogCount"><b>{total}</b> товарів</div>
    <button className="mobileFilterButton" onClick={()=>setFiltersOpen(true)}><SlidersHorizontal size={18}/>Фільтри{activeCount>0&&<span>{activeCount}</span>}</button>
    <label className="catalogSort"><span>Сортувати:</span><select value={sort} onChange={e=>setSort(e.target.value as Sort)}><option value="popular">За актуальністю</option><option value="price-asc">Від дешевих</option><option value="price-desc">Від дорогих</option><option value="name">За назвою</option></select><ChevronDown size={15}/></label>
   </div>

   {activeCount>0&&<div className="activeFilters">{category&&<button onClick={()=>setCategory('')}>{category}<X size={13}/></button>}{brand&&<button onClick={()=>setBrand('')}>{brand}<X size={13}/></button>}{color&&<button onClick={()=>setColor('')}>{color}<X size={13}/></button>}{(min||max)&&<button onClick={()=>{setMin('');setMax('')}}>{min||'0'}–{max||'∞'} ₴<X size={13}/></button>}</div>}

   <div className={loading?'catalogResults isLoading':'catalogResults'}>{items.length?<ProductGrid items={items}/>:<div className="emptyState"><Search size={28}/><h2>Нічого не знайшли</h2><p>Спробуй іншу назву, код або зміни фільтри.</p><button className="button secondary" onClick={()=>{setQ('');reset()}}>Очистити пошук</button></div>}</div>
   {items.length<total&&<div className="loadMoreWrap"><button className="button secondary" disabled={loadingMore} onClick={()=>load(false)}>{loadingMore?'Завантажуємо…':'Показати ще'}</button></div>}
  </section>

  {filtersOpen&&<div className="filterBackdrop" onClick={()=>setFiltersOpen(false)}><div className="mobileFilterSheet" onClick={e=>e.stopPropagation()}><div className="mobileFilterHead"><div><b>Фільтри</b><span>{total} товарів</span></div><button onClick={()=>setFiltersOpen(false)}><X size={20}/></button></div><div className="mobileFilterBody">{filters}</div><div className="mobileFilterActions"><button className="button secondary" onClick={reset}>Скинути</button><button className="button primary" onClick={()=>setFiltersOpen(false)}>Показати {total}</button></div></div></div>}
 </div>
}