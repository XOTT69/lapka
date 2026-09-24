'use client';
import {Heart,ShoppingBag,Truck,ShieldCheck} from 'lucide-react';
import type {ZooBazaProduct} from '@/lib/zoobaza';
import {money,useStore} from '@/lib/store';

const hash=(s:string)=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)||1};

export default function LiveProductDetails({product}:{product:ZooBazaProduct}){
 const {add,favorites,toggleFavorite}=useStore();
 const id=hash('catalog-'+product.externalId);
 const liked=favorites.includes(id);
 const sku=product.vendorCode||product.externalId;
 const cartProduct={id,slug:product.externalId,name:product.name,brand:product.vendor||'LAPKA',category:product.category||'Каталог',pet:'Собаки' as const,price:product.price,oldPrice:product.oldPrice,emoji:'🐾',description:product.description||'Актуальний товар каталогу.',stock:product.available?1:0,features:['Код товару: '+sku,product.ean?'EAN: '+product.ean:'',product.color?'Колір: '+product.color:''].filter(Boolean)};
 return <div className="productDetails">
  <div className="productHero liveProductHero">{product.picture?<img src={product.picture} alt={product.name}/>:<div className="imageFallback">LAPKA</div>}</div>
  <div className="productBody">
   <div className="productKicker">{product.vendor||product.category||'LAPKA'}</div>
   <h1>{product.name}</h1>
   <div className="productCodeLine">Код товару: <b>{sku}</b>{product.ean&&<span>EAN: {product.ean}</span>}</div>
   <p className="lead">{product.description||'Опис товару оновлюється.'}</p>
   <div className="productAvailability big">{product.available?<><i></i>В наявності</>:<>Під замовлення</>}</div>
   <div className="bigPrice">{money(product.price)} {product.oldPrice&&<del>{money(product.oldPrice)}</del>}</div>
   <div className="buyRow"><button className="primary grow" onClick={()=>add(cartProduct)}><ShoppingBag size={19}/>Додати до кошика</button><button className={'icon large '+(liked?'liked':'')} onClick={()=>toggleFavorite(id)}><Heart fill={liked?'currentColor':'none'}/></button></div>
   <div className="facts">{product.weight&&<div><b>Вага</b><span>{product.weight}</span></div>}{product.dimensions&&<div><b>Габарити</b><span>{product.dimensions}</span></div>}{product.color&&<div><b>Колір</b><span>{product.color}</span></div>}</div>
   <div className="serviceRow"><span><Truck/>Доставка Новою поштою</span><span><ShieldCheck/>Актуальні дані каталогу</span></div>
  </div>
 </div>
}