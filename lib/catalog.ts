export type CatalogProduct={
 externalId:string; sku:string; name:string; brand?:string; category?:string; categoryId?:string;
 price:number; oldPrice?:number; available:boolean; description?:string; picture?:string; pictures:string[];
 ean?:string; groupId?:string; weight?:string; dimensions?:string; color?:string; params:Record<string,string>;
};

export type CatalogFacets={categories:string[];brands:string[];colors:string[];minPrice:number;maxPrice:number};
export type CatalogQuery={q?:string;category?:string;brand?:string;color?:string;min?:number;max?:number;available?:boolean;sort?:string;limit?:number;offset?:number};

const URL=process.env.NEXT_PUBLIC_SUPABASE_URL||'https://sulidxtbtblhkhwvggzy.supabase.co';
const KEY=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_UZRENjCh8MgcoU6HleYS4w_F8UrDSGo';
const headers={apikey:KEY,Authorization:'Bearer '+KEY};

const clean=(v:string)=>v.replace(/[,*()%]/g,' ').trim();

export function mapCatalogRow(r:any):CatalogProduct{
 return {
  externalId:String(r.external_id||''),sku:String(r.sku||r.external_id||''),name:String(r.name||''),
  brand:r.brand||undefined,category:r.category||undefined,categoryId:r.category_id||undefined,
  price:Number(r.price||0),oldPrice:r.old_price?Number(r.old_price):undefined,available:Boolean(r.available),
  description:r.description||undefined,picture:r.image_url||undefined,pictures:Array.isArray(r.images)?r.images.filter(Boolean):[],
  ean:r.ean||undefined,groupId:r.group_id||undefined,weight:r.weight||undefined,dimensions:r.dimensions||undefined,
  color:r.color||undefined,params:r.params&&typeof r.params==='object'?r.params:{}
 };
}

export async function getCatalogProducts(query:CatalogQuery={}){
 const p=new URLSearchParams();
 p.set('select','*');
 if(query.available!==false)p.set('available','eq.true');
 if(query.category)p.set('category','eq.'+query.category);
 if(query.brand)p.set('brand','eq.'+query.brand);
 if(query.color)p.set('color','eq.'+query.color);
 if(query.min!=null)p.set('price','gte.'+query.min);
 if(query.max!=null)p.append('price','lte.'+query.max);
 if(query.q){
  const q=clean(query.q);
  if(q)p.set('or',`(name.ilike.*${q}*,sku.ilike.*${q}*,brand.ilike.*${q}*,ean.ilike.*${q}*,external_id.ilike.*${q}*)`);
 }
 const sort=query.sort==='price-asc'?'price.asc':query.sort==='price-desc'?'price.desc':query.sort==='name'?'name.asc':'available.desc,updated_at.desc';
 p.set('order',sort);
 p.set('limit',String(query.limit??48));
 p.set('offset',String(query.offset??0));
 const res=await fetch(URL+'/rest/v1/catalog_products?'+p.toString(),{headers:{...headers,Prefer:'count=exact'},next:{revalidate:120}});
 if(!res.ok)throw new Error('Catalog DB '+res.status);
 const rows=await res.json();
 const range=res.headers.get('content-range')||'';
 const total=Number(range.split('/')[1]||rows.length);
 return {items:(rows as any[]).map(mapCatalogRow),total:Number.isFinite(total)?total:rows.length};
}

export async function getCatalogFacets():Promise<CatalogFacets>{
 const res=await fetch(URL+'/rest/v1/rpc/catalog_facets',{method:'POST',headers:{...headers,'content-type':'application/json'},body:'{}',cache:'no-store'});
 if(!res.ok)return {categories:[],brands:[],colors:[],minPrice:0,maxPrice:0};
 const j=await res.json();
 return {categories:j.categories||[],brands:j.brands||[],colors:j.colors||[],minPrice:Number(j.minPrice||0),maxPrice:Number(j.maxPrice||0)};
}

async function getOne(field:'external_id'|'sku',value:string){
 const p=new URLSearchParams({select:'*',[field]:'eq.'+value,limit:'1'});
 const res=await fetch(URL+'/rest/v1/catalog_products?'+p.toString(),{headers,next:{revalidate:120}});
 if(!res.ok)return null;
 const rows=await res.json();
 return rows?.[0]?mapCatalogRow(rows[0]):null;
}
export async function getCatalogProduct(ref:string){return await getOne('external_id',ref)||await getOne('sku',ref)}

export async function getCatalogVariants(groupId?:string,exclude?:string){
 if(!groupId)return [];
 const p=new URLSearchParams({select:'*',group_id:'eq.'+groupId,available:'eq.true',order:'price.asc',limit:'30'});
 const res=await fetch(URL+'/rest/v1/catalog_products?'+p.toString(),{headers,next:{revalidate:120}});
 if(!res.ok)return [];
 const rows=(await res.json()) as any[];
 return rows.map(mapCatalogRow).filter(x=>x.externalId!==exclude);
}

export async function getRelatedProducts(category?:string,exclude?:string){
 if(!category)return [];
 const p=new URLSearchParams({select:'*',category:'eq.'+category,available:'eq.true',order:'updated_at.desc',limit:'8'});
 const res=await fetch(URL+'/rest/v1/catalog_products?'+p.toString(),{headers,next:{revalidate:120}});
 if(!res.ok)return [];
 const rows=(await res.json()) as any[];
 return rows.map(mapCatalogRow).filter(x=>x.externalId!==exclude).slice(0,6);
}
