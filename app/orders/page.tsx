'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ExternalLink,PackageSearch} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import {money,useStore} from '@/lib/store';

const labels:Record<string,string>={new:'Нове',awaiting_payment_details:'Очікує реквізити',payment_details_sent:'Реквізити надіслані',paid:'Оплачено',supplier_confirmed:'Підтверджено',processing:'В роботі',shipped:'Відправлено',completed:'Завершено',cancelled:'Скасовано'};
type DbOrder={id:string;external_order_id:string;total:number;status:string;created_at:string;payment_method:string;np_ttn?:string|null;np_status?:string|null;np_tracking_updated_at?:string|null};

export default function Orders(){
 const {orders:localOrders}=useStore();const [dbOrders,setDbOrders]=useState<DbOrder[]>([]),[loading,setLoading]=useState(true);
 async function load(){
  const s=createClient();if(!s){setLoading(false);return}
  const {data}=await s.auth.getUser();if(!data.user){setLoading(false);return}
  const {data:rows}=await s.from('customer_orders').select('id,external_order_id,total,status,created_at,payment_method,np_ttn,np_status,np_tracking_updated_at').order('created_at',{ascending:false});
  const list=(rows||[]) as DbOrder[];setDbOrders(list);setLoading(false);
  const track=list.filter(x=>x.np_ttn).slice(0,8);
  if(track.length){
   const settled=await Promise.all(track.map(async o=>{
    try{
     const r=await fetch('/api/orders/tracking',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({orderId:o.id})});
     const j=await r.json();return r.ok?{id:o.id,...j}:null;
    }catch{return null}
   }));
   setDbOrders(current=>current.map(o=>{
    const t=settled.find(x=>x?.id===o.id);
    if(!t)return o;
    const nextStatus=['9','10','11'].includes(String(t.statusCode))?'completed':['102','103','108'].includes(String(t.statusCode))?'cancelled':['7','8','101'].includes(String(t.statusCode))?'shipped':o.status;
    return {...o,status:nextStatus,np_status:t.status||o.np_status,np_tracking_updated_at:t.trackingUpdatedAt||o.np_tracking_updated_at};
   }));
  }
 }
 useEffect(()=>{load()},[]);
 const rows:DbOrder[]=dbOrders.length?dbOrders:localOrders.map(o=>({id:o.id,external_order_id:o.id,total:o.total,status:o.status,created_at:o.createdAt,payment_method:'',np_ttn:null,np_status:null,np_tracking_updated_at:null}));
 return <main className="wrap page narrow"><div className="pageIntro"><span className="eyebrow">Мій акаунт</span><h1>Мої замовлення</h1><p>Статус оплати й доставки оновлюється тут.</p></div>{loading?<div className="empty">Завантажуємо…</div>:rows.length?rows.map(o=><article className="card orderCard customerOrderCard" key={o.id}><div className="customerOrderTop"><div><small>{new Date(o.created_at).toLocaleString('uk-UA')}</small><h3>{o.external_order_id}</h3><span>{labels[o.status]||o.status}</span>{o.payment_method==='bank_transfer'&&<p>Оплата за реквізитами</p>}</div><b>{money(Number(o.total))}</b></div>{o.np_ttn&&<div className="customerTracking"><PackageSearch size={18}/><div><b>Нова пошта · {o.np_ttn}</b><span>{o.np_status||'Відстеження активне'}{o.np_tracking_updated_at?' · оновлено '+new Date(o.np_tracking_updated_at).toLocaleString('uk-UA',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):''}</span></div><a href={'https://novaposhta.ua/tracking/?cargo_number='+o.np_ttn} target="_blank" rel="noreferrer">Відстежити <ExternalLink size={13}/></a></div>}</article>):<div className="empty"><h2>Замовлень ще немає</h2><Link className="primary" href="/catalog">Почати покупки</Link></div>}</main>
}
