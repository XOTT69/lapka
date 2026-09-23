'use client';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import ProductCard from '@/components/product-card';
import {products} from '@/lib/products';
import {useStore} from '@/lib/store';

export default function Home(){
 const {pet}=useStore();
 return <main>
  <section className="homeHero wrap">
   <div className="heroCopy">
    <div className="heroIndex">LAPKA / PET SUPPLY / UA</div>
    <h1>Нормальні речі<br/>для <em>ваших</em> тварин.</h1>
    <p>Без випадкових товарів і нескінченного каталогу. Зібрали базу для щоденного догляду, годування та прогулянок — з підбором під конкретного улюбленця.</p>
    <div className="heroActions"><Link className="primary" href="/catalog">Дивитися каталог <ArrowRight size={18}/></Link><Link className="textLink" href="/pets">{pet?'Профіль '+pet.name:'Створити профіль улюбленця'}</Link></div>
   </div>
   <div className="heroEditorial">
    <div className="heroStamp">01<br/><span>CURATED<br/>PET GOODS</span></div>
    <div className="heroPet">DOG<br/>CAT<br/><b>GOOD.</b></div>
    <div className="heroNote">{pet?pet.name+' · '+pet.age+' · '+pet.weight:'Профіль тварини = точніший підбір'}</div>
   </div>
  </section>

  <section className="shopBy wrap">
   <div className="sectionLabel">Купувати простіше</div>
   <div className="shopByGrid">
    <Link href="/catalog?pet=Собаки"><span>01</span><h3>Собаки</h3><p>Корм, амуніція, іграшки та догляд.</p></Link>
    <Link href="/catalog?pet=Коти"><span>02</span><h3>Коти</h3><p>Раціони, миски, іграшки та щоденний догляд.</p></Link>
    <Link href="/catalog"><span>03</span><h3>Увесь каталог</h3><p>Швидкий пошук за брендом і категорією.</p></Link>
   </div>
  </section>

  <section className="catalog wrap featuredSection"><div className="sectionHead"><div><div className="sectionLabel">Добірка редакції</div><h2>Те, з чого варто почати.</h2></div><Link href="/catalog">Увесь каталог →</Link></div><div className="grid">{products.slice(0,8).map(p=><ProductCard key={p.id} p={p}/>)}</div></section>

  <section className="manifesto"><div className="wrap manifestoGrid"><div className="sectionLabel">Чому LAPKA</div><h2>Ми не намагаємося продати все для всіх.</h2><div className="manifestoText"><p>Каталог будується навколо зрозумілих товарів, реальних залишків і прозорої ціни. Коли постачальники віддадуть фіди, кожна позиція матиме актуальну наявність і справжнє фото.</p><p>Профіль тварини потрібен не для ефекту, а щоб прибрати зайве: невідповідний вік, розмір або тип товару.</p></div></div></section>
 </main>
}