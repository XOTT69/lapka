import {getCatalogProducts} from '@/lib/catalog';

export async function GET(req:Request){
 const u=new URL(req.url),s=u.searchParams;
 try{
  const result=await getCatalogProducts({
   q:s.get('q')||undefined,category:s.get('category')||undefined,brand:s.get('brand')||undefined,color:s.get('color')||undefined,
   min:s.get('min')?Number(s.get('min')):undefined,max:s.get('max')?Number(s.get('max')):undefined,
   available:s.get('available')!=='false',sort:s.get('sort')||undefined,
   limit:Math.min(Number(s.get('limit')||48),60),offset:Math.max(Number(s.get('offset')||0),0)
  });
  return Response.json(result,{headers:{'cache-control':'public, s-maxage=60, stale-while-revalidate=300'}});
 }catch(e){return Response.json({items:[],total:0,error:e instanceof Error?e.message:'Catalog error'},{status:500})}
}
