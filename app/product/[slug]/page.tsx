import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getCatalogProduct,getCatalogVariants,getRelatedProducts} from '@/lib/catalog';
import CatalogProductDetails from '@/components/catalog-product-details';

export const revalidate=120;

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const product=await getCatalogProduct(decodeURIComponent(slug));
 if(!product)notFound();
 const [variants,related]=await Promise.all([
  getCatalogVariants(product.groupId,product.externalId),
  getRelatedProducts(product.category,product.externalId)
 ]);
 return <main className="wrap page productPageWrap">
  <nav className="breadcrumbs"><Link href="/">Головна</Link><span>/</span><Link href="/catalog">Каталог</Link><span>/</span><span>{product.category||'Товар'}</span></nav>
  <CatalogProductDetails product={product} variants={variants} related={related}/>
 </main>
}