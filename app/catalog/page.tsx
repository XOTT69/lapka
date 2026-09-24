import LiveCatalog from '@/components/live-catalog';
import {getZooBazaProducts} from '@/lib/zoobaza';
export const dynamic='force-dynamic';
export default async function CatalogPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const sp=await searchParams; let items:Awaited<ReturnType<typeof getZooBazaProducts>>=[]; let error='';
 try{items=await getZooBazaProducts(1200)}catch(e){error=e instanceof Error?e.message:'Каталог тимчасово недоступний'}
 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">Каталог LAPKA</span><h1>Все потрібне — без зайвого.</h1><p>Актуальні товари, фото, ціни та наявність. Використовуй пошук і фільтри, щоб швидко знайти своє.</p></div>{error?<div className="empty"><h2>Каталог оновлюється</h2><p>Спробуй ще раз трохи пізніше.</p></div>:<LiveCatalog items={items} initialQuery={sp.q||''}/>}</main>
}
