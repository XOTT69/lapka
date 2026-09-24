'use client';
import Link from 'next/link';
import {ShoppingBag} from 'lucide-react';
import type {ZooBazaProduct} from '@/lib/zoobaza';
import {money,useStore} from '@/lib/store';

const hash=(s:string)=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)||1};

export default function LiveFeatured({items}:{items:ZooBazaProduct[]}){
 const {add}=useStore();
 return <div className="grid">{items.map(p=>{
  const href='/product/'+encodeURIComponent(p.externalId);
  const sku=p.vendorCode||p.externalId;
  const product={id:hash('catalog-'+p.externalId),slug:p.externalId,name:p.name,brand:p.vendor||'LAPKA',category:p.category||'Каталог',pet:'Собаки' as const,price:p.price,oldPrice:p.oldPrice,emoji:'🐾',description:p.description||'Актуальний товар із каталогу LAPKA.',stock:p.available?1:0,features:['Код товару: '+sku,p.category||'Каталог']};
  return <article className="product liveProduct" key={p.externalId}>
   <Link href={href} className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name} loading="lazy"/>:<div className="imageFallback">LAPKA</div>}</Link>
   <div className="meta"><small>{p.vendor||p.category||'LAPKA'}</small><Link href={href}><h3>{p.name}</h3></Link><div className="productSku">Код товару: <b>{sku}</b></div><div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button aria-label="Додати у кошик" onClick={()=>add(product)}><ShoppingBag size={17}/></button></div></div>
  </article>
 })}</div>
}