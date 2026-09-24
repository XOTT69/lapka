import Link from 'next/link';
import {ArrowRight,BadgeCheck,HeartHandshake,PackageCheck,Search,Truck} from 'lucide-react';
import {getZooBazaProducts} from '@/lib/zoobaza';
import LiveFeatured from '@/components/live-featured';
import HomeAccountCta from '@/components/home-account-cta';

export const dynamic='force-dynamic';

const quickCategories=[
 ['🐶','Для собак','корм собак','Корм, амуніція, іграшки'],
 ['🐱','Для котів','корм кот','Корм, догляд, переноски'],
 ['🥣','Корм','корм','Раціони на щодень'],
 ['🧳','Переноски','переноск','Для поїздок і подорожей'],
 ['🦮','Амуніція','амуніц','Шлеї, повідці, аксесуари'],
 ['🧴','Догляд','догляд','Гігієна та турбота']
];

export default async function Home(){
 let featured:Awaited<ReturnType<typeof getZooBazaProducts>>=[];
 try{featured=(await getZooBazaProducts(180)).filter(p=>p.picture&&p.available).slice(0,8)}catch{}
 return <main className="storeHome">
  <section className="retailHero"><div className="wrap retailHeroGrid">
   <div className="retailHeroCopy"><span className="heroTag">LAPKA · магазин для своїх</span><h1>Турбота про улюбленців — без зайвих пошуків.</h1><p>Корм, переноски, амуніція та догляд в одному каталозі. Актуальні фото, ціни й наявність.</p><form action="/catalog" className="heroSearch"><Search size={20}/><input name="q" placeholder="Що шукаєте? Наприклад: переноска, корм, код товару"/><button>Знайти</button></form><div className="heroActions"><Link className="primary" href="/catalog">Перейти в каталог <ArrowRight size={18}/></Link><HomeAccountCta/></div></div>
   <div className="retailHeroAside"><div className="promoCard promoMain"><span>Для хвостиків</span><h2>Все потрібне — в кілька кліків</h2><p>Пошук за назвою, брендом або кодом товару.</p><Link href="/catalog">Обрати товари <ArrowRight size={17}/></Link></div><div className="promoMini"><Truck/><div><b>Нова пошта</b><span>Відділення та поштомати в checkout</span></div></div></div>
  </div></section>

  <section className="wrap homeSection"><div className="homeSectionHead"><div><span>Швидкий старт</span><h2>Популярні категорії</h2></div><Link href="/catalog">Увесь каталог <ArrowRight size={16}/></Link></div><div className="quickCategoryGrid">{quickCategories.map(([icon,title,q,desc])=><Link key={title} href={'/catalog?q='+encodeURIComponent(q)}><div className="quickCategoryIcon">{icon}</div><div><b>{title}</b><span>{desc}</span></div><ArrowRight size={17}/></Link>)}</div></section>

  <section className="wrap homeBenefits"><div><PackageCheck/><b>Актуальні залишки</b><span>Каталог регулярно оновлюється</span></div><div><BadgeCheck/><b>Коди товарів</b><span>Легко знайти потрібний SKU</span></div><div><Truck/><b>Нова пошта</b><span>Місто й відділення зі списку</span></div><div><HeartHandshake/><b>Профілі улюбленців</b><span>Кілька тварин в одному акаунті</span></div></section>

  <section className="catalog wrap featuredSection"><div className="homeSectionHead"><div><span>В наявності</span><h2>Популярне зараз</h2></div><Link href="/catalog">Дивитися все <ArrowRight size={16}/></Link></div>{featured.length?<LiveFeatured items={featured}/>:<div className="empty">Каталог оновлюється.</div>}</section>

  <section className="wrap accountPromo"><div><span>LAPKA PROFILE</span><h2>Магазин пам’ятає ваших улюбленців.</h2><p>Додайте собаку, котика або кількох тварин. Дата народження автоматично визначає вік, а профілі не перезаписують один одного.</p></div><HomeAccountCta light/></section>
 </main>
}
