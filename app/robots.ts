import type {MetadataRoute} from 'next';

const SITE=(process.env.NEXT_PUBLIC_SITE_URL||'https://lapka-red.vercel.app').replace(/\/$/,'');

export default function robots():MetadataRoute.Robots{
 return {
  rules:{
   userAgent:'*',
   allow:'/',
   disallow:['/admin/','/account','/orders','/checkout','/favorites','/api/','/sign-in','/sign-up','/forgot-password','/update-password']
  },
  sitemap:SITE+'/sitemap.xml',
  host:SITE
 };
}
