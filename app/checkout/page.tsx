'use client';
import {FormEvent,useState} from 'react';
import Link from 'next/link';
import {Minus,Plus,Trash2,CreditCard} from 'lucide-react';
import {money,useStore} from '@/lib/store';

export default function Checkout(){
 const {cart,total,setQty,remove,addOrder}=useStore();
 const [done,setDone]=useState<string|null>(null);
 const [loading,setLoading]=useState(false);
 const [payment,setPayment]=useState<'cod'|'mono'>('cod');
 const [error,setError]=useState('');

 const submit=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault(); if(!cart.length)return; setLoading(true); setError('');
  const fd=new FormData(e.currentTarget);
  const orderPayload={customer:Object.fromEntries(fd),items:cart.map(x=>({id:x.product.id,name:x.product.name,qty:x.qty,price:x.product.price})),total};
  const orderRes=await fetch('/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(orderPayload)});
  const order=await orderRes.json();
  if(!orderRes.ok){setError(order.error||'Не вдалося створити замовлення');setLoading(false);return}

  addOrder({id:order.orderId,createdAt:new Date().toISOString(),total,items:cart.reduce((s,x)=>s+x.qty,0),status:payment==='mono'?'Очікує оплату':'Прийнято'});

  if(payment==='mono'){
   const payRes=await fetch('/api/payments/mono',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({orderId:order.orderId,amount:total,items:orderPayload.items})});
   const pay=await payRes.json();
   if(payRes.ok&&pay.pageUrl){location.href=pay.pageUrl;return}
   setError(pay.message||pay.error||'Онлайн-оплата ще не активована. Додайте merchant token.');
   setLoading(false);return;
  }

  setDone(order.orderId); setLoading(false);
 };

 if(done)return <main className="wrap page narrow"><div className="success"><span>🎉</span><h1>Замовлення прийнято</h1><p>Номер: <b>{done}</b></p><Link className="primary" href="/orders">Переглянути замовлення</Link></div></main>;

 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">Оформлення</span><h1>Кошик і доставка</h1></div>{!cart.length?<div className="empty"><h2>Кошик порожній</h2><Link className="primary" href="/catalog">До каталогу</Link></div>:<div className="checkoutGrid"><section className="card"><h2>Ваші товари</h2>{cart.map(i=><div className="checkoutLine" key={i.product.id}><div className="mini">{i.product.emoji}</div><div><b>{i.product.name}</b><small>{i.product.brand}</small><span>{money(i.product.price)}</span></div><div className="counter"><button onClick={()=>setQty(i.product.id,i.qty-1)}><Minus size={14}/></button><b>{i.qty}</b><button onClick={()=>setQty(i.product.id,i.qty+1)}><Plus size={14}/></button></div><button className="trash" onClick={()=>remove(i.product.id)}><Trash2 size={17}/></button></div>)}<div className="orderTotal"><span>Разом</span><b>{money(total)}</b></div></section><form className="card form" onSubmit={submit}><h2>Контакти</h2><label>Імʼя<input name="name" required/></label><label>Телефон<input name="phone" required placeholder="+380…"/></label><label>Email<input name="email" type="email" required/></label><h2>Доставка</h2><label>Місто<input name="city" required placeholder="Київ"/></label><label>Відділення / поштомат<input name="warehouse" required placeholder="Відділення №…"/></label><h2>Оплата</h2><label className="radio"><input type="radio" checked={payment==='cod'} onChange={()=>setPayment('cod')}/> Оплата при отриманні</label><label className="radio"><input type="radio" checked={payment==='mono'} onChange={()=>setPayment('mono')}/> <CreditCard size={17}/> Онлайн через mono</label>{error&&<div className="match">{error}</div>}<button disabled={loading} className="primary" type="submit">{loading?'Обробляємо…':payment==='mono'?'Перейти до оплати':'Підтвердити замовлення'}</button></form></div>}</main>
}
