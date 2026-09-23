'use client';
import Link from 'next/link';
import {Heart,PawPrint,Search,ShoppingBag} from 'lucide-react';
import {usePathname,useRouter} from 'next/navigation';
import {FormEvent,useState} from 'react';
import {useStore} from '@/lib/store';

export default function SiteHeader(){
 const {count,favorites}=useStore(); const [q,setQ]=useState(''); const router=useRouter(); const path=usePathname();
 const submit=(e:FormEvent)=>{e.preventDefault();router.push('/catalog?q='+encodeURIComponent(q))};
 return <header className="siteHeader"><div className="wrap nav">
  <Link href="/" className="brand"><span className="logo"><PawPrint size={18}/></span><span>LAPKA</span></Link>
  <nav className="desktopNav"><Link className={path==='/catalog'?'active':''} href="/catalog">Каталог</Link><Link href="/catalog/zoobaza">ZooBaza live</Link><Link href="/catalog/zoobaza/hits">Хіти</Link><Link href="/catalog?pet=Собаки">Собаки</Link><Link href="/catalog?pet=Коти">Коти</Link><Link href="/pets">Профіль</Link></nav>
  <form className="search" onSubmit={submit}><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Пошук"/></form>
  <div className="actions"><Link className="quietLink" href="/catalog?favorites=1"><Heart size={18}/><span>{favorites.length||''}</span></Link><Link className="cartBtn" href="/checkout"><ShoppingBag size={18}/><span>Кошик</span><b>{count}</b></Link></div>
 </div></header>
}