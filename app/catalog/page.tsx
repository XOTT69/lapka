import {Suspense} from 'react';
import CatalogClient from '@/components/catalog-client';

export default function CatalogPage(){
 return <Suspense fallback={<main className="wrap page"><div className="empty">Завантажуємо каталог…</div></main>}><CatalogClient/></Suspense>
}
