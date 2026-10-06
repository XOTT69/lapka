import Link from 'next/link';
import {ArrowRight,Flame,Search,Truck,WalletCards} from 'lucide-react';
import {getCatalogProducts} from '@/lib/catalog';
import ProductGrid from '@/components/product-grid';

export const revalidate=120;

const categories=[
 ['🍜','Рамен і локшина'],
 ['🍫','Шоколад'],
 ['🍬','Желейні цукерки'],
 ['🍪','Печиво та вафлі'],
 ['🌶️','Снеки'],
 ['🥤','Напої'],
 ['🥜','Намазки']
];

export default async function Home(){
 const featured=await getCatalogProducts({limit:8,available:false});
 const hero=featured.items.slice(0,2);
 return <main className="homePage">
  <section className="wrap homeHero">
   <div className="homeHeroCopy">
    <span className="homeEyebrow">IMPORTA · імпортні смаколики</span>
    <h1>Те, що хочеться спробувати.</h1>
    <p>Європа, Корея та інші імпортні хіти: Buldak, шоколад, желейки, вафлі, снеки й напої. Без випадкових «демо-товарів» — каталог готуємо під реальні гуртові прайси.</p>
    <form action="/catalog" className="homeSearch"><Search size={20}/><input name="q" placeholder="Buldak, Haribo, Loacker…"/><button>Знайти</button></form>
    <div className="homeHeroLinks"><Link href="/catalog">Перейти в каталог <ArrowRight size={17}/></Link><span><Truck size={16}/>Нова пошта</span><span><WalletCards size={16}/>Оплата після підтвердження</span></div>
   </div>
   <div className="homeHeroProducts">
    {hero.map((p,i)=><Link key={p.externalId} href={'/product/'+encodeURIComponent(p.externalId)} className={'heroProduct heroProduct'+i}><div className="heroProductImage"><span style={{fontSize:54}}>{p.category==='Рамен і локшина'?'🍜':'🍬'}</span></div><span>{p.brand||p.category}</span><b>{p.name}</b></Link>)}
   </div>
  </section>

  <section className="wrap homeSection">
   <div className="sectionTitleRow"><div><span>Каталог</span><h2>Що шукаємо сьогодні?</h2></div><Link href="/catalog">Усі товари <ArrowRight size={15}/></Link></div>
   <div className="categoryTiles">{categories.map(([emoji,category])=><Link key={category} href={'/catalog?category='+encodeURIComponent(category)} className="categoryTile"><div className="categoryTileImage"><span style={{fontSize:46}}>{emoji}</span></div><div><b>{category}</b><span>Переглянути</span></div><ArrowRight size={17}/></Link>)}</div>
  </section>

  <section className="wrap homeSection productHomeSection">
   <div className="sectionTitleRow"><div><span>Стартовий асортимент</span><h2>Реальні позиції для першого закупу</h2></div><Link href="/catalog">Дивитися все <ArrowRight size={15}/></Link></div>
   <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:16}}><Flame size={17}/><span>Ціни та наявність відкриємо після підключення гуртового прайсу постачальника.</span></div>
   <ProductGrid items={featured.items}/>
  </section>
 </main>
}
