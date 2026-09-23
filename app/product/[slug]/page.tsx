import {notFound} from 'next/navigation';
import Link from 'next/link';
import {getProduct,products} from '@/lib/products';
import ProductDetails from '@/components/product-details';

export async function generateStaticParams(){return products.map(p=>({slug:p.slug}))}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=getProduct(slug);if(!p)notFound();return <main className="wrap page"><div className="breadcrumbs"><Link href="/">Головна</Link> / <Link href="/catalog">Каталог</Link> / {p.name}</div><ProductDetails product={p}/></main>}
