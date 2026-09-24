'use client';
import {FormEvent,useEffect,useMemo,useState} from 'react';
import {Save,Store,Truck,Undo2,MessageCircle} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

const fields=[
 ['store_status','Короткий статус магазину','Наприклад: онлайн-магазин товарів для собак і котів'],
 ['support_phone','Телефон підтримки','+380…'],
 ['support_email','Email підтримки','support@...'],
 ['support_messenger','Месенджер / посилання','Telegram, Viber або інше'],
 ['support_hours','Графік підтримки','Наприклад: Пн–Сб 10:00–19:00'],
 ['about_short','Коротко про LAPKA','Що важливо знати покупцю'],
 ['delivery_note','Доставка','Короткі умови доставки'],
 ['payment_note','Оплата','Короткі умови оплати'],
 ['returns_note','Повернення','Короткі умови обміну/повернення'],
 ['seller_legal_name','Юридична назва продавця','Залиш порожнім до оформлення ФОП'],
 ['seller_tax_id','ЄДРПОУ / РНОКПП продавця','Залиш порожнім до оформлення ФОП']
] as const;

export default function AdminSettings(){
 const supabase=useMemo(()=>createClient(),[]),[values,setValues]=useState<Record<string,string>>({}),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{if(!supabase)return;supabase.from('shop_public_settings').select('key,value').then(({data})=>{const v:Record<string,string>={};for(const x of data||[])v[x.key]=x.value||'';setValues(v);setLoading(false)})},[]);
 async function submit(e:FormEvent){e.preventDefault();if(!supabase)return;setSaving(true);setMessage('');
  const rows=fields.map(([key])=>({key,value:values[key]||'',updated_at:new Date().toISOString()}));
  const {error}=await supabase.from('shop_public_settings').upsert(rows);
  setSaving(false);setMessage(error?'Не вдалося зберегти.':'Збережено. Публічні сторінки оновляться автоматично.');
 }
 if(loading)return <main className="wrap page"><div className="empty">Завантажуємо налаштування…</div></main>;
 return <main className="wrap page adminSettingsPage"><div className="pageIntro"><span className="eyebrow">LAPKA Admin</span><h1>Налаштування магазину</h1><p>Публічні контакти та умови, які бачить покупець. Юридичні поля можна лишити порожніми до оформлення ФОП.</p></div>
 <form className="card adminSettingsForm" onSubmit={submit}>
  <div className="settingsSectionHead"><Store/><div><b>Довіра та контакти</b><span>Не публікуй дані, які не хочеш показувати покупцям.</span></div></div>
  {fields.map(([key,label,placeholder])=><label key={key}>{label}{['about_short','delivery_note','payment_note','returns_note'].includes(key)?<textarea value={values[key]||''} onChange={e=>setValues({...values,[key]:e.target.value})} placeholder={placeholder}/>:<input value={values[key]||''} onChange={e=>setValues({...values,[key]:e.target.value})} placeholder={placeholder}/>}</label>)}
  {message&&<div className="formMessage">{message}</div>}<button className="primary" disabled={saving}><Save size={17}/>{saving?'Зберігаємо…':'Зберегти налаштування'}</button>
 </form>
 <div className="settingsHints"><div><Truck/><b>Доставка</b><span>Умови видно на окремій сторінці й у footer.</span></div><div><Undo2/><b>Повернення</b><span>Без вигаданих юридичних реквізитів.</span></div><div><MessageCircle/><b>Контакти</b><span>Додай реальний канал зв’язку перед запуском реклами.</span></div></div>
 </main>
}
