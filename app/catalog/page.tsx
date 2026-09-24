import LiveCatalog from '@/components/live-catalog';
import {getZooBazaProducts} from '@/lib/zoobaza';

export const dynamic='force-dynamic';

export default async function CatalogPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const sp=await searchParams;
 let items:Awaited<ReturnType<typeof getZooBazaProducts>>=[]; let error='';
 try{items=await getZooBazaProducts(1200)}catch(e){error=e instanceof Error?e.message:'Каталог тимчасово недоступний'}
 return <main className="wrap page">
  <div className="pageIntro"><span className="eyebrow">Каталог LAPKA</span><h1>Знайди потрібне швидко</h1><p>Актуальні товари, фото, ціни й наявність — усе в одному каталозі.</p></div>
  {error?<div className="empty"><h2>Не вдалося завантажити каталог</h2><p>{error}</p></div>:<LiveCatalog items={items} initialQuery={sp.q||''}/>}
 </main>
}
