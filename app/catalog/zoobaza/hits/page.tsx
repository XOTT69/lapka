import LiveFeatured from '@/components/live-featured';
import {getZooBazaProducts,type ZooBazaProduct} from '@/lib/zoobaza';
export const dynamic='force-dynamic';

const targets=[
 {codes:['304067'],words:['авіа','сумк','переноск']},
 {codes:['304561'],words:['сумк','переноск']},
 {codes:['304241'],words:['сумк','переноск']},
 {codes:['305005'],words:['диван','лежак']},
 {codes:['WOLF1'],words:['wolf','клітк','вольєр']},
 {codes:['304075'],words:['лежак']},
 {codes:['304952'],words:['лежак']},
];
const norm=(s:string)=>s.toLowerCase().replace(/[’'"]/g,'').replace(/[^a-zа-яіїєґ0-9]+/gi,' ');
function score(p:ZooBazaProduct,t:(typeof targets)[number]){
 const hay=norm([p.externalId,p.vendorCode,p.name,p.category].filter(Boolean).join(' '));
 let s=0;
 for(const c of t.codes)if(hay.includes(norm(c)))s+=100;
 for(const w of t.words)if(hay.includes(norm(w)))s+=10;
 if(p.available)s+=3;
 if(p.picture)s+=2;
 return s;
}
function pickPopular(all:ZooBazaProduct[]){
 const picked:ZooBazaProduct[]=[]; const used=new Set<string>();
 for(const t of targets){
  const best=all.map(p=>({p,s:score(p,t)})).filter(x=>!used.has(x.p.externalId)&&x.s>0).sort((a,b)=>b.s-a.s)[0]?.p;
  if(best){picked.push(best);used.add(best.externalId)}
 }
 if(picked.length<8){
   for(const p of all.filter(p=>p.available&&p.picture&&/переноск|сумк|лежак|клітк|вольєр/i.test(p.name))){
     if(!used.has(p.externalId)){picked.push(p);used.add(p.externalId)}
     if(picked.length>=8)break;
   }
 }
 return picked;
}
export default async function PopularPage(){
 let products:Awaited<ReturnType<typeof getZooBazaProducts>>=[];let error='';
 try{products=pickPopular(await getZooBazaProducts(2000))}catch(e){error=e instanceof Error?e.message:'catalog unavailable'}
 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">Популярне</span><h1>Ходові товари для старту</h1><p>Добірка популярних переносок, лежаків і товарів для подорожей з актуальною наявністю.</p></div>{error?<div className="empty"><h2>Добірка оновлюється</h2></div>:products.length?<LiveFeatured items={products}/>:<div className="empty"><h2>Добірка оновлюється</h2><p>Переглянь увесь каталог — там доступні актуальні товари.</p></div>}</main>
}
