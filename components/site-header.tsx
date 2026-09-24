'use client';
import Link from 'next/link';
import {Heart,PawPrint,Search,ShoppingBag} from 'lucide-react';
import {usePathname,useRouter} from 'next/navigation';
import {FormEvent,useState} from 'react';
import {useStore} from '@/lib/store';
import AccountLink from '@/components/account-link';

const nav=[
 ['Корми для собак','Корми для собак'],
 ['Корми для котів','Корми для котів'],
 ['Переноски','Переноски'],
 ['Лежаки','Лежаки та будиночки'],
 ['Одяг','Одяг'],
 ['Аксесуари','Аксесуари']
];

export default function SiteHeader(){
 const {count,favorites}=useStore();const [q,setQ]=useState('');const router=useRouter();const path=usePathname();
 const submit=(e:FormEvent)=>{e.preventDefault();const v=q.trim();router.push(v?'/catalog?q='+encodeURIComponent(v):'/catalog')};
 return <header className="siteHeader">
  <div className="wrap headerMain">
   <Link href="/" className="brand"><span className="logo"><PawPrint size={19}/></span><span>LAPKA</span></Link>
   <form className="headerSearch" onSubmit={submit}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Пошук за назвою, брендом або кодом"/><button>Знайти</button></form>
   <div className="headerActions">
    <Link className="headerAction" href="/favorites" aria-label="Обране"><Heart size={20}/>{favorites.length>0&&<b>{favorites.length}</b>}</Link>
    <AccountLink/>
    <Link className="headerAction cartAction" href="/checkout" aria-label="Кошик"><ShoppingBag size={20}/>{count>0&&<b>{count}</b>}</Link>
   </div>
  </div>
  <nav className="categoryNav"><div className="wrap"><Link href="/catalog" className="allCatalog">Каталог</Link>{nav.map(([label,category])=><Link key={category} href={'/catalog?category='+encodeURIComponent(category)}>{label}</Link>)}</div></nav>
  {path!='/catalog'&&<form className="mobileHeaderSearch wrap" onSubmit={submit}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Знайти товар або код"/><button>Знайти</button></form>}
 </header>
}
