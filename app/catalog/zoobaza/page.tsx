import Link from 'next/link';
import {getZooBazaProducts} from '@/lib/zoobaza';

export const dynamic='force-dynamic';

const money=(n:number)=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

export default async function ZooBazaLive(){
 let products:Awaited<ReturnType<typeof getZooBazaProducts>>=[];
 let error='';
 try{ products=await getZooBazaProducts(120) }catch(e){ error=e instanceof Error?e.message:'Не вдалося завантажити фід' }

 return <main className="wrap page">
  <div className="pageIntro">
   <span className="eyebrow">ZooBaza / live XML</span>
   <h1>Живий каталог постачальника</h1>
   <p>Ціни та наявність завантажуються безпосередньо з XML ZooBaza. Оновлення кешу — приблизно кожні 30 хвилин.</p>
  </div>
  {error?<div className="empty"><h2>Фід тимчасово недоступний</h2><p>{error}</p></div>:
  <div className="grid">{products.map(p=><article className="product" key={p.externalId}>
   <div className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name}/>:<div className="packshot"><small>{p.vendor||'ZooBaza'}</small><strong>LIVE</strong><span>{p.vendorCode||p.externalId}</span></div>}</div>
   <div className="meta"><small>{p.vendor||'ZooBaza'} {p.vendorCode?'• '+p.vendorCode:''}</small><h3>{p.name}</h3><div className="stock">{p.available?'В наявності':'Уточнюємо наявність'}</div><div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div>{p.url&&<Link className="supplierLink" href={p.url} target="_blank">Деталі</Link>}</div></div>
  </article>)}</div>}
 </main>
}
