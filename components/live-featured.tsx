'use client';
import Link from 'next/link';
import {ShoppingBag} from 'lucide-react';
import type {ZooBazaProduct} from '@/lib/zoobaza';
import {money,useStore} from '@/lib/store';

const hash=(s:string)=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)||1};

export default function LiveFeatured({items}:{items:ZooBazaProduct[]}){
 const {add}=useStore();
 return <div className="grid">{items.map(p=>{
  const product={id:hash('zoobaza-'+p.externalId),slug:'zoobaza-'+p.externalId,name:p.name,brand:p.vendor||'ZooBaza',category:'ZooBaza',pet:'Собаки' as const,price:p.price,oldPrice:p.oldPrice,emoji:'🐾',description:p.description||'Товар із живого каталогу ZooBaza.',stock:p.available?1:0,features:[p.vendorCode?'Артикул '+p.vendorCode:'ZooBaza','Актуальний фід постачальника']};
  return <article className="product liveProduct" key={p.externalId}>
    <Link href="/catalog" className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name} loading="lazy"/>:<div className="imageFallback">LAPKA</div>}{p.available&&<i>В наявності</i>}</Link>
    <div className="meta"><small>{p.vendor||'ZooBaza'} {p.vendorCode?'• '+p.vendorCode:''}</small><h3>{p.name}</h3><div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button aria-label="Додати у кошик" onClick={()=>add(product)}><ShoppingBag size={17}/></button></div></div>
  </article>
 })}</div>
}
