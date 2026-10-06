export type ShopInfo={
 store_name:string;store_status:string;support_phone:string;support_email:string;support_messenger:string;support_hours:string;
 about_short:string;delivery_note:string;payment_note:string;returns_note:string;seller_legal_name:string;seller_tax_id:string;
};

const URL=process.env.NEXT_PUBLIC_SUPABASE_URL||'https://sulidxtbtblhkhwvggzy.supabase.co';
const KEY=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_UZRENjCh8MgcoU6HleYS4w_F8UrDSGo';
const defaults:ShopInfo={
 store_name:'IMPORTA',
 store_status:'Онлайн-магазин імпортних смаколиків з Європи, Кореї та інших країн',
 support_phone:'',support_email:'',support_messenger:'',support_hours:'',
 about_short:'Збираємо цікавий імпортний асортимент без випадкових позицій: популярний рамен, шоколад, желейки, печиво, снеки та напої. Наявність і ціну підтверджуємо перед оплатою.',
 delivery_note:'Доставка Новою поштою у відділення або поштомат. Вартість доставки визначає перевізник.',
 payment_note:'Оплата після підтвердження наявності товару. Онлайн-оплату підключимо після фіналізації продавця та еквайрингу.',
 returns_note:'Для харчових товарів умови обміну та повернення залежать від причини звернення, стану упаковки та вимог законодавства. Якщо товар пошкоджений, прострочений або отримано не ту позицію — зверніться до підтримки.',
 seller_legal_name:'',seller_tax_id:''
};

export async function getShopInfo():Promise<ShopInfo>{
 try{
  const r=await fetch(URL+'/rest/v1/shop_public_settings?select=key,value',{headers:{apikey:KEY,Authorization:'Bearer '+KEY},next:{revalidate:120}});
  if(!r.ok)return defaults;
  const rows=await r.json() as {key:string;value:string}[];
  const out={...defaults} as Record<string,string>;
  for(const row of rows)if(row.key in out)out[row.key]=row.value||'';
  return out as ShopInfo;
 }catch{return defaults}
}
