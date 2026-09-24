import Link from 'next/link';
import {ArrowRight,HeartHandshake,PackageCheck,Sparkles} from 'lucide-react';
import {getZooBazaProducts} from '@/lib/zoobaza';
import LiveFeatured from '@/components/live-featured';

export const dynamic='force-dynamic';

export default async function Home(){
 let featured:Awaited<ReturnType<typeof getZooBazaProducts>>=[];
 try{featured=(await getZooBazaProducts(80)).filter(p=>p.picture&&p.available).slice(0,8)}catch{}
 return <main>
  <section className="homeHeroSoft"><div className="wrap softHeroGrid">
   <div className="softHeroCopy"><span className="heroPill"><Sparkles size={15}/> Турбота без зайвого пошуку</span><h1>Все потрібне для тих,<br/>хто чекає тебе вдома.</h1><p>Корм, догляд, амуніція й корисні дрібниці — у зрозумілому каталозі з актуальною наявністю та рекомендаціями під твого улюбленця.</p><div className="heroActions"><Link className="primary" href="/catalog">Перейти в каталог <ArrowRight size={18}/></Link><Link className="secondary" href="/sign-up">Створити профіль</Link></div><div className="heroTrust"><span><PackageCheck/>Актуальна наявність</span><span><HeartHandshake/>Підбір без випадкових товарів</span></div></div>
   <div className="softHeroVisual"><div className="visualOrb orbA"></div><div className="visualOrb orbB"></div><div className="heroProductCard heroProductMain"><small>для собак</small><strong>Щоденний догляд</strong><span>Корм · амуніція · іграшки</span></div><div className="heroProductCard heroProductMini"><small>для котів</small><strong>Спокійний вибір</strong><span>Раціони · миски · догляд</span></div><div className="heroBadgeFloat">LAPKA CLUB<br/><span>профілі улюбленців</span></div></div>
  </div></section>
  <section className="wrap categoryStrip"><Link href="/catalog?q=собак"><div className="categoryIcon">🐶</div><div><b>Собакам</b><small>Корм, прогулянки, догляд</small></div><ArrowRight/></Link><Link href="/catalog?q=кот"><div className="categoryIcon">🐱</div><div><b>Котам</b><small>Раціони, миски, іграшки</small></div><ArrowRight/></Link><Link href="/catalog/zoobaza/hits"><div className="categoryIcon">★</div><div><b>Популярне</b><small>Ходові позиції</small></div><ArrowRight/></Link></section>
  <section className="catalog wrap featuredSection"><div className="sectionHead softSectionHead"><div><span className="sectionKicker">Актуальні товари</span><h2>Є в наявності зараз.</h2><p>Фото, ціни та наявність оновлюються автоматично.</p></div><Link className="sectionLink" href="/catalog">Увесь каталог <ArrowRight size={16}/></Link></div>{featured.length?<LiveFeatured items={featured}/>:<div className="empty">Каталог оновлюється.</div>}</section>
  <section className="wrap clubBanner"><div><span className="heroPill">LAPKA CLUB</span><h2>Окремий профіль для кожного улюбленця.</h2><p>Збережи собаку, котика або кількох тварин — кожна матиме власні параметри й рекомендації.</p></div><Link className="primary lightButton" href="/sign-up">Створити акаунт <ArrowRight size={18}/></Link></section>
 </main>
}
