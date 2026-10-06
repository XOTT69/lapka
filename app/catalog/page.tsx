import CatalogBrowser from '@/components/catalog-browser';
import {getCatalogFacets,getCatalogProducts} from '@/lib/catalog';

export const revalidate=120;

export default async function CatalogPage({searchParams}:{searchParams:Promise<{q?:string;category?:string}>}){
 const sp=await searchParams;
 const q=sp.q||'',category=sp.category||'';
 const [result,facets]=await Promise.all([
  getCatalogProducts({q,category,limit:48,available:false}),
  getCatalogFacets()
 ]);
 return <main className="wrap page catalogPage">
  <div className="catalogPageHead"><div><span>Каталог IMPORTA</span><h1>{category||'Імпортні смаколики'}</h1></div></div>
  <CatalogBrowser initialItems={result.items} initialTotal={result.total} facets={facets} initialQuery={q} initialCategory={category}/>
 </main>
}
