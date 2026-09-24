'use client';
import Link from 'next/link';
import {Heart} from 'lucide-react';
import {useEffect,useMemo,useState} from 'react';
import type {CatalogProduct} from '@/lib/catalog';
import ProductGrid from '@/components/product-grid';
import {useStore} from '@/lib/store';

export default function FavoritesView(){
 const {favorites}=useStore();
 const ids=useMemo(()=>favorites.filter((x):x is string=>typeof x==='string'),[favorites]);
 const [items,setItems]=useState<CatalogProduct[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{
  if(!ids.length){setItems([]);setLoading(false);return}
  setLoading(true);
  fetch('/api/catalog?ids='+encodeURIComponent(ids.join(','))).then(r=>r.json()).then(j=>setItems(j.items||[])).finally(()=>setLoading(false));
 },[ids.join('|')]);
 if(loading)return <div className="pageLoading"><span></span><p>Завантажуємо обране…</p></div>;
 if(!ids.length)return <div className="emptyState"><Heart size={30}/><h2>В обраному поки порожньо</h2><p>Натискай сердечко на товарах, щоб зберегти їх тут.</p><Link className="button primary" href="/catalog">До каталогу</Link></div>;
 return <ProductGrid items={items}/>;
}
