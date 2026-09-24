import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight,Search,Truck,WalletCards} from 'lucide-react';
import {getCatalogProducts} from '@/lib/catalog';
import ProductGrid from '@/components/product-grid';

export const revalidate=120;

const categories=[
 ['Корми для собак','Корми для собак'],
 ['Корми для котів','Корми для котів'],
 ['Переноски','Переноски'],
 ['Лежаки та будиночки','Лежаки та будиночки'],
 ['Одяг','Одяг'],
 ['Аксесуари','Аксесуари']
];

export default async function Home(){
 const [featured,dogFood,catFood,carriers,beds]=await Promise.all([
  getCatalogProducts({limit:8,available:true}),
  getCatalogProducts({category:'Корми для собак',limit:1,available:true}),
  getCatalogProducts({category:'Корми для котів',limit:1,available:true}),
  getCatalogProducts({category:'Переноски',limit:1,available:true}),
  getCatalogProducts({category:'Лежаки та будиночки',limit:1,available:true})
 ]);
 const categoryImages=new Map<string,string|undefined>([
  ['Корми для собак',dogFood.items[0]?.picture],['Корми для котів',catFood.items[0]?.picture],
  ['Переноски',carriers.items[0]?.picture],['Лежаки та будиночки',beds.items[0]?.picture]
 ]);
 const hero=featured.items.slice(0,2);

 return <main className="homePage">
  <section className="wrap homeHero">
   <div className="homeHeroCopy">
    <span className="homeEyebrow">Зоомагазин LAPKA</span>
    <h1>Усе потрібне для собак і котів.</h1>
    <p>Корм, переноски, лежаки, одяг та аксесуари — з актуальною наявністю й швидким пошуком за кодом товару.</p>
    <form action="/catalog" className="homeSearch"><Search size={20}/><input name="q" placeholder="Що шукаєте?"/><button>Знайти</button></form>
    <div className="homeHeroLinks"><Link href="/catalog">Перейти в каталог <ArrowRight size={17}/></Link><span><Truck size={16}/>Нова пошта</span><span><WalletCards size={16}/>Післяплата доступна</span></div>
   </div>
   <div className="homeHeroProducts">
    {hero.map((p,i)=><Link key={p.externalId} href={'/product/'+encodeURIComponent(p.externalId)} className={'heroProduct heroProduct'+i}><div className="heroProductImage">{p.picture&&<Image src={p.picture} alt={p.name} fill sizes="320px"/>}</div><span>{p.brand||p.category}</span><b>{p.name}</b></Link>)}
   </div>
  </section>

  <section className="wrap homeSection">
   <div className="sectionTitleRow"><div><span>Каталог</span><h2>Популярні категорії</h2></div><Link href="/catalog">Усі товари <ArrowRight size={15}/></Link></div>
   <div className="categoryTiles">{categories.map(([label,category])=><Link key={category} href={'/catalog?category='+encodeURIComponent(category)} className="categoryTile"><div className="categoryTileImage">{categoryImages.get(category)&&<Image src={categoryImages.get(category)!} alt="" fill sizes="220px"/>}</div><div><b>{label}</b><span>Переглянути</span></div><ArrowRight size={17}/></Link>)}</div>
  </section>

  <section className="wrap homeSection productHomeSection">
   <div className="sectionTitleRow"><div><span>Каталог</span><h2>В наявності зараз</h2></div><Link href="/catalog">Дивитися все <ArrowRight size={15}/></Link></div>
   <ProductGrid items={featured.items}/>
  </section>
 </main>
}
