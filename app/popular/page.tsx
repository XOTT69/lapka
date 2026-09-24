import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {getCatalogProducts} from '@/lib/catalog';
import ProductGrid from '@/components/product-grid';

export const revalidate=120;

export default async function PopularPage(){
 const result=await getCatalogProducts({limit:24,available:true});
 return <main className="wrap page"><div className="simplePageHead"><span>Добірка</span><h1>Популярне зараз</h1><p>Товари, які є в наявності та готові до замовлення.</p></div><ProductGrid items={result.items}/><div className="centerAction"><Link className="button secondary" href="/catalog">Увесь каталог <ArrowRight size={16}/></Link></div></main>
}
