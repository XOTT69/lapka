'use client';
import {Heart,ShoppingBag,Truck,ShieldCheck,RotateCcw} from 'lucide-react';
import {Product} from '@/lib/products';
import {money,useStore} from '@/lib/store';
export default function ProductDetails({product}:{product:Product}){
 const {add,favorites,toggleFavorite,pet}=useStore();const liked=favorites.includes(product.id);
 return <div className="productDetails">
  <div className="productHero"><div className="packshot pack-large"><small>{product.brand}</small><strong>{product.category}</strong><span>{product.weight||product.age||'LAPKA SELECT'}</span></div>{product.badge&&<i>{product.badge}</i>}</div>
  <div className="productBody"><div className="productKicker">{product.brand} / {product.category}</div><h1>{product.name}</h1><p className="lead">{product.description}</p>
  {pet&&<div className="match">{product.pet===(pet.type==='Кіт'?'Коти':'Собаки')?'Підійде для '+pet.name:'Перевір тип тварини в профілі'}</div>}
  <div className="bigPrice">{money(product.price)} {product.oldPrice&&<del>{money(product.oldPrice)}</del>}</div>
  <div className="buyRow"><button className="primary grow" onClick={()=>add(product)}><ShoppingBag size={19}/>Додати до кошика</button><button className={'icon large '+(liked?'liked':'')} onClick={()=>toggleFavorite(product.id)}><Heart fill={liked?'currentColor':'none'}/></button></div>
  <div className="facts">{product.age&&<div><b>Вік</b><span>{product.age}</span></div>}{product.weight&&<div><b>Фасування</b><span>{product.weight}</span></div>}<div><b>Залишок</b><span>{product.stock} шт.</span></div></div>
  <h3>Що важливо</h3><ul className="features">{product.features.map(x=><li key={x}>{x}</li>)}</ul>
  <div className="serviceRow"><span><Truck/>Нова пошта по Україні</span><span><ShieldCheck/>Офіційний товар</span><span><RotateCcw/>Повернення за правилами категорії</span></div></div>
 </div>
}