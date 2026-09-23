'use client';
import Link from 'next/link';
import {Heart,Plus} from 'lucide-react';
import {Product} from '@/lib/products';
import {money,useStore} from '@/lib/store';

export default function ProductCard({p}:{p:Product}){
 const {add,favorites,toggleFavorite}=useStore(); const liked=favorites.includes(p.id);
 return <article className="product">
  <Link href={'/product/'+p.slug} className="visual"><span className="productEmoji">{p.emoji}</span>{p.badge&&<i>{p.badge}</i>}</Link>
  <button aria-label="Улюблене" className={'heart '+(liked?'liked':'')} onClick={()=>toggleFavorite(p.id)}><Heart size={19} fill={liked?'currentColor':'none'}/></button>
  <div className="meta"><small>{p.brand} • {p.category}</small><Link href={'/product/'+p.slug}><h3>{p.name}</h3></Link><p>{p.description}</p>
   <div className="stock">{p.stock>0?'● Є в наявності':'Немає в наявності'}</div>
   <div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button aria-label="Додати у кошик" onClick={()=>add(p)}><Plus size={19}/></button></div>
  </div>
 </article>
}
