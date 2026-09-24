import type {MetadataRoute} from 'next';
import {getCatalogSitemapRefs} from '@/lib/catalog';

const SITE=(process.env.NEXT_PUBLIC_SITE_URL||'https://lapka-red.vercel.app').replace(/\/$/,'');

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const products=await getCatalogSitemapRefs();
 const now=new Date();
 const staticPages:MetadataRoute.Sitemap=[
  {url:SITE+'/',lastModified:now,changeFrequency:'daily',priority:1},
  {url:SITE+'/catalog',lastModified:now,changeFrequency:'hourly',priority:.9},
  {url:SITE+'/popular',lastModified:now,changeFrequency:'daily',priority:.7}
 ];
 return [...staticPages,...products.map(p=>({
  url:SITE+'/product/'+encodeURIComponent(p.externalId),
  lastModified:p.updatedAt?new Date(p.updatedAt):now,
  changeFrequency:'daily' as const,
  priority:.7
 }))];
}
