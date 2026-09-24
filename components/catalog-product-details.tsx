'use client';
import Image from 'next/image';
import Link from 'next/link';
import {Heart,Minus,Plus,ShoppingCart,Truck,WalletCards} from 'lucide-react';
import {useMemo,useState} from 'react';
import type {CatalogProduct} from '@/lib/catalog';
import ProductGrid from '@/components/product-grid';
import {catalogToStoreProduct} from '@/lib/product-adapter';
import {money,useStore} from '@/lib/store';

export default function CatalogProductDetails({product,variants,related}:{product:CatalogProduct;variants:CatalogProduct[];related:CatalogProduct[]}){
 const gallery=useMemo(()=>[...new Set([product.picture,...product.pictures].filter(Boolean) as string[])],[product]);
 const [active,setActive]=useState(gallery[0]||''),[qty,setQty]=useState(1);
 const {add,favorites,toggleFavorite}=useStore();
 const favoriteKey=product.externalId,liked=favorites.includes(favoriteKey);
 const characteristics=Object.entries(product.params||{}).filter(([k,v])=>k&&v&&String(v).length<120).slice(0,18);
 const addMany=()=>{const p=catalogToStoreProduct(product);for(let i=0;i<qty;i++)add(p)};

 return <div className="productPageNew">
  <div className="productTop">
   <section className="productGallery">
    <div className="thumbRail">{gallery.map((src,i)=><button key={src} className={active===src?'active':''} onClick={()=>setActive(src)} aria-label={'Фото '+(i+1)}><Image src={src} alt="" fill sizes="72px"/></button>)}</div>
    <div className="mainProductImage">{active?<Image src={active} alt={product.name} fill priority sizes="(max-width:900px) 100vw,50vw"/>:<div className="productImageFallback">LAPKA</div>}</div>
   </section>

   <section className="productSummary">
    <div className="productBrandLine"><span>{product.brand||product.category||'LAPKA'}</span><button onClick={()=>toggleFavorite(favoriteKey)} className={liked?'active':''}><Heart size={19} fill={liked?'currentColor':'none'}/>{liked?'В обраному':'В обране'}</button></div>
    <h1>{product.name}</h1>
    <div className="productIdentifiers"><span>Код товару: <b>{product.sku}</b></span>{product.ean&&<span>EAN: {product.ean}</span>}</div>
    <div className={product.available?'detailStock in':'detailStock'}><i></i>{product.available?'В наявності':'Під замовлення'}</div>

    {variants.length>0&&<div className="variantSection"><div className="variantTitle">Варіанти</div><div className="variantLinks"><span className="active">{product.color||product.weight||product.sku}</span>{variants.map(v=><Link key={v.externalId} href={'/product/'+encodeURIComponent(v.externalId)}>{v.color||v.weight||v.sku}</Link>)}</div></div>}

    <div className="detailPrice">{product.oldPrice&&<del>{money(product.oldPrice)}</del>}<strong>{money(product.price)}</strong></div>
    <div className="purchaseRow"><div className="qtyControl"><button onClick={()=>setQty(v=>Math.max(1,v-1))}><Minus size={16}/></button><b>{qty}</b><button onClick={()=>setQty(v=>Math.min(20,v+1))}><Plus size={16}/></button></div><button className="button primary addToCart" disabled={!product.available} onClick={addMany}><ShoppingCart size={19}/>{product.available?'Додати в кошик':'Тимчасово немає'}</button></div>

    <div className="purchaseInfo"><div><Truck size={19}/><span><b>Нова пошта</b>Відділення або поштомат обираються при оформленні</span></div><div><WalletCards size={19}/><span><b>Оплата</b>За реквізитами після підтвердження або при отриманні</span></div></div>
   </section>
  </div>

  <div className="productInfoSections">
   <section><h2>Опис</h2><p>{product.description||'Опис цього товару уточнюється.'}</p></section>
   <section><h2>Характеристики</h2><div className="specTable"><div><span>Код товару</span><b>{product.sku}</b></div>{product.brand&&<div><span>Бренд</span><b>{product.brand}</b></div>}{product.category&&<div><span>Категорія</span><b>{product.category}</b></div>}{product.weight&&<div><span>Вага</span><b>{product.weight}</b></div>}{product.dimensions&&<div><span>Габарити</span><b>{product.dimensions}</b></div>}{product.color&&<div><span>Колір</span><b>{product.color}</b></div>}{product.ean&&<div><span>EAN</span><b>{product.ean}</b></div>}{characteristics.map(([k,v])=><div key={k}><span>{k}</span><b>{String(v)}</b></div>)}</div></section>
  </div>

  {related.length>0&&<section className="relatedSection"><div className="sectionTitleRow"><div><span>Може підійти</span><h2>Схожі товари</h2></div><Link href={'/catalog?category='+encodeURIComponent(product.category||'')}>Усі в категорії</Link></div><ProductGrid items={related}/></section>}
 </div>
}
