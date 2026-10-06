export type CatalogProduct={
 externalId:string;sku:string;name:string;brand?:string;category?:string;categoryId?:string;
 price:number;oldPrice?:number;available:boolean;description?:string;picture?:string;pictures:string[];
 ean?:string;groupId?:string;weight?:string;dimensions?:string;color?:string;country?:string;supplier?:string;
 params:Record<string,string>;variantCount?:number;maxPrice?:number;syncedAt?:string;
};

export type CatalogFacets={categories:string[];brands:string[];countries:string[];colors:string[];minPrice:number;maxPrice:number};
export type CatalogQuery={q?:string;category?:string;brand?:string;country?:string;color?:string;min?:number;max?:number;available?:boolean;sort?:string;limit?:number;offset?:number};

const seed:CatalogProduct[]=[
 {externalId:'samyang-buldak-carbonara-130',sku:'SAM-BUL-CARB-130',name:'Buldak Carbonara Ramen 130 г',brand:'Samyang',category:'Рамен і локшина',country:'Південна Корея',price:0,available:false,weight:'130 г',description:'Гострий корейський рамен Buldak зі смаком Carbonara. Реальна товарна позиція; продажна ціна буде підставлена після отримання B2B-прайсу постачальника.',pictures:[],params:{Смак:'Carbonara',Формат:'Пакет',Гострота:'Гострий'}},
 {externalId:'samyang-buldak-cream-carbonara-140',sku:'SAM-BUL-CC-140',name:'Buldak Cream Carbonara Ramen 140 г',brand:'Samyang',category:'Рамен і локшина',country:'Південна Корея',price:0,available:false,weight:'140 г',description:'Вершкова версія популярного Buldak. Позиція підготовлена для підключення до гуртового прайсу.',pictures:[],params:{Смак:'Cream Carbonara',Формат:'Пакет',Гострота:'Середньо гострий'}},
 {externalId:'samyang-buldak-2x-spicy-140',sku:'SAM-BUL-2X-140',name:'Buldak 2X Spicy Ramen 140 г',brand:'Samyang',category:'Рамен і локшина',country:'Південна Корея',price:0,available:false,weight:'140 г',description:'Одна з найгостріших класичних позицій Buldak для категорії «Гостре».',pictures:[],params:{Смак:'Hot Chicken',Формат:'Пакет',Гострота:'Дуже гострий'}},
 {externalId:'samyang-buldak-cheese-140',sku:'SAM-BUL-CH-140',name:'Buldak Cheese Ramen 140 г',brand:'Samyang',category:'Рамен і локшина',country:'Південна Корея',price:0,available:false,weight:'140 г',description:'Гострий Buldak із сирним смаком.',pictures:[],params:{Смак:'Cheese',Формат:'Пакет',Гострота:'Гострий'}},
 {externalId:'nongshim-shin-ramyun-120',sku:'NS-SHIN-120',name:'Shin Ramyun 120 г',brand:'Nongshim',category:'Рамен і локшина',country:'Південна Корея',price:0,available:false,weight:'120 г',description:'Класичний гострий корейський рамен Nongshim Shin Ramyun.',pictures:[],params:{Смак:'Spicy',Формат:'Пакет'}},
 {externalId:'haribo-goldbears-100',sku:'HAR-GOLD-100',name:'Goldbears 100 г',brand:'Haribo',category:'Желейні цукерки',country:'Німеччина',price:0,available:false,weight:'100 г',description:'Класичні фруктові желейні ведмедики Haribo.',pictures:[],params:{Тип:'Желейні цукерки',Формат:'Пакет'}},
 {externalId:'trolli-sour-glowworms-100',sku:'TRO-SOUR-100',name:'Sour Glowworms 100 г',brand:'Trolli',category:'Желейні цукерки',country:'Німеччина',price:0,available:false,weight:'100 г',description:'Кисло-солодкі желейні цукерки Trolli у формі черв’ячків.',pictures:[],params:{Тип:'Желейні цукерки',Смак:'Кисло-солодкий'}},
 {externalId:'ritter-sport-whole-hazelnuts-100',sku:'RIT-NUT-100',name:'Whole Hazelnuts 100 г',brand:'Ritter Sport',category:'Шоколад',country:'Німеччина',price:0,available:false,weight:'100 г',description:'Молочний шоколад Ritter Sport із цілим фундуком.',pictures:[],params:{Тип:'Молочний шоколад',Добавка:'Фундук'}},
 {externalId:'wedel-milk-chocolate-90',sku:'WED-MILK-90',name:'Шоколад молочний 90 г',brand:'E. Wedel',category:'Шоколад',country:'Польща',price:0,available:false,weight:'90 г',description:'Класичний молочний шоколад польського бренду E. Wedel.',pictures:[],params:{Тип:'Молочний шоколад'}},
 {externalId:'loacker-napolitaner-45',sku:'LOA-NAP-45',name:'Napolitaner 45 г',brand:'Loacker',category:'Печиво та вафлі',country:'Італія',price:0,available:false,weight:'45 г',description:'Хрусткі вафлі Loacker Napolitaner із горіховим кремом.',pictures:[],params:{Тип:'Вафлі',Смак:'Лісовий горіх'}},
 {externalId:'manner-neapolitaner-75',sku:'MAN-NEA-75',name:'Neapolitaner 75 г',brand:'Manner',category:'Печиво та вафлі',country:'Австрія',price:0,available:false,weight:'75 г',description:'Класичні австрійські вафлі Manner Neapolitaner.',pictures:[],params:{Тип:'Вафлі',Смак:'Горіховий'}},
 {externalId:'lotus-biscoff-250',sku:'LOT-BIS-250',name:'Biscoff Original 250 г',brand:'Lotus',category:'Печиво та вафлі',country:'Бельгія',price:0,available:false,weight:'250 г',description:'Карамелізоване печиво Lotus Biscoff.',pictures:[],params:{Тип:'Печиво',Смак:'Карамелізований'}},
 {externalId:'pringles-paprika-165',sku:'PRI-PAP-165',name:'Pringles Paprika 165 г',brand:'Pringles',category:'Снеки',country:'Європа',price:0,available:false,weight:'165 г',description:'Картопляні снеки Pringles зі смаком паприки.',pictures:[],params:{Тип:'Картопляні снеки',Смак:'Паприка'}},
 {externalId:'takis-fuego-92',sku:'TAK-FUE-92',name:'Takis Fuego 92 г',brand:'Takis',category:'Снеки',country:'Імпорт',price:0,available:false,weight:'92 г',description:'Гострі кукурудзяні снеки Takis Fuego з лаймом та чилі.',pictures:[],params:{Тип:'Кукурудзяні снеки',Смак:'Чилі та лайм',Гострота:'Дуже гострий'}},
 {externalId:'capri-sun-multivitamin-200',sku:'CAP-MULTI-200',name:'Multivitamin 200 мл',brand:'Capri-Sun',category:'Напої',country:'Німеччина',price:0,available:false,weight:'200 мл',description:'Фруктовий напій Capri-Sun Multivitamin у паучі.',pictures:[],params:{Тип:'Фруктовий напій',Формат:'Пауч'}},
 {externalId:'sanpellegrino-aranciata-330',sku:'SAN-ARA-330',name:'Aranciata 330 мл',brand:'Sanpellegrino',category:'Напої',country:'Італія',price:0,available:false,weight:'330 мл',description:'Італійський газований апельсиновий напій Sanpellegrino.',pictures:[],params:{Тип:'Газований напій',Смак:'Апельсин'}},
 {externalId:'nutella-350',sku:'NUT-350',name:'Nutella 350 г',brand:'Ferrero',category:'Намазки',country:'Європа',price:0,available:false,weight:'350 г',description:'Какао-горіхова паста Nutella.',pictures:[],params:{Тип:'Какао-горіхова паста'}},
 {externalId:'knoppers-25',sku:'KNO-25',name:'Knoppers 25 г',brand:'Knoppers',category:'Печиво та вафлі',country:'Німеччина',price:0,available:false,weight:'25 г',description:'Вафельний снек Knoppers із молочно-горіховою начинкою.',pictures:[],params:{Тип:'Вафельний снек',Формат:'Порційний'}}
];

const includes=(v:unknown,q:string)=>String(v||'').toLowerCase().includes(q);

export async function getCatalogProducts(query:CatalogQuery={}){
 let items=[...seed];
 const q=(query.q||'').trim().toLowerCase();
 if(q)items=items.filter(p=>[p.name,p.sku,p.brand,p.category,p.country,p.ean,...Object.values(p.params)].some(v=>includes(v,q)));
 if(query.category)items=items.filter(p=>p.category===query.category);
 if(query.brand)items=items.filter(p=>p.brand===query.brand);
 if(query.country)items=items.filter(p=>p.country===query.country);
 if(query.color)items=items.filter(p=>p.color===query.color);
 if(query.available===true)items=items.filter(p=>p.available);
 if(query.min!=null)items=items.filter(p=>p.price>0&&p.price>=query.min!);
 if(query.max!=null)items=items.filter(p=>p.price>0&&p.price<=query.max!);
 if(query.sort==='price-asc')items.sort((a,b)=>(a.price||Number.MAX_SAFE_INTEGER)-(b.price||Number.MAX_SAFE_INTEGER));
 else if(query.sort==='price-desc')items.sort((a,b)=>b.price-a.price);
 else if(query.sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name,'uk'));
 const total=items.length,offset=query.offset??0,limit=query.limit??48;
 return {items:items.slice(offset,offset+limit),total};
}

export async function getCatalogFacets():Promise<CatalogFacets>{
 const priced=seed.filter(p=>p.price>0).map(p=>p.price);
 return {
  categories:[...new Set(seed.map(p=>p.category).filter(Boolean) as string[])].sort(),
  brands:[...new Set(seed.map(p=>p.brand).filter(Boolean) as string[])].sort(),
  countries:[...new Set(seed.map(p=>p.country).filter(Boolean) as string[])].sort(),
  colors:[],
  minPrice:priced.length?Math.min(...priced):0,
  maxPrice:priced.length?Math.max(...priced):0
 };
}

export async function getCatalogProduct(ref:string){return seed.find(p=>p.externalId===ref||p.sku===ref)||null}
export async function getCatalogVariants(){return [] as CatalogProduct[]}
export async function getRelatedProducts(category?:string,exclude?:string){return seed.filter(p=>p.category===category&&p.externalId!==exclude).slice(0,6)}
export async function getCatalogProductsByIds(ids:string[]){const set=new Set(ids);return seed.filter(p=>set.has(p.externalId))}
export async function getCatalogSitemapRefs(){return seed.map(p=>({externalId:p.externalId,updatedAt:p.syncedAt}))}
