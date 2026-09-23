import ExcelJS from 'exceljs';

export type ZooBazaPriceRow={
  sku:string;
  name:string;
  b2b:number;
  rrp:number;
  profit:number;
  markupPercent:number;
  image?:string;
  productUrl?:string;
};

const PRICE_URL='https://basmati.com.ua/rozsylka/zoobaza_price_dropship.xlsx';

const text=(v:unknown)=>{
 if(v==null)return '';
 if(typeof v==='object' && 'text' in (v as any)) return String((v as any).text||'');
 if(typeof v==='object' && 'result' in (v as any)) return String((v as any).result||'');
 return String(v).trim();
};
const num=(v:unknown)=>{
 const n=Number(text(v).replace(/[^\d,.-]/g,'').replace(',','.'));
 return Number.isFinite(n)?n:0;
};
const key=(v:unknown)=>text(v).toLowerCase().replace(/\s+/g,' ');

export async function getZooBazaPriceRows(limit=1000){
 const res=await fetch(PRICE_URL,{next:{revalidate:1800},headers:{'user-agent':'LAPKA/1.0 pricing-sync'}});
 if(!res.ok) throw new Error('ZooBaza price XLSX HTTP '+res.status);
 const ab=await res.arrayBuffer();

 const wb=new ExcelJS.Workbook();
 await wb.xlsx.load(Buffer.from(ab));
 const ws=wb.worksheets[0];
 if(!ws) return [];

 let headerRow=1;
 let headers:string[]=[];
 for(let r=1;r<=Math.min(ws.rowCount,15);r++){
   const vals=(ws.getRow(r).values as unknown[]).slice(1).map(key);
   const joined=vals.join(' ');
   if(/(ррц|b2b|ціна|цена|артикул|sku)/i.test(joined)){
     headerRow=r; headers=vals; break;
   }
 }
 if(!headers.length) headers=(ws.getRow(headerRow).values as unknown[]).slice(1).map(key);

 const find=(patterns:RegExp[])=>headers.findIndex(h=>patterns.some(p=>p.test(h)));
 const skuI=find([/артикул/,/\bsku\b/,/код товар/]);
 const nameI=find([/назв/,/наимен/,/товар/]);
 const b2bI=find([/\bb2b\b/,/ваша ціна/,/ваша цена/,/закуп/,/опт/]);
 const rrpI=find([/ррц/,/роздріб/,/рознич/,/рекоменд/]);
 const profitI=find([/зароб/,/прибут/,/доход/,/марж.*грн/]);
 const percentI=find([/%/,/відсот/,/процент/,/марж.*%/]);
 const imageI=find([/фото/,/image/,/picture/]);
 const urlI=find([/посилан.*товар/,/ссылка.*товар/,/url/,/сторінк/]);

 const out:ZooBazaPriceRow[]=[];
 for(let r=headerRow+1;r<=ws.rowCount && out.length<limit;r++){
   const vals=(ws.getRow(r).values as unknown[]).slice(1);
   const name=nameI>=0?text(vals[nameI]):'';
   const sku=skuI>=0?text(vals[skuI]):'';
   if(!name&&!sku) continue;
   const b2b=b2bI>=0?num(vals[b2bI]):0;
   const rrp=rrpI>=0?num(vals[rrpI]):0;
   const profit=profitI>=0?num(vals[profitI]):Math.max(0,rrp-b2b);
   const markupPercent=percentI>=0?num(vals[percentI]):(b2b>0?profit/b2b*100:0);
   out.push({
     sku,name,b2b,rrp,profit,markupPercent,
     image:imageI>=0?text(vals[imageI])||undefined:undefined,
     productUrl:urlI>=0?text(vals[urlI])||undefined:undefined
   });
 }
 return out;
}
