'use client';
import Link from 'next/link';
import { Heart, Home, PawPrint, ShoppingBag, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function MobileNav(){
 const path=usePathname(); const {count}=useStore();
 const item=(href:string,label:string,Icon:any)=>(
  <Link className={path===href?'active':''} href={href}><Icon size={20}/><span>{label}</span>{href==='/checkout'&&count>0?<b>{count}</b>:null}</Link>
 );
 return <nav className="mobileNav">{item('/','Головна',Home)}{item('/catalog','Каталог',PawPrint)}{item('/catalog?favorites=1','Обране',Heart)}{item('/checkout','Кошик',ShoppingBag)}{item('/account','Профіль',UserRound)}</nav>
}
