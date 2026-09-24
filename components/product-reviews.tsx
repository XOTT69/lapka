'use client';
import {FormEvent,useMemo,useState} from 'react';
import {CheckCircle2,Star} from 'lucide-react';
import type {ProductReview} from '@/lib/reviews';
import {createClient} from '@/lib/supabase/client';

export default function ProductReviews({productExternalId,initial}:{productExternalId:string;initial:ProductReview[]}){
 const [reviews,setReviews]=useState(initial),[rating,setRating]=useState(5),[body,setBody]=useState(''),[message,setMessage]=useState(''),[saving,setSaving]=useState(false);
 const avg=useMemo(()=>reviews.length?reviews.reduce((s,r)=>s+r.rating,0)/reviews.length:0,[reviews]);
 async function reload(){
  const s=createClient();if(!s)return;
  const {data}=await s.from('product_reviews').select('id,product_external_id,rating,body,verified,author_name,created_at').eq('product_external_id',productExternalId).order('created_at',{ascending:false});
  setReviews((data||[]).map((x:any)=>({id:x.id,productExternalId:x.product_external_id,rating:Number(x.rating),body:x.body,verified:Boolean(x.verified),authorName:x.author_name||'Покупець',createdAt:x.created_at})));
 }
 async function submit(e:FormEvent){e.preventDefault();setMessage('');setSaving(true);
  const s=createClient();if(!s){setMessage('Увійди в акаунт, щоб залишити відгук.');setSaving(false);return}
  const {data:{user}}=await s.auth.getUser();if(!user){setMessage('Увійди в акаунт, щоб залишити відгук.');setSaving(false);return}
  const {data:orders}=await s.from('customer_orders').select('id,payload').eq('status','completed').order('created_at',{ascending:false});
  const order=(orders||[]).find((o:any)=>(o.payload?.items||[]).some((i:any)=>String(i.sku)===productExternalId));
  if(!order){setMessage('Відгук можна залишити після завершеного замовлення цього товару.');setSaving(false);return}
  const authorName=String(user.user_metadata?.full_name||'Покупець').trim().split(/\s+/)[0]||'Покупець';
  const {error}=await s.from('product_reviews').insert({user_id:user.id,order_id:order.id,product_external_id:productExternalId,rating,body:body.trim(),verified:true,author_name:authorName});
  setSaving(false);
  if(error){setMessage(error.code==='23505'?'Ви вже залишали відгук про цей товар у цьому замовленні.':'Не вдалося зберегти відгук.');return}
  setBody('');setMessage('Дякуємо! Відгук опубліковано.');await reload();
 }
 return <section className="reviewsSection">
  <div className="reviewsHead"><div><span className="sectionLabel">Відгуки</span><h2>Відгуки покупців</h2></div><div className="reviewsScore">{reviews.length?<><strong>{avg.toFixed(1)}</strong><span><Star size={16} fill="currentColor"/> {reviews.length} відгуків</span></>:<span>Відгуків ще немає</span>}</div></div>
  <div className="reviewsLayout"><div className="reviewsList">{reviews.length?reviews.map(r=><article className="reviewCard" key={r.id}><div className="reviewTop"><b>{r.authorName}</b><span>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span></div><p>{r.body}</p><div className="reviewMeta">{r.verified&&<span><CheckCircle2 size={13}/>Підтверджена покупка</span>}<time>{new Date(r.createdAt).toLocaleDateString('uk-UA')}</time></div></article>):<div className="reviewEmpty">Поки що ніхто не залишив відгук. Перший відгук зможе написати покупець після завершеного замовлення.</div>}</div>
  <form className="card reviewForm" onSubmit={submit}><h3>Залишити відгук</h3><p>Доступно тільки після завершеної покупки цього товару.</p><div className="starPicker">{[1,2,3,4,5].map(n=><button type="button" key={n} className={n<=rating?'active':''} onClick={()=>setRating(n)}><Star size={20} fill={n<=rating?'currentColor':'none'}/></button>)}</div><textarea required minLength={3} maxLength={2000} value={body} onChange={e=>setBody(e.target.value)} placeholder="Що сподобалось або що варто знати іншим покупцям?"/>{message&&<div className="formMessage">{message}</div>}<button className="primary" disabled={saving}>{saving?'Публікуємо…':'Опублікувати відгук'}</button></form></div>
 </section>
}
