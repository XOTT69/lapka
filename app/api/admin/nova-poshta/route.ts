import {createClient} from '@/lib/supabase/server';

type AnyObj=Record<string,any>;
const NP_URL='https://api.novaposhta.ua/v2.0/json/';

async function np(apiKey:string,modelName:string,calledMethod:string,methodProperties:AnyObj){
 const r=await fetch(NP_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({apiKey,modelName,calledMethod,methodProperties}),cache:'no-store'});
 if(!r.ok)throw new Error('Nova Poshta HTTP '+r.status);
 const j=await r.json();
 if(!j.success)throw new Error((j.errors||[]).join(', ')||'Nova Poshta API error');
 return j;
}
const phone=(v:string)=>{let x=String(v||'').replace(/\D/g,'');if(x.startsWith('0'))x='38'+x;return x};
const uaDate=()=>new Intl.DateTimeFormat('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Kyiv'}).format(new Date());

async function adminContext(){
 const supabase=await createClient();if(!supabase)return null;
 const {data:{user}}=await supabase.auth.getUser();if(!user)return null;
 const {data:admin}=await supabase.from('admin_users').select('id').eq('id',user.id).maybeSingle();
 if(!admin)return null;
 return {supabase,user};
}
async function settingsMap(supabase:any){
 const {data}=await supabase.from('shop_settings').select('key,value').in('key',['np_sender_ref','np_sender_contact_ref','np_sender_address_ref','np_sender_city_ref','np_sender_phone']);
 return Object.fromEntries((data||[]).map((x:any)=>[x.key,x.value||'']));
}
async function trackAndSave(supabase:any,apiKey:string,order:any,ttn:string){
 const customer=order.payload?.customer||{};
 const raw=await np(apiKey,'TrackingDocument','getStatusDocuments',{Documents:[{DocumentNumber:ttn,Phone:phone(customer.phone||'')}]});
 const x=raw.data?.[0]||{};
 const status=String(x.Status||'');
 const statusCode=String(x.StatusCode||'');
 const estimated=x.ScheduledDeliveryDate?new Date(x.ScheduledDeliveryDate):null;
 const mapped=['9','10','11'].includes(statusCode)?'completed':['7','8','101'].includes(statusCode)?'shipped':order.status;
 await supabase.from('customer_orders').update({
  np_ttn:ttn,np_status:status||null,np_status_code:statusCode||null,np_tracking_updated_at:new Date().toISOString(),
  np_estimated_delivery:estimated&&!Number.isNaN(estimated.getTime())?estimated.toISOString():null,
  ...(mapped!==order.status?{status:mapped}:{}),
  updated_at:new Date().toISOString()
 }).eq('id',order.id);
 return {ttn,status,statusCode,estimatedDelivery:x.ScheduledDeliveryDate||null};
}

export async function POST(req:Request){
 try{
  const ctx=await adminContext();if(!ctx)return Response.json({ok:false,message:'Forbidden'},{status:403});
  const {supabase}=ctx,apiKey=process.env.NOVA_POSHTA_API_KEY;
  if(!apiKey)return Response.json({ok:false,message:'NOVA_POSHTA_API_KEY не налаштований.'},{status:503});
  const body=await req.json(),action=String(body.action||'');

  if(action==='senderOptions'){
   const raw=await np(apiKey,'Counterparty','getCounterparties',{CounterpartyProperty:'Sender',Page:'1'});
   const senders=[];
   for(const s of (raw.data||[]).slice(0,8)){
    const [contacts,addresses]=await Promise.all([
     np(apiKey,'Counterparty','getCounterpartyContactPersons',{Ref:s.Ref,Page:'1'}).catch(()=>({data:[]})),
     np(apiKey,'Counterparty','getCounterpartyAddresses',{Ref:s.Ref,Page:'1'}).catch(()=>({data:[]}))
    ]);
    senders.push({ref:s.Ref,name:s.Description||s.CounterpartyFullName||'Відправник',cityRef:s.City||s.CityRef||'',city:s.CityDescription||'',contacts:(contacts.data||[]).map((x:any)=>({ref:x.Ref,name:x.Description||[x.LastName,x.FirstName,x.MiddleName].filter(Boolean).join(' '),phone:x.Phones||x.Phone||''})),addresses:(addresses.data||[]).map((x:any)=>({ref:x.Ref,address:x.Description||x.AddressDescription||x.ShortAddress||'',cityRef:x.CityRef||s.City||s.CityRef||''}))});
   }
   return Response.json({ok:true,senders,configured:await settingsMap(supabase)});
  }

  if(action==='saveSender'){
   const vals:Record<string,string>={
    np_sender_ref:String(body.senderRef||''),np_sender_contact_ref:String(body.contactRef||''),np_sender_address_ref:String(body.addressRef||''),
    np_sender_city_ref:String(body.cityRef||''),np_sender_phone:phone(String(body.senderPhone||''))
   };
   if(!vals.np_sender_ref||!vals.np_sender_contact_ref||!vals.np_sender_address_ref||!vals.np_sender_city_ref||!vals.np_sender_phone)return Response.json({ok:false,message:'Заповни всі дані відправника.'},{status:400});
   const rows=Object.entries(vals).map(([key,value])=>({key,value}));
   const {error}=await supabase.from('shop_settings').upsert(rows);
   if(error)throw error;
   return Response.json({ok:true});
  }

  const orderId=String(body.orderId||'');
  const {data:order,error}=await supabase.from('customer_orders').select('*').eq('id',orderId).single();
  if(error||!order)return Response.json({ok:false,message:'Замовлення не знайдено.'},{status:404});

  if(action==='attachTtn'){
   const ttn=String(body.ttn||'').replace(/\D/g,'');
   if(ttn.length<10)return Response.json({ok:false,message:'Перевір номер ТТН.'},{status:400});
   const tracked=await trackAndSave(supabase,apiKey,order,ttn);
   return Response.json({ok:true,...tracked});
  }

  if(action==='track'){
   if(!order.np_ttn)return Response.json({ok:false,message:'ТТН ще не додано.'},{status:400});
   const tracked=await trackAndSave(supabase,apiKey,order,order.np_ttn);
   return Response.json({ok:true,...tracked});
  }

  if(action==='createTtn'){
   if(order.payment_method==='cod')return Response.json({ok:false,message:'Автостворення післяплати поки не вмикаємо: для неї потрібна коректно налаштована послуга грошового переказу в акаунті Нової пошти. Для таких замовлень використовуй ТТН постачальника або створи її в кабінеті НП.'},{status:400});
   const settings=await settingsMap(supabase);
   if(!settings.np_sender_ref||!settings.np_sender_contact_ref||!settings.np_sender_address_ref||!settings.np_sender_city_ref||!settings.np_sender_phone)return Response.json({ok:false,message:'Спочатку налаштуй відправника Нової пошти в адмінці.'},{status:400});
   const customer=order.payload?.customer||{},delivery=order.payload?.delivery||{};
   if(!delivery.cityRef||!delivery.warehouseRef||!customer.phone||!customer.name)return Response.json({ok:false,message:'У замовленні бракує даних отримувача або відділення.'},{status:400});

   const recRaw=await np(apiKey,'Counterparty','getCounterparties',{CounterpartyProperty:'Recipient',FindByString:'Приватна особа',Page:'1'});
   const recipient=recRaw.data?.[0]?.Ref;
   if(!recipient)return Response.json({ok:false,message:'Нова пошта не повернула контрагента отримувача.'},{status:502});

   const weight=Math.max(.1,Number(body.weight||1));
   const seats=Math.max(1,Math.round(Number(body.seats||1)));
   const description=String(body.description||'Зоотовари').slice(0,100);
   const props:AnyObj={
    NewAddress:'1',PayerType:'Recipient',PaymentMethod:'Cash',DateTime:uaDate(),CargoType:'Parcel',
    Weight:String(weight),ServiceType:'WarehouseWarehouse',SeatsAmount:String(seats),Description:description,
    Cost:String(Math.max(1,Math.round(Number(order.total)||1))),
    CitySender:settings.np_sender_city_ref,Sender:settings.np_sender_ref,SenderAddress:settings.np_sender_address_ref,
    ContactSender:settings.np_sender_contact_ref,SendersPhone:settings.np_sender_phone,
    CityRecipient:String(delivery.cityRef),Recipient:recipient,RecipientAddress:String(delivery.warehouseRef),
    RecipientName:String(customer.name),RecipientType:'PrivatePerson',RecipientsPhone:phone(String(customer.phone))
   };
   const raw=await np(apiKey,'InternetDocument','save',props);
   const doc=raw.data?.[0]||{},ttn=String(doc.IntDocNumber||'');
   if(!ttn)return Response.json({ok:false,message:'Нова пошта не повернула номер ТТН.'},{status:502});
   await supabase.from('customer_orders').update({fulfillment_mode:'own',np_ttn:ttn,np_ttn_ref:doc.Ref||null,np_status:'Створено ТТН',np_status_code:'1',np_tracking_updated_at:new Date().toISOString(),status:'processing',updated_at:new Date().toISOString()}).eq('id',order.id);
   return Response.json({ok:true,ttn,ref:doc.Ref||null,cost:doc.CostOnSite||null,estimatedDelivery:doc.EstimatedDeliveryDate||null});
  }

  return Response.json({ok:false,message:'Unknown action'},{status:400});
 }catch(e){return Response.json({ok:false,message:e instanceof Error?e.message:'Nova Poshta error'},{status:500})}
}
