'use client';
import Link from 'next/link';
import {Star,Trash2,CheckCircle2} from 'lucide-react';
import {useEffect,useMemo,useState} from 'react';
import {createClient} from '@/lib/supabase/client';

type R={id:string;product_external_id:string;rating:number;body:string;verified:boolean;author_name:string;created_at:string};
export default function AdminReviews(){
 const s=useMemo(()=>createClient(),[]),[rows,setRows]=useState<R[]>([]),[loading,setLoading]=useState(true),[message,setMessage]=useState('');
 async function load(){if(!s)return;const {data}=await s.from('product_reviews').select('*').order('created_at',{ascending:false});setRows((data||[]) as R[]);setLoading(false)}
 useEffect(()=>{load()},[]);
 async function remove(id:string){if(!s)return;const {error}=await s.from('product_reviews').delete().eq('id',id);setMessage(error?'Не вдалося видалити.':'Відгук видалено.');if(!error)await load()}
 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">LAPKA Admin</span><h1>Відгуки</h1><p>Лише відгуки з підтверджених завершених покупок.</p></div>{message&&<div className="formMessage">{message}</div>}{loading?<div className="empty">Завантажуємо…</div>:<div className="adminReviewList">{rows.length?rows.map(r=><article className="card adminReviewCard" key={r.id}><div className="adminReviewTop"><div><b>{r.author_name}</b><span>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span></div><time>{new Date(r.created_at).toLocaleDateString('uk-UA')}</time></div><p>{r.body}</p><div className="adminReviewFoot"><Link href={'/product/'+encodeURIComponent(r.product_external_id)}>Товар: {r.product_external_id}</Link>{r.verified&&<span><CheckCircle2 size={13}/>Підтверджена покупка</span>}<button onClick={()=>remove(r.id)}><Trash2 size={15}/>Видалити</button></div></article>):<div className="empty">Відгуків ще немає.</div>}</div>}</main>
}
