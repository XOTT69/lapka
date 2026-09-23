import {getZooBazaProducts} from '@/lib/zoobaza';

export const dynamic='force-dynamic';

const recommended=['304067','304561','304241','305005','WOLF1','304075','304952'];
const money=(n:number)=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

export default async function ZooBazaHits(){
 let products:Awaited<ReturnType<typeof getZooBazaProducts>>=[];
 let error='';
 try{
  const all=await getZooBazaProducts(2000);
  products=all.filter(p=>{
   const hay=(p.externalId+' '+(p.vendorCode||'')+' '+p.name).toUpperCase();
   return recommended.some(code=>hay.includes(code));
  });
 }catch(e){error=e instanceof Error?e.message:'Не вдалося завантажити фід'}

 return <main className="wrap page">
  <div className="pageIntro"><span className="eyebrow">ZooBaza / стартова добірка</span><h1>Ходові позиції для запуску</h1><p>Добірка за рекомендацією менеджера ZooBaza: 304067, 304561, 304241, 305005, WOLF1, 304075, 304952.</p></div>
  {error?<div className="empty">{error}</div>:products.length?
   <div className="grid">{products.map(p=><article className="product" key={p.externalId}>
    <div className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name}/>:<div className="packshot"><small>{p.vendor||'ZooBaza'}</small><strong>HIT</strong><span>{p.vendorCode||p.externalId}</span></div>}</div>
    <div className="meta"><small>{p.vendor||'ZooBaza'} • {p.vendorCode||p.externalId}</small><h3>{p.name}</h3><div className="stock">{p.available?'В наявності':'Уточнюємо'}</div><div className="price"><b>{money(p.price)}</b></div></div>
   </article>)}</div>:
   <div className="empty"><h2>SKU не знайдені у поточному фіді</h2><p>Фід може використовувати інші артикули для кольорів/розмірів. Live-каталог доступний окремо.</p></div>}
 </main>
}
