import {getZooBazaPriceRows} from '@/lib/zoobaza-pricing';
export const dynamic='force-dynamic';
export async function GET(){
 try{
  const rows=await getZooBazaPriceRows(1200);
  return Response.json({ok:true,supplier:'ZooBaza',count:rows.length,syncedAt:new Date().toISOString(),rows});
 }catch(error){
  return Response.json({ok:false,error:error instanceof Error?error.message:'Pricing import error'},{status:502});
 }
}
