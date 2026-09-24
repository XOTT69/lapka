'use client';
import Link from 'next/link';
import {Heart,PawPrint,ShoppingBag} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {useStore} from '@/lib/store';
import AccountLink from '@/components/account-link';
import CatalogSearch from '@/components/catalog-search';

const nav=[
 ['Корми для собак','Корми для собак'],
 ['Корми для котів','Корми для котів'],
 ['Переноски','Переноски'],
 ['Лежаки','Лежаки та будиночки'],
 ['Одяг','Одяг'],
 ['Аксесуари','Аксесуари']
];

export default function SiteHeader(){
 const {count,favorites}=useStore(),path=usePathname();
 return <header className="siteHeader">
  <div className="wrap headerMain">
   <Link href="/" className="brand"><span className="logo"><PawPrint size={19}/></span><span>LAPKA</span></Link>
   <CatalogSearch/>
   <div className="headerActions">
    <Link className="headerAction" href="/favorites" aria-label="Обране"><Heart size={20}/>{favorites.length>0&&<b>{favorites.length}</b>}</Link>
    <AccountLink/>
    <Link className="headerAction cartAction" href="/checkout" aria-label="Кошик"><ShoppingBag size={20}/>{count>0&&<b>{count}</b>}</Link>
   </div>
  </div>
  <nav className="categoryNav"><div className="wrap"><Link href="/catalog" className="allCatalog">Каталог</Link>{nav.map(([label,category])=><Link key={category} href={'/catalog?category='+encodeURIComponent(category)}>{label}</Link>)}</div></nav>
  {path!='/catalog'&&<div className="wrap mobileSearchWrap"><CatalogSearch mobile/></div>}
 </header>
}
