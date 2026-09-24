import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getCatalogProduct,getCatalogVariants,getRelatedProducts} from '@/lib/catalog';
import CatalogProductDetails from '@/components/catalog-product-details';

export const revalidate=120;
const SITE=(process.env.NEXT_PUBLIC_SITE_URL||'https://lapka-red.vercel.app').replace(/\/$/,'');

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const p=await getCatalogProduct(decodeURIComponent(slug));
 if(!p)return {title:'Товар не знайдено'};
 const description=(p.description||((p.category||'Зоотовар')+' у LAPKA. Код товару: '+p.sku)).slice(0,160);
 const url=SITE+'/product/'+encodeURIComponent(p.externalId);
 return {
  title:p.name,
  description,
  alternates:{canonical:url},
  openGraph:{type:'website',title:p.name,description,url,images:p.picture?[{url:p.picture,alt:p.name}]:undefined},
  twitter:{card:'summary_large_image',title:p.name,description,images:p.picture?[p.picture]:undefined}
 };
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const product=await getCatalogProduct(decodeURIComponent(slug));
 if(!product)notFound();
 const [variants,related]=await Promise.all([
  getCatalogVariants(product.groupId,product.externalId),
  getRelatedProducts(product.category,product.externalId)
 ]);
 const url=SITE+'/product/'+encodeURIComponent(product.externalId);
 const jsonLd={
  '@context':'https://schema.org','@type':'Product',
  name:product.name,
  image:product.pictures.length?product.pictures:product.picture?[product.picture]:undefined,
  description:product.description||undefined,
  sku:product.sku,
  gtin13:product.ean&&/^\d{13}$/.test(product.ean)?product.ean:undefined,
  brand:product.brand?{'@type':'Brand',name:product.brand}:undefined,
  offers:{'@type':'Offer',url,priceCurrency:'UAH',price:product.price,availability:product.available?'https://schema.org/InStock':'https://schema.org/OutOfStock'}
 };
 return <main className="wrap page productPageWrap">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}}/>
  <nav className="breadcrumbs"><Link href="/">Головна</Link><span>/</span><Link href="/catalog">Каталог</Link><span>/</span><span>{product.category||'Товар'}</span></nav>
  <CatalogProductDetails product={product} variants={variants} related={related}/>
 </main>
}