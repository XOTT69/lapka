'use client';
import Image from 'next/image';
import Link from 'next/link';
import {Heart,ShoppingCart} from 'lucide-react';
import type {CatalogProduct} from '@/lib/catalog';
import {catalogToStoreProduct} from '@/lib/product-adapter';
import {money,useStore} from '@/lib/store';

export default function CatalogProductCard({product}:{product:CatalogProduct}){
 const {add,favorites,toggleFavorite}=useStore();
 const liked=favorites.includes(product.externalId),href='/product/'+encodeURIComponent(product.externalId);
 return <article className="productCard">
  <div className="productMedia">
   <Link href={href} aria-label={product.name}>
    {product.picture?<Image src={product.picture} alt={product.name} fill sizes="(max-width:640px) 50vw,(max-width:1100px) 33vw,25vw" className="productImage"/>:<div className="productImageFallback">LAPKA</div>}
   </Link>
   <button className={'favoriteButton '+(liked?'active':'')} aria-label={liked?'Прибрати з обраного':'Додати в обране'} onClick={()=>toggleFavorite(product.externalId)}><Heart size={18} fill={liked?'currentColor':'none'}/></button>
   {product.groupId&&<span className="variantBadge">Є варіанти</span>}
  </div>
  <div className="productInfo">
   <div className="productMetaRow"><span>{product.brand||product.category||'LAPKA'}</span><span className={product.available?'stockIn':'stockOut'}>{product.available?'В наявності':'Під замовлення'}</span></div>
   <Link href={href} className="productTitle">{product.name}</Link>
   <div className="productCode">Код: {product.sku}</div>
   <div className="productCardBottom"><div className="productPrice"><strong>{money(product.price)}</strong>{product.oldPrice&&<del>{money(product.oldPrice)}</del>}</div><button className="cartSquare" aria-label="Додати в кошик" onClick={()=>add(catalogToStoreProduct(product))}><ShoppingCart size={18}/></button></div>
  </div>
 </article>
}
