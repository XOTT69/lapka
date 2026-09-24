'use client';
import {useEffect,useState} from 'react';
import {RefreshCw,Save,Truck} from 'lucide-react';

type Contact={ref:string;name:string;phone:string};
type Address={ref:string;address:string;cityRef:string};
type Sender={ref:string;name:string;cityRef:string;city:string;contacts:Contact[];addresses:Address[]};

export default function AdminShipping(){
 const [senders,setSenders]=useState<Sender[]>([]),[loading,setLoading]=useState(true),[message,setMessage]=useState('');
 const [senderRef,setSenderRef]=useState(''),[contactRef,setContactRef]=useState(''),[addressRef,setAddressRef]=useState('');
 const sender=senders.find(x=>x.ref===senderRef),contact=sender?.contacts.find(x=>x.ref===contactRef),address=sender?.addresses.find(x=>x.ref===addressRef);

 async function load(){
  setLoading(true);setMessage('');
  const r=await fetch('/api/admin/nova-poshta',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'senderOptions'})});
  const j=await r.json();setLoading(false);
  if(!r.ok){setMessage(j.message||'Не вдалося завантажити дані Нової пошти.');return}
  setSenders(j.senders||[]);
  const cfg=j.configured||{};
  setSenderRef(cfg.np_sender_ref||j.senders?.[0]?.ref||'');
  const s=(j.senders||[]).find((x:Sender)=>x.ref===(cfg.np_sender_ref||j.senders?.[0]?.ref));
  setContactRef(cfg.np_sender_contact_ref||s?.contacts?.[0]?.ref||'');
  setAddressRef(cfg.np_sender_address_ref||s?.addresses?.[0]?.ref||'');
 }
 useEffect(()=>{load()},[]);
 useEffect(()=>{if(!sender)return;if(!sender.contacts.some(x=>x.ref===contactRef))setContactRef(sender.contacts[0]?.ref||'');if(!sender.addresses.some(x=>x.ref===addressRef))setAddressRef(sender.addresses[0]?.ref||'')},[senderRef]);

 async function save(){
  if(!sender||!contact||!address)return setMessage('Оберіть відправника, контакт і адресу.');
  setMessage('Зберігаємо…');
  const r=await fetch('/api/admin/nova-poshta',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'saveSender',senderRef:sender.ref,contactRef:contact.ref,addressRef:address.ref,cityRef:address.cityRef||sender.cityRef,senderPhone:contact.phone})});
  const j=await r.json();setMessage(r.ok?'Відправника збережено. Тепер можна створювати ТТН для власних відправок.':j.message||'Помилка збереження.');
 }

 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">LAPKA Admin</span><h1>Нова пошта</h1><p>Налаштування відправника для власних відправок. Для дропшип-замовлень просто додавай ТТН, яку надіслав партнер.</p></div>
 <section className="card shippingSetup">
  <div className="settingsSectionHead"><Truck/><div><b>Відправник</b><span>Дані завантажуються напряму з кабінету Нової пошти через API.</span></div><button className="secondary" onClick={load} disabled={loading}><RefreshCw size={16}/>{loading?'Оновлюємо…':'Оновити'}</button></div>
  {!loading&&senders.length===0&&<div className="formMessage">У кабінеті Нової пошти не знайдено відправника. Спочатку налаштуй його в особистому/бізнес-кабінеті НП.</div>}
  {senders.length>0&&<div className="shippingFields"><label>Відправник<select value={senderRef} onChange={e=>setSenderRef(e.target.value)}>{senders.map(s=><option key={s.ref} value={s.ref}>{s.name}{s.city?' · '+s.city:''}</option>)}</select></label><label>Контакт<select value={contactRef} onChange={e=>setContactRef(e.target.value)}>{(sender?.contacts||[]).map(c=><option key={c.ref} value={c.ref}>{c.name} · {c.phone}</option>)}</select></label><label>Адреса / відділення відправника<select value={addressRef} onChange={e=>setAddressRef(e.target.value)}>{(sender?.addresses||[]).map(a=><option key={a.ref} value={a.ref}>{a.address||a.ref}</option>)}</select></label><button className="primary" onClick={save}><Save size={17}/>Зберегти відправника</button></div>}
  {message&&<div className="formMessage">{message}</div>}
 </section>
 <section className="card shippingNote"><h2>Як працює з дропшипінгом</h2><p>Якщо товар відправляє партнер, не створюй другу ТТН зі свого акаунта. Дочекайся номера від партнера й додай його до замовлення — LAPKA покаже номер покупцю та підтягне статус Нової пошти.</p></section>
 </main>
}
