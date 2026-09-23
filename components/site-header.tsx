'use client';
import Link from 'next/link';
import {Heart,PawPrint,Search,ShoppingBag,UserRound} from 'lucide-react';
import {usePathname,useRouter} from 'next/navigation';
import {FormEvent,useState} from 'react';
import {useStore} from '@/lib/store';

export default function SiteHeader(){
 const {count,favorites}=useStore(); const [q,setQ]=useState(''); const router=useRouter(); const path=usePathname();
 const submit=(e:FormEvent)=>{e.preventDefault();router.push('/catalog?q='+encodeURIComponent(q))};
 return <header className="siteHeader"><div className="wrap nav">
  <Link href="/" className="brand"><span className="logo"><PawPrint size={21}/></span>LAPKA</Link>
  <form className="search" onSubmit={submit}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Корм, бренд або товар…"/></form>
  <nav className="desktopNav"><Link className={path==='/catalog'?'active':''} href="/catalog">Каталог</Link><Link href="/pets">Улюбленець</Link><Link href="/orders">Замовлення</Link></nav>
  <div className="actions"><Link className="icon" href="/catalog?favorites=1"><Heart/><i>{favorites.length||''}</i></Link><Link className="icon" href="/pets"><UserRound/></Link><Link className="cartBtn" href="/checkout"><ShoppingBag size={19}/>Кошик <b>{count}</b></Link></div>
 </div></header>
}
