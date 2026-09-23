'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {Product,products} from './products';

export type CartLine={product:Product;qty:number};
export type PetProfile={name:string;type:'Собака'|'Кіт';age:string;weight:string;breed:string;notes:string};
export type SavedOrder={id:string;createdAt:string;total:number;items:number;status:string};

type StoreValue={
 cart:CartLine[]; favorites:number[]; pet:PetProfile|null; orders:SavedOrder[];
 add:(p:Product)=>void; setQty:(id:number,qty:number)=>void; remove:(id:number)=>void;
 toggleFavorite:(id:number)=>void; setPet:(p:PetProfile|null)=>void; addOrder:(o:SavedOrder)=>void;
 count:number; total:number;
};
const C=createContext<StoreValue|null>(null);
const read=<T,>(key:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}};

export function StoreProvider({children}:{children:React.ReactNode}){
 const [cart,setCart]=useState<CartLine[]>([]),[favorites,setFavorites]=useState<number[]>([]),[pet,setPetState]=useState<PetProfile|null>(null),[orders,setOrders]=useState<SavedOrder[]>([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{setCart(read('lapka-cart',[]));setFavorites(read('lapka-favorites',[]));setPetState(read('lapka-pet',null));setOrders(read('lapka-orders',[]));setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem('lapka-cart',JSON.stringify(cart))},[cart,ready]);
 useEffect(()=>{if(ready)localStorage.setItem('lapka-favorites',JSON.stringify(favorites))},[favorites,ready]);
 useEffect(()=>{if(ready)localStorage.setItem('lapka-pet',JSON.stringify(pet))},[pet,ready]);
 useEffect(()=>{if(ready)localStorage.setItem('lapka-orders',JSON.stringify(orders))},[orders,ready]);
 const value=useMemo<StoreValue>(()=>({
   cart,favorites,pet,orders,
   add:p=>setCart(c=>{const x=c.find(i=>i.product.id===p.id);return x?c.map(i=>i.product.id===p.id?{...i,qty:i.qty+1}:i):[...c,{product:p,qty:1}]}),
   setQty:(id,qty)=>setCart(c=>c.map(i=>i.product.id===id?{...i,qty}:i).filter(i=>i.qty>0)),
   remove:id=>setCart(c=>c.filter(i=>i.product.id!==id)),
   toggleFavorite:id=>setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]),
   setPet:p=>setPetState(p), addOrder:o=>setOrders(v=>[o,...v]),
   count:cart.reduce((s,i)=>s+i.qty,0), total:cart.reduce((s,i)=>s+i.qty*i.product.price,0)
 }),[cart,favorites,pet,orders]);
 return <C.Provider value={value}>{children}</C.Provider>
}
export const useStore=()=>{const v=useContext(C);if(!v)throw new Error('StoreProvider missing');return v};
export const money=(n:number)=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';
export const findProducts=(ids:number[])=>ids.map(id=>products.find(p=>p.id===id)).filter(Boolean) as Product[];
