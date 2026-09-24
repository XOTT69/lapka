import {createClient} from '@/lib/supabase/server';

async function np(apiKey:string,ttn:string,phone:string){
 const r=await fetch('https://api.novaposhta.ua/v2.0/json/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({apiKey,modelName:'TrackingDocument',calledMethod:'getStatusDocuments',methodProperties:{Documents:[{DocumentNumber:ttn,Phone:phone.replace(/\D/g,'')}]}}),cache:'no-store'});
 if(!r.ok)throw new Error('Nova Poshta HTTP '+r.status);
 const j=await r.json();if(!j.success)throw new Error((j.errors||[]).join(', ')||'Nova Poshta error');return j.data?.[0]||{};
}
export async function POST(req:Request){
 try{
  const key=process.env.NOVA_POSHTA_API_KEY;if(!key)return Response.json({ok:false,message:'Tracking unavailable'},{status:503});
  const supabase=await createClient();if(!supabase)return Response.json({ok:false},{status:503});
  const {data:{user}}=await supabase.auth.getUser();if(!user)return Response.json({ok:false},{status:401});
  const {orderId}=await req.json();
  const {data:o}=await supabase.from('customer_orders').select('id,user_id,status,np_ttn,payload').eq('id',String(orderId||'')).eq('user_id',user.id).maybeSingle();
  if(!o||!o.np_ttn)return Response.json({ok:false,message:'No TTN'},{status:404});
  const x=await np(key,o.np_ttn,String(o.payload?.customer?.phone||''));
  const code=String(x.StatusCode||''),status=String(x.Status||'');
  const orderStatus=['9','10','11'].includes(code)?'completed':['7','8','101'].includes(code)?'shipped':o.status;
  await supabase.rpc('update_my_order_tracking',{p_order_id:o.id,p_np_status:status,p_np_status_code:code});
  return Response.json({ok:true,status,statusCode:code});
 }catch(e){return Response.json({ok:false,message:e instanceof Error?e.message:'Tracking error'},{status:500})}
}
