export type Product = {
  id:number; slug:string; name:string; brand:string; category:string; pet:'Собаки'|'Коти';
  price:number; oldPrice?:number; badge?:string; emoji:string; image?:string; description:string;
  stock:number; weight?:string; age?:string; features:string[];
};

export const products: Product[] = [
{id:1,slug:'monge-puppy-junior-duck-rice-15kg',name:'Puppy & Junior Duck & Rice 15 кг',brand:'Monge',category:'Корм',pet:'Собаки',price:2749,oldPrice:2999,badge:'-8%',emoji:'🥣',description:'Повнораціонний корм для цуценят і юніорів середніх порід.',stock:18,weight:'15 кг',age:'2–12 міс.',features:['Качка та рис','Для середніх порід','Підтримка травлення']},
{id:2,slug:'fitmin-medium-puppy-12kg',name:'Medium Puppy 12 кг',brand:'Fitmin',category:'Корм',pet:'Собаки',price:2399,badge:'Вибір',emoji:'🐶',description:'Корм для цуценят середніх порід з високим вмістом мʼяса.',stock:13,weight:'12 кг',age:'2–12 міс.',features:['Свіже мʼясо','Для цуценят','Без пшениці']},
{id:3,slug:'monge-cat-urinary-10kg',name:'Cat Urinary Chicken 10 кг',brand:'Monge',category:'Корм',pet:'Коти',price:2199,emoji:'🐱',description:'Раціон для дорослих котів із підтримкою сечовидільної системи.',stock:9,weight:'10 кг',age:'1+ рік',features:['Urinary care','Курка','Для дорослих котів']},
{id:4,slug:'puller-standard',name:'PULLER Standard',brand:'COLLAR',category:'Іграшки',pet:'Собаки',price:629,badge:'Хіт',emoji:'🟣',description:'Тренувальний снаряд для активних ігор та занять із собакою.',stock:31,features:['Легкий','Не травмує зуби','Для активних ігор']},
{id:5,slug:'waudog-comfort-air',name:'Шлея Comfort Air',brand:'WAUDOG',category:'Амуніція',pet:'Собаки',price:899,emoji:'🦮',description:'Легка анатомічна шлея для щоденних прогулянок.',stock:22,features:['Анатомічна форма','Дихаюча тканина','Світловідбивні елементи']},
{id:6,slug:'lickimat-buddy',name:'LickiMat Buddy',brand:'LickiMat',category:'Ласощі',pet:'Собаки',price:499,emoji:'🦴',description:'Килимок для повільного поїдання та зниження стресу.',stock:15,features:['Повільне годування','Антистрес','Легко мити']},
{id:7,slug:'trixie-catnip-mouse',name:'Catnip Mouse',brand:'Trixie',category:'Іграшки',pet:'Коти',price:189,emoji:'🐭',description:'Мʼяка іграшка з котячою мʼятою.',stock:44,features:['Котяча мʼята','Мʼяка','Для гри вдома']},
{id:8,slug:'vetexpert-dental-care-150',name:'Dental Care Spray 150 мл',brand:'VetExpert',category:'Догляд',pet:'Собаки',price:389,emoji:'🧴',description:'Щоденний догляд за ротовою порожниною.',stock:17,weight:'150 мл',features:['Щоденний догляд','Свіже дихання','Просте застосування']},
{id:9,slug:'brit-care-adult-salmon-12kg',name:'Care Adult Medium Salmon 12 кг',brand:'Brit Care',category:'Корм',pet:'Собаки',price:2489,badge:'Популярне',emoji:'🐟',description:'Гіпоалергенний раціон з лососем для дорослих собак середніх порід.',stock:11,weight:'12 кг',age:'1+ рік',features:['Лосось','Гіпоалергенний','Шкіра та шерсть']},
{id:10,slug:'josera-kitten-10kg',name:'Kitten 10 кг',brand:'Josera',category:'Корм',pet:'Коти',price:2290,emoji:'😺',description:'Поживний корм для кошенят, вагітних та лактуючих кішок.',stock:8,weight:'10 кг',age:'до 1 року',features:['Для кошенят','Висока поживність','Легке травлення']},
{id:11,slug:'fuzz-yard-bed',name:'Life Bed Sandstone M',brand:'FuzzYard',category:'Лежаки',pet:'Собаки',price:2890,emoji:'🛏️',description:'Мʼякий дизайнерський лежак зі знімним чохлом.',stock:5,features:['Знімний чохол','Машинне прання','Середній розмір']},
{id:12,slug:'nobby-ceramic-bowl',name:'Керамічна миска 750 мл',brand:'Nobby',category:'Миски',pet:'Коти',price:459,emoji:'🥛',description:'Стійка керамічна миска для води або корму.',stock:27,weight:'750 мл',features:['Кераміка','Не ковзає','Легко мити']}
];

export const getProduct=(slug:string)=>products.find(p=>p.slug===slug);
export const categories=[...new Set(products.map(p=>p.category))];
export const brands=[...new Set(products.map(p=>p.brand))];
