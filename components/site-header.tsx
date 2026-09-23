'use client';
import Link from 'next/link';
import {Heart,PawPrint,Search,ShoppingBag} from 'lucide-react';
import {usePathname,useRouter} from 'next/navigation';
import {FormEvent,useState} from 'react';
import {useStore} from '@/lib/store';
import AccountLink from '@/components/account-link';

export default function SiteHeader(){
 const {count,favorites}=useStore();
 const [q,setQ]=useState('');
 const router=useRouter();
 const path=usePathname();
 const submit=(e:FormEvent)=>{e.preventDefault();if(q.trim())router.push('/catalog?q='+encodeURIComponent(q.trim()))};

 return <header className="siteHeader">
  <div className="wrap nav">
   <Link href="/" className="brand"><span className="logo"><PawPrint size={18}/></span><span>LAPKA</span></Link>
   <nav className="desktopNav">
    <Link className={path==='/catalog'?'active':''} href="/catalog">Каталог</Link>
    <Link href="/catalog?pet=Собаки">Собакам</Link>
    <Link href="/catalog?pet=Коти">Котам</Link>
    <Link href="/catalog/zoobaza/hits">Хіти</Link>
   </nav>
   <form className="search" onSubmit={submit}><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Пошук товарів"/></form>
   <div className="actions">
    <Link className="headerIcon" href="/catalog?favorites=1" aria-label="Обране"><Heart size={18}/>{favorites.length>0&&<b>{favorites.length}</b>}</Link>
    <AccountLink/>
    <Link className="cartBtn" href="/checkout"><ShoppingBag size={18}/><span>Кошик</span>{count>0&&<b>{count}</b>}</Link>
   </div>
  </div>
 </header>
}