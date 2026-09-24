export type ZooBazaProduct = {
  externalId: string;
  name: string;
  price: number;
  oldPrice?: number;
  currency: string;
  categoryId?: string;
  category?: string;
  vendor?: string;
  vendorCode?: string;
  picture?: string;
  description?: string;
  available: boolean;
  url?: string;
  color?: string;
  params?: Record<string,string>;
};

const decode=(s:string='')=>s
 .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
 .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
 .replace(/&lt;/g,'<').replace(/&gt;/g,'>');

const tag=(xml:string,name:string)=>{
 const m=xml.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','i'));
 return m?decode(m[1].trim()):'';
};
const attr=(xml:string,name:string)=>{
 const m=xml.match(new RegExp(name + "=[\\\"']([^\\\"']*)[\\\"']", "i"));
 return m?decode(m[1]):'';
};
const number=(v:string)=>Number(String(v).replace(/\s/g,'').replace(',','.'))||0;

function parseParams(offer:string){
 const params:Record<string,string>={};
 const matches=[...offer.matchAll(/<param\b([^>]*)>([\s\S]*?)<\/param>/gi)];
 for(const m of matches){
  const name=decode((m[1].match(/name=["']([^"']+)["']/i)?.[1]||'').trim());
  const value=decode((m[2]||'').replace(/<!\[CDATA\[|\]\]>/g,'').trim());
  if(name&&value)params[name]=value;
 }
 return params;
}

function guessCategory(name:string,params:Record<string,string>){
 const source=(name+' '+Object.values(params).join(' ')).toLowerCase();
 if(/переноск|авіасум|сумк|клітк|вольєр|транспорт/.test(source)) return 'Переноски';
 if(/лежак|диван|будиноч/.test(source)) return 'Лежаки';
 if(/шлея|повід|ошийн|амуніц/.test(source)) return 'Амуніція';
 if(/корм|fitmin|food|adult|puppy|kitten/.test(source)) return 'Корм';
 if(/іграш|м'яч|канат|puller|mouse|catnip/.test(source)) return 'Іграшки';
 if(/миска|поїлк/.test(source)) return 'Миски';
 if(/грумінг|шампун|догляд|спрей|щітк/.test(source)) return 'Догляд';
 return 'Інше';
}

export function parseZooBazaXml(xml:string):ZooBazaProduct[]{
 const offers=xml.match(/<offer\b[\s\S]*?<\/offer>/gi) || [];
 return offers.map((offer,index)=>{
   const id=attr(offer,'id') || tag(offer,'vendorCode') || String(index+1);
   const availableAttr=attr(offer,'available');
   const picture=tag(offer,'picture') || tag(offer,'image');
   const name=tag(offer,'name') || tag(offer,'model') || ('Товар '+id);
   const vendor=tag(offer,'vendor');
   const vendorCode=tag(offer,'vendorCode') || tag(offer,'article');
   const params=parseParams(offer);
   const color=Object.entries(params).find(([k])=>/колір|цвет|color/i.test(k))?.[1];
   return {
     externalId:id,
     name,
     price:number(tag(offer,'price')),
     oldPrice:number(tag(offer,'oldprice'))||undefined,
     currency:tag(offer,'currencyId')||'UAH',
     categoryId:tag(offer,'categoryId')||undefined,
     category:guessCategory(name,params),
     vendor:vendor||undefined,
     vendorCode:vendorCode||undefined,
     picture:picture||undefined,
     description:tag(offer,'description')||undefined,
     available:availableAttr ? !/false|0|no/i.test(availableAttr) : true,
     url:tag(offer,'url')||undefined,
     color:color||undefined,
     params
   }
 }).filter(p=>p.name && p.price>0);
}

export async function getZooBazaProducts(limit=120){
 const url=process.env.ZOOBAZA_FEED_URL || 'https://basmati.com.ua/zoobaza_full.php';
 const res=await fetch(url,{next:{revalidate:1800},headers:{'user-agent':'LAPKA/1.0 catalog-sync'}});
 if(!res.ok) throw new Error('Catalog feed HTTP '+res.status);
 const xml=await res.text();
 return parseZooBazaXml(xml).slice(0,limit);
}
