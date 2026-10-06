'use client';
import Image from 'next/image';
import Link from 'next/link';
import {Heart,Minus,Plus,ShoppingCart,Truck,WalletCards,Undo2} from 'lucide-react';
import {useMemo,useState} from 'react';
import type {CatalogProduct} from '@/lib/catalog';
import ProductGrid from '@/components/product-grid';
import {catalogToStoreProduct} from '@/lib/product-adapter';
import {money,useStore} from '@/lib/store';

export default function CatalogProductDetails({product,variants,related}:{product:CatalogProduct;variants:CatalogProduct[];related:CatalogProduct[]}){
 const gallery=useMemo(()=>[...new Set([product.picture,...product.pictures].filter(Boolean) as string[])],[product]);
 const [active,setActive]=useState(gallery[0]||''),[qty,setQty]=useState(1);
 const {add,favorites,toggleFavorite}=useStore();
 const favoriteKey=product.externalId,liked=favorites.includes(favoriteKey),purchasable=product.available&&product.price>0;
 const characteristics=Object.entries(product.params||{}).filter(([k,v])=>k&&v&&String(v).length<120).slice(0,18);
 const addMany=()=>{if(!purchasable)return;const p=catalogToStoreProduct(product);for(let i=0;i<qty;i++)add(p)};

 return <div className="productPageNew">
  <div className="productTop">
   <section className="productGallery">
    <div className="thumbRail">{gallery.map((src,i)=><button key={src} className={active===src?'active':''} onClick={()=>setActive(src)} aria-label={'Фото '+(i+1)}><Image src={src} alt="" fill sizes="72px"/></button>)}</div>
    <div className="mainProductImage">{active?<Image src={active} alt={product.name} fill priority sizes="(max-width:900px) 100vw,50vw"/>:<div className="productImageFallback">{product.brand||'IMPORTA'}</div>}</div>
   </section>
   <section className="productSummary">
    <div className="productBrandLine"><span>{[product.brand,product.country].filter(Boolean).join(' · ')||'IMPORTA'}</span><button onClick={()=>toggleFavorite(favoriteKey)} className={liked?'active':''}><Heart size={19} fill={liked?'currentColor':'none'}/>{liked?'В обраному':'В обране'}</button></div>
    <h1>{product.name}</h1>
    <div className="productIdentifiers"><span>Код товару: <b>{product.sku}</b></span>{product.ean&&<span>EAN: {product.ean}</span>}</div>
    <div className={purchasable?'detailStock in':'detailStock'}><i></i><span>{purchasable?'В наявності':'Очікуємо гуртовий прайс'}<small>{purchasable?'Можна замовляти':'Не вигадуємо ціну та залишок — підключаємо реального постачальника'}</small></span></div>
    {variants.length>0&&<div className="variantSection"><div className="variantTitle">Варіанти</div><div className="variantLinks">{variants.map(v=><Link key={v.externalId} href={'/product/'+encodeURIComponent(v.externalId)}>{v.weight||v.sku}</Link>)}</div></div>}
    <div className="detailPrice">{product.price>0?<>{product.oldPrice&&<del>{money(product.oldPrice)}</del>}<strong>{money(product.price)}</strong></>:<strong>Ціна після B2B-прайсу</strong>}</div>
    <div className="purchaseRow"><div className="qtyControl"><button disabled={!purchasable} onClick={()=>setQty(v=>Math.max(1,v-1))}><Minus size={16}/></button><b>{qty}</b><button disabled={!purchasable} onClick={()=>setQty(v=>Math.min(20,v+1))}><Plus size={16}/></button></div><button className="button primary addToCart" disabled={!purchasable} onClick={addMany}><ShoppingCart size={19}/>{purchasable?'Додати в кошик':'Продаж ще не відкрито'}</button></div>
    <div className="purchaseInfo"><Link href="/delivery-payment"><Truck size={19}/><span><b>Нова пошта</b>Умови доставки та оплати</span></Link><Link href="/returns"><Undo2 size={19}/><span><b>Повернення</b>Умови для харчових товарів</span></Link><div><WalletCards size={19}/><span><b>Оплата</b>Після підтвердження ціни та наявності</span></div></div>
   </section>
  </div>
  <div className="productInfoSections">
   <section><h2>Опис</h2><p>{product.description||'Опис цього товару уточнюється.'}</p></section>
   <section><h2>Характеристики</h2><div className="specTable"><div><span>Код товару</span><b>{product.sku}</b></div>{product.brand&&<div><span>Бренд</span><b>{product.brand}</b></div>}{product.category&&<div><span>Категорія</span><b>{product.category}</b></div>}{product.country&&<div><span>Країна / ринок</span><b>{product.country}</b></div>}{product.weight&&<div><span>Вага / об’єм</span><b>{product.weight}</b></div>}{product.ean&&<div><span>EAN</span><b>{product.ean}</b></div>}{characteristics.map(([k,v])=><div key={k}><span>{k}</span><b>{String(v)}</b></div>)}</div></section>
  </div>
  {related.length>0&&<section className="relatedSection"><div className="sectionTitleRow"><div><span>Ще в категорії</span><h2>Схожі товари</h2></div><Link href={'/catalog?category='+encodeURIComponent(product.category||'')}>Усі в категорії</Link></div><ProductGrid items={related}/></section>}
 </div>
}
