import {getZooBazaProducts} from '@/lib/zoobaza';

export const dynamic='force-dynamic';

const desired=['304067','304561','304241','305005','WOLF1','304075','304952'];
const keywords=['авіасум','переноск','лежак','диван','вольєр'];
const money=(n:number)=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

export default async function PopularPage(){
 let products:Awaited<ReturnType<typeof getZooBazaProducts>>=[]; let error='';
 try{
  const all=await getZooBazaProducts(2000);
  const exact=all.filter(p=>{
   const hay=(p.externalId+' '+(p.vendorCode||'')+' '+p.name).toUpperCase();
   return desired.some(code=>hay.includes(code));
  });
  const fallback=all.filter(p=>{
   const hay=(p.name+' '+(p.description||'')).toLowerCase();
   return keywords.some(k=>hay.includes(k))&&p.available;
  });
  products=[...exact,...fallback.filter(x=>!exact.some(e=>e.externalId===x.externalId))].slice(0,12);
 }catch(e){error=e instanceof Error?e.message:'Не вдалося завантажити каталог'}

 return <main className="wrap page">
  <div className="pageIntro"><span className="eyebrow">Популярне</span><h1>Ходові позиції для старту</h1><p>Переноски, лежаки та товари для перевезення, які варто показувати першими.</p></div>
  {error?<div className="empty">{error}</div>:products.length?
   <div className="grid">{products.map(p=><article className="product liveProduct" key={p.externalId}>
    <div className="visual supplierVisual">{p.picture?<img src={p.picture} alt={p.name}/>:<div className="imageFallback">LAPKA</div>}</div>
    <div className="meta"><small>{p.vendor||p.category||'LAPKA'} {p.color?'• '+p.color:''}</small><h3>{p.name}</h3><div className="stock">{p.available?'В наявності':'Уточнюємо'}</div><div className="price"><b>{money(p.price)}</b></div></div>
   </article>)}</div>:
   <div className="empty"><h2>Добірка оновлюється</h2><p>Перейди до каталогу — там уже є актуальні товари.</p></div>}
 </main>
}
