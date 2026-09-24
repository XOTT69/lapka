'use client';
import Link from 'next/link';
import {Heart,PawPrint,Search,ShoppingBag} from 'lucide-react';
import {usePathname,useRouter} from 'next/navigation';
import {FormEvent,useState} from 'react';
import {useStore} from '@/lib/store';
import AccountLink from '@/components/account-link';

export default function SiteHeader(){
 const {count,favorites}=useStore();const [q,setQ]=useState('');const router=useRouter();const path=usePathname();
 const submit=(e:FormEvent)=>{e.preventDefault();if(q.trim())router.push('/catalog?q='+encodeURIComponent(q.trim()))};
 return <header className="siteHeader">
  <div className="storeTopbar"><div className="wrap"><span>Доставка по Україні Новою поштою</span><span>Актуальна наявність</span><span>Профілі ваших улюбленців</span></div></div>
  <div className="wrap nav">
   <Link href="/" className="brand"><span className="logo"><PawPrint size={18}/></span><span>LAPKA</span></Link>
   <form className="search" onSubmit={submit}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Пошук товарів і кодів"/><button>Знайти</button></form>
   <div className="actions"><Link className="headerIcon" href="/catalog?favorites=1" aria-label="Обране"><Heart size={18}/>{favorites.length>0&&<b>{favorites.length}</b>}</Link><AccountLink/><Link className="cartBtn" href="/checkout"><ShoppingBag size={18}/><span>Кошик</span>{count>0&&<b>{count}</b>}</Link></div>
  </div>
  <nav className="shopNav wrap"><Link href="/catalog">Усі товари</Link><Link href="/catalog?q=собак">Собакам</Link><Link href="/catalog?q=кот">Котам</Link><Link href="/catalog?q=корм">Корм</Link><Link href="/catalog?q=переноск">Переноски</Link><Link href="/catalog?q=амуніц">Амуніція</Link><Link href="/catalog?q=догляд">Догляд</Link><Link href="/popular">Популярне</Link></nav>
  {path!='/catalog'&&<form className="mobileSearch wrap" onSubmit={submit}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Пошук товарів і кодів"/><button>Знайти</button></form>}
 </header>
}
