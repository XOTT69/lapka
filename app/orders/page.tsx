'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {money,useStore} from '@/lib/store';

const labels:Record<string,string>={
 new:'Нове',
 awaiting_payment_details:'Очікує реквізити',
 payment_details_sent:'Реквізити надіслані',
 paid:'Оплачено',
 supplier_confirmed:'Підтверджено',
 processing:'В роботі',
 shipped:'Відправлено',
 completed:'Завершено',
 cancelled:'Скасовано'
};

type DbOrder={id:string;external_order_id:string;total:number;status:string;created_at:string;payment_method:string};

export default function Orders(){
 const {orders:localOrders}=useStore();
 const [dbOrders,setDbOrders]=useState<DbOrder[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{const s=createClient();if(!s){setLoading(false);return}s.auth.getUser().then(async({data})=>{if(!data.user){setLoading(false);return}const {data:rows}=await s.from('customer_orders').select('id,external_order_id,total,status,created_at,payment_method').order('created_at',{ascending:false});setDbOrders((rows||[]) as DbOrder[]);setLoading(false)})},[]);
 const rows=dbOrders.length?dbOrders:localOrders.map(o=>({id:o.id,external_order_id:o.id,total:o.total,status:o.status,created_at:o.createdAt,payment_method:''}));
 return <main className="wrap page narrow"><div className="pageIntro"><span className="eyebrow">Мій акаунт</span><h1>Мої замовлення</h1><p>Тут видно актуальний статус після оформлення.</p></div>{loading?<div className="empty">Завантажуємо…</div>:rows.length?rows.map(o=><div className="card orderCard modernOrderCard" key={o.id}><div><small>{new Date(o.created_at).toLocaleString('uk-UA')}</small><h3>{o.external_order_id}</h3><span>{labels[o.status]||o.status}</span>{o.payment_method==='bank_transfer'&&<p>Оплата за реквізитами</p>}</div><b>{money(Number(o.total))}</b></div>):<div className="empty"><h2>Замовлень ще немає</h2><Link className="primary" href="/catalog">Почати покупки</Link></div>}</main>
}
