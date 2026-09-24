import {notFound} from 'next/navigation';
import Link from 'next/link';
import {getZooBazaProducts} from '@/lib/zoobaza';
import LiveProductDetails from '@/components/live-product-details';

export const dynamic='force-dynamic';

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const items=await getZooBazaProducts(5000);
 const product=items.find(p=>p.externalId===slug||p.vendorCode===slug);
 if(!product)notFound();
 return <main className="wrap page"><div className="breadcrumbs"><Link href="/">Головна</Link> / <Link href="/catalog">Каталог</Link> / {product.name}</div><LiveProductDetails product={product}/></main>
}