'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {CheckCircle2,Clipboard,PackageCheck,RefreshCw,Save,ShieldCheck,Truck} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import {money} from '@/lib/store';

type OrderRow={id:string;external_order_id:string;total:number;status:string;payment_method:string;payment_status:string;payload:any;created_at:string;updated_at:string;fulfillment_mode?:string;np_ttn?:string|null;np_status?:string|null;np_status_code?:string|null;np_tracking_updated_at?:string|null};
type Draft={ttn:string;weight:string;seats:string;description:string};

const ORDER_STATUSES=[
 ['new','Нове'],['awaiting_payment_details','Очікує реквізити'],['payment_details_sent','Реквізити надіслані'],['paid','Оплачено'],
 ['supplier_confirmed','Підтверджено'],['processing','В роботі'],['shipped','Відправлено'],['completed','Завершено'],['cancelled','Скасовано']
] as const;

export default function AdminOrders(){
 const [orders,setOrders]=useState<OrderRow[]>([]),[loading,setLoading]=useState(true),[allowed,setAllowed]=useState<boolean|null>(null),[details,setDetails]=useState(''),[savingDetails,setSavingDetails]=useState(false),[copied,setCopied]=useState('');
 const [drafts,setDrafts]=useState<Record<string,Draft>>({}),[busy,setBusy]=useState(''),[message,setMessage]=useState('');
 const supabase=useMemo(()=>createClient(),[]);

 async function load(){
  if(!supabase){setAllowed(false);setLoading(false);return}
  const {data:{user}}=await supabase.auth.getUser();if(!user){setAllowed(false);setLoading(false);return}
  const {data:admin}=await supabase.from('admin_users').select('id').eq('id',user.id).maybeSingle();if(!admin){setAllowed(false);setLoading(false);return}
  setAllowed(true);
  const [{data:o},{data:s}]=await Promise.all([supabase.from('customer_orders').select('*').order('created_at',{ascending:false}),supabase.from('shop_settings').select('value').eq('key','payment_details').maybeSingle()]);
  setOrders((o||[]) as OrderRow[]);setDetails(s?.value||'');setLoading(false);
 }
 useEffect(()=>{load()},[]);

 const draft=(id:string)=>drafts[id]||{ttn:'',weight:'1',seats:'1',description:'Зоотовари'};
 const patch=(id:string,v:Partial<Draft>)=>setDrafts(d=>({...d,[id]:{...draft(id),...v}}));

 async function setStatus(id:string,status:string){if(!supabase)return;const payment_status=status==='paid'?'paid':status==='payment_details_sent'?'details_sent':undefined;await supabase.from('customer_orders').update({...payment_status?{payment_status}:{},status,updated_at:new Date().toISOString()}).eq('id',id);await load()}
 async function saveDetails(){if(!supabase)return;setSavingDetails(true);await supabase.from('shop_settings').upsert({key:'payment_details',value:details,updated_at:new Date().toISOString()});setSavingDetails(false)}
 async function copyPayment(o:OrderRow){const text=`Вітаємо! Замовлення ${o.external_order_id} підтверджено. Сума до оплати: ${money(Number(o.total))}.

Реквізити для оплати:
${details||'[Додайте реквізити в адмінці]'}

Після оплати надішліть, будь ласка, підтвердження. Дякуємо! — LAPKA`;await navigator.clipboard.writeText(text);setCopied(o.id);setTimeout(()=>setCopied(''),1800)}

 async function npAction(o:OrderRow,action:'attachTtn'|'track'|'createTtn'){
  setBusy(o.id+action);setMessage('');
  const d=draft(o.id);
  const body:any={action,orderId:o.id};
  if(action==='attachTtn')body.ttn=d.ttn;
  if(action==='createTtn'){body.weight=d.weight;body.seats=d.seats;body.description=d.description}
  const r=await fetch('/api/admin/nova-poshta',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const j=await r.json();
  setBusy('');
  if(!r.ok){setMessage((j.message||'Помилка Нової пошти')+' · '+o.external_order_id);return}
  setMessage(action==='createTtn'?'ТТН створено: '+j.ttn:action==='attachTtn'?'ТТН додано до замовлення.':'Статус ТТН оновлено.');
  await load();
 }

 if(loading)return <main className="wrap page"><div className="empty">Завантажуємо замовлення…</div></main>;
 if(!allowed)return <main className="wrap page narrow"><div className="empty"><ShieldCheck/><h2>Доступ лише для адміністратора</h2><Link className="primary" href="/account">До профілю</Link></div></main>;

 return <main className="wrap page adminOrdersPage">
  <div className="pageIntro adminOrdersHead"><div><span className="eyebrow">LAPKA Admin</span><h1>Замовлення</h1><p>Підтвердження, оплата, ТТН і доставка в одному місці.</p></div><Link className="secondary" href="/admin/shipping"><Truck size={17}/>Налаштувати Нову пошту</Link></div>
  <section className="card paymentSettings"><div><h2>Реквізити для оплати</h2><p>Кнопка нижче сформує готове повідомлення клієнту.</p></div><textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Реквізити для оплати"/><button className="primary" onClick={saveDetails} disabled={savingDetails}><Save size={17}/>{savingDetails?'Зберігаємо…':'Зберегти'}</button></section>
  {message&&<div className="formMessage adminMessage">{message}</div>}
  <div className="adminOrderList">{orders.length?orders.map(o=>{const c=o.payload?.customer||{},d=o.payload?.delivery||{},items=o.payload?.items||[],dr=draft(o.id);return <article className="card adminOrderCard" key={o.id}>
   <div className="adminOrderTop"><div><span>{new Date(o.created_at).toLocaleString('uk-UA')}</span><h2>{o.external_order_id}</h2><p>{c.name} · {c.phone} {c.email?'· '+c.email:''}</p></div><div className="adminOrderTotal">{money(Number(o.total))}</div></div>
   <div className="adminOrderMeta"><span><PackageCheck/> {d.city||'Місто'} · {d.warehouse||'Відділення'}</span><span>Оплата: {o.payment_method==='bank_transfer'?'за реквізитами':'при отриманні'}</span><span>Відправка: {o.fulfillment_mode==='own'?'власна':'партнерська'}</span></div>
   <div className="adminOrderItems">{items.map((i:any,idx:number)=><div key={idx}><span>{i.qty}× {i.name}</span><small>{i.sku||i.id}</small><b>{money(Number(i.price)*Number(i.qty))}</b></div>)}</div>
   <div className="shippingOrderBox">
    <div className="shippingOrderStatus"><b>Нова пошта</b>{o.np_ttn?<><a href={'https://novaposhta.ua/tracking/?cargo_number='+o.np_ttn} target="_blank" rel="noreferrer">ТТН {o.np_ttn}</a><span>{o.np_status||'Статус ще не отримано'}</span></>:<span>ТТН ще не додано</span>}</div>
    {!o.np_ttn?<div className="ttnAttach"><input value={dr.ttn} onChange={e=>patch(o.id,{ttn:e.target.value.replace(/\D/g,'')})} placeholder="Вставити ТТН від партнера"/><button className="secondary" disabled={busy===o.id+'attachTtn'} onClick={()=>npAction(o,'attachTtn')}>Додати ТТН</button></div>:<button className="secondary compactBtn" disabled={busy===o.id+'track'} onClick={()=>npAction(o,'track')}><RefreshCw size={15}/>Оновити статус</button>}
    {!o.np_ttn&&o.payment_method!=='cod'&&<details className="ownTtn"><summary>Створити власну ТТН</summary><div><label>Вага, кг<input value={dr.weight} onChange={e=>patch(o.id,{weight:e.target.value})}/></label><label>Місць<input value={dr.seats} onChange={e=>patch(o.id,{seats:e.target.value.replace(/\D/g,'')})}/></label><label>Опис<input value={dr.description} onChange={e=>patch(o.id,{description:e.target.value})}/></label><button className="primary" disabled={busy===o.id+'createTtn'} onClick={()=>npAction(o,'createTtn')}><Truck size={16}/>Створити ТТН</button></div></details>}
   </div>
   <div className="adminOrderActions"><select value={o.status} onChange={e=>setStatus(o.id,e.target.value)}>{ORDER_STATUSES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>{o.payment_method==='bank_transfer'&&<button className="secondary" onClick={()=>copyPayment(o)}><Clipboard size={16}/>{copied===o.id?'Скопійовано':'Копіювати реквізити'}</button>}{o.status==='completed'&&<span className="orderDone"><CheckCircle2 size={16}/>Завершено</span>}</div>
  </article>}):<div className="empty"><h2>Замовлень поки немає</h2></div>}</div>
 </main>
}