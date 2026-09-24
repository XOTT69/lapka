import {createClient} from '@/lib/supabase/server';

export async function POST(req:Request){
 try{
  const body=await req.json();
  if(!body?.customer?.name||!body?.customer?.phone||!Array.isArray(body?.items)||!body.items.length)return Response.json({error:'Заповніть контактні дані та додайте товари.'},{status:400});
  const supabase=await createClient();
  if(!supabase)return Response.json({error:'Сервіс замовлень недоступний.'},{status:503});
  const {data:{user}}=await supabase.auth.getUser();
  const orderId='LP-'+Date.now().toString().slice(-8);
  const paymentMethod=body.paymentMethod==='cod'?'cod':'bank_transfer';
  const payload={customer:body.customer,delivery:body.delivery,items:body.items};
  const {error}=await supabase.from('customer_orders').insert({
    user_id:user?.id||null,
    external_order_id:orderId,
    total:Number(body.total)||0,
    status:'new',
    payment_method:paymentMethod,
    payment_status:paymentMethod==='bank_transfer'?'awaiting_details':'cod',
    payload
  });
  if(error)return Response.json({error:'Не вдалося зберегти замовлення.'},{status:500});
  return Response.json({ok:true,orderId,status:'new',paymentMethod});
 }catch{return Response.json({error:'Некоректний запит'},{status:400})}
}
