import type {CatalogProduct} from '@/lib/catalog';
import type {Product} from '@/lib/products';

export const productHash=(s:string)=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)||1};

export function inferPetType(p:CatalogProduct):'Собаки'|'Коти'{
 const s=(p.name+' '+(p.category||'')+' '+Object.values(p.params||{}).join(' ')).toLowerCase();
 if(/кот|кіш|cat|kitten/.test(s))return 'Коти';
 return 'Собаки';
}

export function catalogToStoreProduct(p:CatalogProduct):Product{
 return {
  id:productHash('catalog-'+p.externalId),
  slug:p.externalId,
  name:p.name,
  brand:p.brand||'LAPKA',
  category:p.category||'Каталог',
  pet:inferPetType(p),
  price:p.price,
  oldPrice:p.oldPrice,
  emoji:'🐾',
  description:p.description||'Товар із актуального каталогу.',
  stock:p.available?1:0,
  weight:p.weight,
  features:[
   'Код товару: '+p.sku,
   p.ean?'EAN: '+p.ean:'',
   p.color?'Колір: '+p.color:'',
   p.dimensions?'Габарити: '+p.dimensions:''
  ].filter(Boolean)
 };
}
