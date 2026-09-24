'use client';
import Link from 'next/link';
import {Heart,Home,PawPrint,ShoppingBag,UserRound} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {useStore} from '@/lib/store';

export default function MobileNav(){
 const path=usePathname(),{count,favorites}=useStore();
 const items=[
  ['/', 'Головна',Home,0],
  ['/catalog','Каталог',PawPrint,0],
  ['/favorites','Обране',Heart,favorites.length],
  ['/checkout','Кошик',ShoppingBag,count],
  ['/account','Профіль',UserRound,0]
 ] as const;
 return <nav className="mobileNav">{items.map(([href,label,Icon,badge])=><Link key={href} className={path===href?'active':''} href={href}><Icon size={20}/><span>{label}</span>{badge>0&&<b>{badge}</b>}</Link>)}</nav>
}
