export type ZooBazaProduct = {
  externalId: string;
  name: string;
  price: number;
  oldPrice?: number;
  currency: string;
  categoryId?: string;
  vendor?: string;
  vendorCode?: string;
  picture?: string;
  description?: string;
  available: boolean;
  url?: string;
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

export function parseZooBazaXml(xml:string):ZooBazaProduct[]{
 const offers=xml.match(/<offer\b[\s\S]*?<\/offer>/gi) || [];
 return offers.map((offer,index)=>{
   const id=attr(offer,'id') || tag(offer,'vendorCode') || String(index+1);
   const availableAttr=attr(offer,'available');
   const picture=tag(offer,'picture') || tag(offer,'image');
   const name=tag(offer,'name') || tag(offer,'model') || ('Товар '+id);
   const vendor=tag(offer,'vendor');
   const vendorCode=tag(offer,'vendorCode') || tag(offer,'article');
   return {
     externalId:id,
     name,
     price:number(tag(offer,'price')),
     oldPrice:number(tag(offer,'oldprice'))||undefined,
     currency:tag(offer,'currencyId')||'UAH',
     categoryId:tag(offer,'categoryId')||undefined,
     vendor:vendor||undefined,
     vendorCode:vendorCode||undefined,
     picture:picture||undefined,
     description:tag(offer,'description')||undefined,
     available:availableAttr ? !/false|0|no/i.test(availableAttr) : true,
     url:tag(offer,'url')||undefined,
   }
 }).filter(p=>p.name && p.price>0);
}

export async function getZooBazaProducts(limit=120){
 const url=process.env.ZOOBAZA_FEED_URL || 'https://basmati.com.ua/zoobaza_full.php';
 const res=await fetch(url,{next:{revalidate:1800},headers:{'user-agent':'LAPKA/1.0 supplier-sync'}});
 if(!res.ok) throw new Error('ZooBaza feed HTTP '+res.status);
 const xml=await res.text();
 return parseZooBazaXml(xml).slice(0,limit);
}
