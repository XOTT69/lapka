import {getZooBazaProducts} from '@/lib/zoobaza';

export const dynamic='force-dynamic';

export async function GET(){
 try{
   const products=await getZooBazaProducts(200);
   return Response.json({
     ok:true,
     supplier:'ZooBaza',
     source:'XML',
     syncedAt:new Date().toISOString(),
     count:products.length,
     products
   });
 }catch(error){
   return Response.json({
     ok:false,
     supplier:'ZooBaza',
     error:error instanceof Error?error.message:'Unknown feed error'
   },{status:502});
 }
}
