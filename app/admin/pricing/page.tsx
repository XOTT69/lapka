import {getZooBazaPriceRows} from '@/lib/zoobaza-pricing';
export const dynamic='force-dynamic';
const money=(n:number)=>new Intl.NumberFormat('uk-UA',{maximumFractionDigits:0}).format(n)+' ₴';

export default async function Pricing(){
 let rows:Awaited<ReturnType<typeof getZooBazaPriceRows>>=[]; let error='';
 try{rows=await getZooBazaPriceRows(500)}catch(e){error=e instanceof Error?e.message:'Не вдалося прочитати прайс'}
 const valid=rows.filter(r=>r.b2b>0&&r.rrp>0);
 const avg=valid.length?valid.reduce((s,r)=>s+r.markupPercent,0)/valid.length:0;
 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">ZooBaza / economics</span><h1>B2B → РРЦ → прибуток</h1><p>Живий Excel-прайс постачальника. Для ZooBaza продаємо по РРЦ, а не накручуємо нашу стандартну націнку поверх неї.</p></div>
 {error?<div className="empty">{error}</div>:<>
  <div className="stats"><div><small>Позицій</small><b>{rows.length}</b></div><div><small>З цінами B2B/РРЦ</small><b>{valid.length}</b></div><div><small>Середня націнка*</small><b>{avg.toFixed(1)}%</b></div><div><small>Джерело</small><b>ZooBaza XLSX</b></div></div>
  <div className="card"><div className="adminTable pricingTable">{valid.slice(0,150).map((r,i)=><div key={r.sku||i}><span><b>{r.sku}</b> {r.name}</span><small>B2B {money(r.b2b)}</small><small>РРЦ {money(r.rrp)}</small><strong>+{money(r.profit)} · {r.markupPercent.toFixed(1)}%</strong></div>)}</div></div>
  <p className="pricingNote">* Націнка тут = (РРЦ − B2B) / B2B. Це валовий показник до еквайрингу, податків та інших витрат.</p>
 </>}
 </main>
}
