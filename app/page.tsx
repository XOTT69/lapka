'use client';
import Link from 'next/link';
import {ArrowRight,ShieldCheck,Truck} from 'lucide-react';
import ProductCard from '@/components/product-card';
import {products} from '@/lib/products';
import {useStore} from '@/lib/store';

export default function Home(){
 const {pet}=useStore();
 return <main>
  <section className="hero wrap"><div className="heroText"><div className="eyebrow">Турбота, яку вони відчувають</div><h1>Все для тих,<br/>хто <em>чекає тебе</em> вдома.</h1><p>Корми, ласощі, іграшки й догляд — без нескінченного пошуку. LAPKA запамʼятає вашого улюбленця й допоможе підібрати потрібне.</p><div className="heroBtns"><Link className="primary" href="/pets">{pet?'Профіль '+pet.name:'Додати улюбленця'} <ArrowRight size={18}/></Link><Link className="secondary" href="/catalog">Перейти в каталог</Link></div><div className="trust"><span><Truck/>Нова пошта</span><span><ShieldCheck/>Офіційні товари</span></div></div>
  <div className="petCard"><span className="floating">Персональний підбір ✨</span><div className="dog">{pet?.type==='Кіт'?'🐈':'🐕'}</div><div className="petInfo"><div><b>{pet?.name||'Ваш улюбленець'}</b><small>{pet?pet.age+' • '+pet.weight+' • '+pet.breed:'Створіть профіль за хвилину'}</small></div><Link href={pet?.type==='Кіт'?'/catalog?pet=Коти':'/catalog?pet=Собаки'}>Підібрати →</Link></div></div></section>
  <section className="quick wrap"><Link href="/catalog?pet=Собаки"><span>🐶</span><div><b>Для собак</b><small>Корм, амуніція, іграшки</small></div></Link><Link href="/catalog?pet=Коти"><span>🐱</span><div><b>Для котів</b><small>Корм, іграшки, догляд</small></div></Link><Link href="/catalog"><span>✨</span><div><b>Усі товари</b><small>Переглянути каталог</small></div></Link></section>
  <section className="catalog wrap"><div className="sectionHead"><div><span>Популярне зараз</span><h2>Товари, які люблять хвостики</h2></div><Link href="/catalog">Увесь каталог →</Link></div><div className="grid">{products.slice(0,8).map(p=><ProductCard key={p.id} p={p}/>)}</div></section>
  <section className="why"><div className="wrap"><span className="eyebrow">LAPKA Club</span><h2>Не просто магазин.<br/>Помічник для вашого улюбленця.</h2><div className="benefits"><div><b>01</b><h3>Профіль тварини</h3><p>Вік, вага, порода й особливості для точнішої добірки.</p></div><div><b>02</b><h3>Повтор замовлення</h3><p>Уся історія покупок збережена на пристрої.</p></div><div><b>03</b><h3>Розумний каталог</h3><p>Фільтри за твариною, категорією, брендом і ціною.</p></div></div></div></section>
 </main>
}
