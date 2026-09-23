'use client';
import Link from 'next/link';
import {ArrowRight, HeartHandshake, PackageCheck, Sparkles} from 'lucide-react';
import ProductCard from '@/components/product-card';
import {products} from '@/lib/products';

export default function Home(){
 return <main>
  <section className="homeHeroSoft">
   <div className="wrap softHeroGrid">
    <div className="softHeroCopy">
     <span className="heroPill"><Sparkles size={15}/> Турбота без зайвого пошуку</span>
     <h1>Все потрібне для тих,<br/>хто чекає тебе вдома.</h1>
     <p>Корм, догляд, амуніція й корисні дрібниці — у зрозумілому каталозі з актуальною наявністю та рекомендаціями під твого улюбленця.</p>
     <div className="heroActions">
      <Link className="primary" href="/catalog">Перейти в каталог <ArrowRight size={18}/></Link>
      <Link className="secondary" href="/sign-up">Створити профіль</Link>
     </div>
     <div className="heroTrust">
      <span><PackageCheck/>Дропшипінг від перевірених постачальників</span>
      <span><HeartHandshake/>Підбір без випадкових товарів</span>
     </div>
    </div>
    <div className="softHeroVisual">
      <div className="visualOrb orbA"></div><div className="visualOrb orbB"></div>
      <div className="heroProductCard heroProductMain"><small>для собак</small><strong>Щоденний догляд</strong><span>Корм · амуніція · іграшки</span></div>
      <div className="heroProductCard heroProductMini"><small>для котів</small><strong>Спокійний вибір</strong><span>Раціони · миски · догляд</span></div>
      <div className="heroBadgeFloat">LAPKA CLUB<br/><span>профіль улюбленця</span></div>
    </div>
   </div>
  </section>

  <section className="wrap categoryStrip">
   <Link href="/catalog?pet=Собаки"><div className="categoryIcon">🐶</div><div><b>Собакам</b><small>Корм, прогулянки, догляд</small></div><ArrowRight/></Link>
   <Link href="/catalog?pet=Коти"><div className="categoryIcon">🐱</div><div><b>Котам</b><small>Раціони, миски, іграшки</small></div><ArrowRight/></Link>
   <Link href="/catalog/zoobaza/hits"><div className="categoryIcon">★</div><div><b>Хіти ZooBaza</b><small>Стартова добірка постачальника</small></div><ArrowRight/></Link>
  </section>

  <section className="catalog wrap featuredSection">
   <div className="sectionHead softSectionHead"><div><span className="sectionKicker">Популярне</span><h2>З цього легко почати.</h2><p>Невелика добірка замість нескінченного каталогу.</p></div><Link className="sectionLink" href="/catalog">Увесь каталог <ArrowRight size={16}/></Link></div>
   <div className="grid">{products.slice(0,8).map(p=><ProductCard key={p.id} p={p}/>)}</div>
  </section>

  <section className="wrap clubBanner">
    <div><span className="heroPill">LAPKA CLUB</span><h2>Профіль, який справді спрощує покупки.</h2><p>Збережи улюбленця один раз — і магазин пам’ятатиме його вік, вагу та інші важливі деталі.</p></div>
    <Link className="primary lightButton" href="/sign-up">Створити акаунт <ArrowRight size={18}/></Link>
  </section>
 </main>
}