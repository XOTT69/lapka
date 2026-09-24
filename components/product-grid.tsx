'use client';
import type {CatalogProduct} from '@/lib/catalog';
import CatalogProductCard from '@/components/catalog-product-card';

export default function ProductGrid({items}:{items:CatalogProduct[]}){
 return <div className="productGrid">{items.map(p=><CatalogProductCard key={p.externalId} product={p}/>)}</div>
}
