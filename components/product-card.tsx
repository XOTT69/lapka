'use client';
import Link from 'next/link';
import {Heart,Plus} from 'lucide-react';
import {Product} from '@/lib/products';
import {money,useStore} from '@/lib/store';

const visualClass=(p:Product)=>'packshot pack-'+p.category.toLowerCase().replaceAll('і','i').replaceAll(' ','-');

export default function ProductCard({p}:{p:Product}){
 const {add,favorites,toggleFavorite}=useStore(); const liked=favorites.includes(p.id);
 return <article className="product">
  <Link href={'/product/'+p.slug} className="visual">
   <div className={visualClass(p)}>
    <small>{p.brand}</small>
    <strong>{p.category}</strong>
    <span>{p.weight||p.age||'LAPKA SELECT'}</span>
   </div>
   {p.badge&&<i>{p.badge}</i>}
  </Link>
  <button aria-label="Улюблене" className={'heart '+(liked?'liked':'')} onClick={()=>toggleFavorite(p.id)}><Heart size={18} fill={liked?'currentColor':'none'}/></button>
  <div className="meta"><small>{p.brand}</small><Link href={'/product/'+p.slug}><h3>{p.name}</h3></Link><div className="stock">{p.stock>0?'В наявності':'Немає в наявності'}</div>
   <div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button aria-label="Додати у кошик" onClick={()=>add(p)}><Plus size={18}/></button></div>
  </div>
 </article>
}