'use client';
import {useMemo} from 'react';
import {useSearchParams} from 'next/navigation';
import ProductCard from '@/components/product-card';
import {brands,categories,products} from '@/lib/products';
import {useStore} from '@/lib/store';

export default function Catalog(){
 const sp=useSearchParams(); const {favorites}=useStore();
 const q=(sp.get('q')||'').toLowerCase(), pet=sp.get('pet'), cat=sp.get('category'), brand=sp.get('brand'), fav=sp.get('favorites')==='1';
 const list=useMemo(()=>products.filter(p=>(!q||(`${p.name} ${p.brand} ${p.category}`).toLowerCase().includes(q))&&(!pet||p.pet===pet)&&(!cat||p.category===cat)&&(!brand||p.brand===brand)&&(!fav||favorites.includes(p.id))),[q,pet,cat,brand,fav,favorites]);
 const go=(key:string,value:string)=>{const n=new URLSearchParams(sp.toString());value?n.set(key,value):n.delete(key);location.href='/catalog?'+n.toString()};
 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">Каталог</span><h1>{fav?'Обране':'Знайдіть саме те, що потрібно'}</h1><p>{list.length} товарів у добірці</p></div>
 <div className="catalogLayout"><aside className="filters"><label>Для кого<select value={pet||''} onChange={e=>go('pet',e.target.value)}><option value="">Усі</option><option>Собаки</option><option>Коти</option></select></label><label>Категорія<select value={cat||''} onChange={e=>go('category',e.target.value)}><option value="">Усі</option>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>Бренд<select value={brand||''} onChange={e=>go('brand',e.target.value)}><option value="">Усі</option>{brands.map(x=><option key={x}>{x}</option>)}</select></label><a href="/catalog">Скинути фільтри</a></aside><section><div className="grid">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>{!list.length&&<div className="empty">Нічого не знайшли. Спробуйте інший фільтр.</div>}</section></div></main>
}
