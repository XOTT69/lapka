export type Product = {
  id: number; name: string; brand: string; category: 'Корм'|'Ласощі'|'Іграшки'|'Амуніція'|'Догляд';
  pet: 'Собаки'|'Коти'; price: number; oldPrice?: number; badge?: string; emoji: string; description: string;
};

export const products: Product[] = [
  {id:1,name:'Puppy & Junior Duck & Rice 15 кг',brand:'Monge',category:'Корм',pet:'Собаки',price:2749,oldPrice:2999,badge:'-8%',emoji:'🥣',description:'Повнораціонний корм для цуценят і юніорів середніх порід.'},
  {id:2,name:'Fitmin Medium Puppy 12 кг',brand:'Fitmin',category:'Корм',pet:'Собаки',price:2399,badge:'Вибір',emoji:'🐶',description:'Корм для цуценят середніх порід з високим вмістом мʼяса.'},
  {id:3,name:'Urinary Chicken 10 кг',brand:'Monge',category:'Корм',pet:'Коти',price:2199,emoji:'🐱',description:'Раціон для дорослих котів із підтримкою сечовидільної системи.'},
  {id:4,name:'PULLER Standard',brand:'COLLAR',category:'Іграшки',pet:'Собаки',price:629,badge:'Хіт',emoji:'🟣',description:'Тренувальний снаряд для активних ігор та занять із собакою.'},
  {id:5,name:'Шлея Comfort Air',brand:'WAUDOG',category:'Амуніція',pet:'Собаки',price:899,emoji:'🦮',description:'Легка анатомічна шлея для щоденних прогулянок.'},
  {id:6,name:'LickiMat Buddy',brand:'LickiMat',category:'Ласощі',pet:'Собаки',price:499,emoji:'🦴',description:'Килимок для повільного поїдання та зниження стресу.'},
  {id:7,name:'Catnip Mouse',brand:'Trixie',category:'Іграшки',pet:'Коти',price:189,emoji:'🐭',description:'Мʼяка іграшка з котячою мʼятою.'},
  {id:8,name:'Dental Care Spray 150 мл',brand:'VetExpert',category:'Догляд',pet:'Собаки',price:389,emoji:'🧴',description:'Щоденний догляд за ротовою порожниною.'}
];
