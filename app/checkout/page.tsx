'use client';
import {FormEvent,useState} from 'react';
import Link from 'next/link';
import {Building2,Minus,Plus,Trash2,Truck,WalletCards} from 'lucide-react';
import {money,useStore} from '@/lib/store';
import NovaPoshtaPicker from '@/components/nova-poshta-picker';

export default function Checkout(){
 const {cart,total,setQty,remove,addOrder}=useStore();
 const [done,setDone]=useState<{id:string;method:'cod'|'bank_transfer'}|null>(null),[loading,setLoading]=useState(false),[payment,setPayment]=useState<'cod'|'bank_transfer'>('bank_transfer'),[error,setError]=useState('');

 const submit=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();if(!cart.length)return;setLoading(true);setError('');
  const fd=new FormData(e.currentTarget);
  if(!fd.get('cityRef')||!fd.get('warehouseRef')){setError('Обери місто та відділення Нової пошти зі списку.');setLoading(false);return}
  const orderPayload={customer:Object.fromEntries(fd),delivery:{provider:'nova-poshta',cityRef:fd.get('cityRef'),warehouseRef:fd.get('warehouseRef'),city:fd.get('city'),warehouse:fd.get('warehouse')},paymentMethod:payment,items:cart.map(x=>({id:x.product.id,sku:x.product.slug,name:x.product.name,qty:x.qty,price:x.product.price})),total};
  const orderRes=await fetch('/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(orderPayload)});
  const order=await orderRes.json();
  if(!orderRes.ok){setError(order.error||'Не вдалося створити замовлення');setLoading(false);return}
  addOrder({id:order.orderId,createdAt:new Date().toISOString(),total,items:cart.reduce((s,x)=>s+x.qty,0),status:payment==='bank_transfer'?'Очікує реквізити':'Прийнято'});
  setDone({id:order.orderId,method:payment});setLoading(false);
 };

 if(done)return <main className="wrap page narrow"><div className="orderSuccess card"><div className="successIcon">✓</div><span className="eyebrow">Замовлення оформлено</span><h1>Дякуємо за замовлення</h1><p>Номер: <b>{done.id}</b></p>{done.method==='bank_transfer'?<div className="paymentNext"><Building2/><div><b>Оплата за реквізитами</b><span>Ми перевіримо наявність товарів і надішлемо реквізити для оплати на вказані контакти. Не оплачуй нічого до підтвердження.</span></div></div>:<div className="paymentNext"><WalletCards/><div><b>Оплата при отриманні</b><span>Після підтвердження наявності замовлення буде передано в роботу.</span></div></div>}<Link className="primary" href="/orders">Мої замовлення</Link></div></main>;

 return <main className="wrap page checkoutPage"><div className="pageIntro compactIntro"><span className="eyebrow">Оформлення</span><h1>Завершення замовлення</h1><p>Контакти, доставка та спосіб оплати.</p></div>{!cart.length?<div className="empty"><h2>Кошик порожній</h2><Link className="primary" href="/catalog">Перейти до каталогу</Link></div>:<div className="checkoutGrid">
 <section className="card checkoutCart"><div className="checkoutCardHead"><h2>Ваше замовлення</h2><span>{cart.reduce((s,x)=>s+x.qty,0)} товарів</span></div>{cart.map(i=><div className="checkoutLine" key={i.product.id}><div className="mini">{i.product.emoji}</div><div><b>{i.product.name}</b><small>{i.product.brand}</small><span>{money(i.product.price)}</span></div><div className="counter"><button type="button" onClick={()=>setQty(i.product.id,i.qty-1)}><Minus size={14}/></button><b>{i.qty}</b><button type="button" onClick={()=>setQty(i.product.id,i.qty+1)}><Plus size={14}/></button></div><button type="button" className="trash" onClick={()=>remove(i.product.id)}><Trash2 size={17}/></button></div>)}<div className="orderTotal"><span>Разом</span><b>{money(total)}</b></div></section>
 <form className="card form checkoutForm" onSubmit={submit}><div className="checkoutStep"><span>1</span><h2>Контакти</h2></div><label>Імʼя<input name="name" required autoComplete="name"/></label><label>Телефон<input name="phone" required inputMode="tel" autoComplete="tel" placeholder="+380…"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label><div className="checkoutStep"><span>2</span><h2>Доставка Новою поштою</h2></div><NovaPoshtaPicker/><div className="checkoutStep"><span>3</span><h2>Оплата</h2></div><div className="paymentOptions"><label className={payment==='bank_transfer'?'selected':''}><input type="radio" checked={payment==='bank_transfer'} onChange={()=>setPayment('bank_transfer')}/><Building2/><div><b>За реквізитами</b><small>Надішлемо після підтвердження наявності</small></div></label><label className={payment==='cod'?'selected':''}><input type="radio" checked={payment==='cod'} onChange={()=>setPayment('cod')}/><WalletCards/><div><b>При отриманні</b><small>Накладений платіж Нової пошти</small></div></label></div>{error&&<div className="match">{error}</div>}<button disabled={loading} className="primary wide checkoutSubmit" type="submit">{loading?'Оформлюємо…':'Підтвердити замовлення · '+money(total)}</button><p className="checkoutNote">Після оформлення ми перевіримо актуальну наявність і зв’яжемося з вами.</p></form>
 </div>}</main>
}
