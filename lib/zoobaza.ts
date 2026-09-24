export type ZooBazaProduct = {
  externalId: string;
  name: string;
  price: number;
  b2bPrice?: number;
  oldPrice?: number;
  currency: string;
  categoryId?: string;
  category?: string;
  vendor?: string;
  vendorCode?: string;
  picture?: string;
  pictures?: string[];
  description?: string;
  available: boolean;
  url?: string;
  color?: string;
  groupId?: string;
  ean?: string;
  weight?: string;
  dimensions?: string;
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
const tags=(xml:string,name:string)=>[...xml.matchAll(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','gi'))].map(m=>decode((m[1]||'').trim())).filter(Boolean);
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

const param=(params:Record<string,string>,re:RegExp)=>Object.entries(params).find(([k])=>re.test(k))?.[1]||'';

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
   const pictures=[...new Set([...tags(offer,'picture'),...tags(offer,'image')])];
   const name=tag(offer,'name') || tag(offer,'model') || ('Товар '+id);
   const vendor=tag(offer,'vendor');
   const vendorCode=tag(offer,'vendorCode') || tag(offer,'article');
   const params=parseParams(offer);
   const color=param(params,/колір|цвет|color/i);
   const ean=tag(offer,'barcode')||tag(offer,'ean')||tag(offer,'EAN')||param(params,/ean|штрих|barcode/i);
   const groupId=attr(offer,'group_id')||tag(offer,'group_id')||tag(offer,'groupId');
   const weight=tag(offer,'weight')||param(params,/вага|вес|weight/i);
   const dimensions=tag(offer,'dimensions')||param(params,/габарит|розмір упаков|размер упаков|dimension/i);
   const publicPrice=number(tag(offer,'price'));
   const b2bCandidates=[
     tag(offer,'b2b_price'),tag(offer,'b2bPrice'),tag(offer,'purchase_price'),
     tag(offer,'dealer_price'),tag(offer,'wholesale_price'),
     param(params,/b2b|опт|закуп|ваша ціна|ваша цена/i)
   ].map(number).filter(Boolean);
   return {
     externalId:id,
     name,
     price:publicPrice,
     b2bPrice:b2bCandidates[0]||undefined,
     oldPrice:number(tag(offer,'oldprice'))||undefined,
     currency:tag(offer,'currencyId')||'UAH',
     categoryId:tag(offer,'categoryId')||undefined,
     category:guessCategory(name,params),
     vendor:vendor||undefined,
     vendorCode:vendorCode||undefined,
     picture:pictures[0],
     pictures,
     description:tag(offer,'description')||undefined,
     available:availableAttr ? !/false|0|no/i.test(availableAttr) : true,
     url:tag(offer,'url')||undefined,
     color:color||undefined,
     groupId:groupId||undefined,
     ean:ean||undefined,
     weight:weight||undefined,
     dimensions:dimensions||undefined,
     params
   }
 }).filter(p=>p.name && p.price>0);
}

export async function getZooBazaProducts(limit=120){
 const url=process.env.ZOOBAZA_FEED_URL || 'https://basmati.com.ua/zoobaza_drop_full.php';
 const res=await fetch(url,{next:{revalidate:10800},headers:{'user-agent':'LAPKA/1.0 catalog-sync'}});
 if(!res.ok) throw new Error('Catalog feed HTTP '+res.status);
 const xml=await res.text();
 return parseZooBazaXml(xml).slice(0,limit);
}
