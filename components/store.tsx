'use client';

import { useMemo, useState } from 'react';
import { Heart, Search, ShoppingBag, PawPrint, ArrowRight, Minus, Plus, X, UserRound, Truck, ShieldCheck } from 'lucide-react';
import { products, Product } from '@/lib/products';

type CartItem = Product & { qty: number };

const money=(n:number)=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

export default function Store(){
  const [pet,setPet]=useState<'Усі'|'Собаки'|'Коти'>('Усі');
  const [query,setQuery]=useState('');
  const [cart,setCart]=useState<CartItem[]>([]);
  const [open,setOpen]=useState(false);
  const [profile,setProfile]=useState(false);

  const filtered=useMemo(()=>products.filter(p=>(pet==='Усі'||p.pet===pet)&&(`${p.brand} ${p.name}`.toLowerCase().includes(query.toLowerCase()))),[pet,query]);
  const count=cart.reduce((s,i)=>s+i.qty,0), total=cart.reduce((s,i)=>s+i.qty*i.price,0);
  const add=(p:Product)=>{setCart(c=>{const f=c.find(i=>i.id===p.id);return f?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]});setOpen(true)};
  const qty=(id:number,d:number)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));

  return <>
    <header className="header"><div className="wrap nav"><a className="brand"><span className="logo"><PawPrint size={22}/></span>LAPKA</a><div className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Пошук корму, бренду або товару"/></div><div className="actions"><button className="icon"><Heart/></button><button className="icon" onClick={()=>setProfile(true)}><UserRound/></button><button className="cartBtn" onClick={()=>setOpen(true)}><ShoppingBag size={20}/>Кошик{count>0&&<b>{count}</b>}</button></div></div></header>

    <main>
      <section className="hero wrap"><div className="heroText"><div className="eyebrow">Турбота, яку вони відчувають</div><h1>Все для тих,<br/>хто <em>чекає тебе</em> вдома.</h1><p>Корми, ласощі, іграшки й догляд — без нескінченного пошуку. Створіть профіль улюбленця, а LAPKA підкаже, що йому підійде.</p><div className="heroBtns"><button className="primary" onClick={()=>setProfile(true)}>Додати улюбленця <ArrowRight size={18}/></button><a href="#catalog" className="secondary">Перейти в каталог</a></div><div className="trust"><span><Truck/>Доставка НП</span><span><ShieldCheck/>Офіційні товари</span></div></div><div className="petCard"><span className="floating">Підбір для вас ✨</span><div className="dog">🐕</div><div className="petInfo"><div><b>Бейлі</b><small>6 міс. • 11 кг • середня порода</small></div><button onClick={()=>{setPet('Собаки');document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'})}}>Підібрати товари →</button></div></div></section>

      <section className="categories wrap"><button onClick={()=>setPet('Собаки')} className={pet==='Собаки'?'active':''}><span>🐶</span><div><b>Для собак</b><small>Корм, амуніція, іграшки</small></div></button><button onClick={()=>setPet('Коти')} className={pet==='Коти'?'active':''}><span>🐱</span><div><b>Для котів</b><small>Корм, наповнювачі, догляд</small></div></button><button onClick={()=>setPet('Усі')} className={pet==='Усі'?'active':''}><span>✨</span><div><b>Усі товари</b><small>Дивитися весь каталог</small></div></button></section>

      <section id="catalog" className="catalog wrap"><div className="sectionHead"><div><span>Популярне зараз</span><h2>Товари, які люблять хвостики</h2></div><div className="chips"><button className={pet==='Усі'?'sel':''} onClick={()=>setPet('Усі')}>Усі</button><button className={pet==='Собаки'?'sel':''} onClick={()=>setPet('Собаки')}>Собаки</button><button className={pet==='Коти'?'sel':''} onClick={()=>setPet('Коти')}>Коти</button></div></div><div className="grid">{filtered.map(p=><article className="product" key={p.id}><div className="visual"><span className="productEmoji">{p.emoji}</span>{p.badge&&<i>{p.badge}</i>}<button className="heart"><Heart size={19}/></button></div><div className="meta"><small>{p.brand} • {p.category}</small><h3>{p.name}</h3><p>{p.description}</p><div className="price"><div><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><button onClick={()=>add(p)}><Plus size={19}/></button></div></div></article>)}</div></section>

      <section className="why"><div className="wrap whyInner"><div><span className="eyebrow">LAPKA Club</span><h2>Магазин памʼятає,<br/>що любить ваш улюбленець</h2></div><div className="benefits"><div><b>01</b><h3>Профіль тварини</h3><p>Вік, вага, порода та особливості — для точніших рекомендацій.</p></div><div><b>02</b><h3>Повтор у два кліки</h3><p>Не шукайте той самий корм щомісяця. Повторіть минуле замовлення.</p></div><div><b>03</b><h3>Нагадування</h3><p>Підкажемо, коли запас корму орієнтовно добігає кінця.</p></div></div></div></section>
    </main>

    {open&&<div className="overlay" onClick={()=>setOpen(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawerHead"><div><small>Ваш кошик</small><h2>{count?`${count} товар(и)`: 'Поки порожньо'}</h2></div><button className="icon" onClick={()=>setOpen(false)}><X/></button></div><div className="cartItems">{cart.map(i=><div className="cartItem" key={i.id}><div className="mini">{i.emoji}</div><div className="cartMeta"><small>{i.brand}</small><b>{i.name}</b><span>{money(i.price)}</span></div><div className="counter"><button onClick={()=>qty(i.id,-1)}><Minus size={14}/></button><b>{i.qty}</b><button onClick={()=>qty(i.id,1)}><Plus size={14}/></button></div></div>)}</div>{count>0&&<div className="checkout"><div><span>Разом</span><b>{money(total)}</b></div><button>Оформити замовлення <ArrowRight size={18}/></button><small>Доставка Новою поштою • оплата онлайн або при отриманні</small></div>}</aside></div>}

    {profile&&<div className="overlay" onClick={()=>setProfile(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setProfile(false)}><X/></button><div className="bigPaw">🐾</div><span className="eyebrow">Профіль улюбленця</span><h2>Познайомимося?</h2><p>У наступній версії тут буде майстер підбору: вид тварини → імʼя → вік → вага → порода → особливості.</p><div className="formMock"><button>🐶 Собака</button><button>🐱 Кіт</button></div><button className="primary full" onClick={()=>setProfile(false)}>Продовжити</button></div></div>}

    <footer><div className="wrap footer"><a className="brand"><span className="logo"><PawPrint size={22}/></span>LAPKA</a><p>Все для тих, хто чекає тебе вдома.</p><small>© 2026 LAPKA. MVP storefront.</small></div></footer>
  </>;
}
