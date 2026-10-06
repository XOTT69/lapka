import type {Metadata,Viewport} from 'next';
import './globals.css';
import {StoreProvider} from '@/lib/store';
import SiteHeader from '@/components/site-header';
import MobileNav from '@/components/mobile-nav';
import NavigationFeedback from '@/components/navigation-feedback';
import Link from 'next/link';
import {Mail,Package,Phone} from 'lucide-react';
import {getShopInfo} from '@/lib/shop-info';

export const viewport:Viewport={width:'device-width',initialScale:1,maximumScale:1,userScalable:false,viewportFit:'cover'};
const SITE=(process.env.NEXT_PUBLIC_SITE_URL||'https://lapka-red.vercel.app').replace(/\/$/,'');
export const metadata:Metadata={metadataBase:new URL(SITE),title:{default:'IMPORTA — імпортні смаколики',template:'%s | IMPORTA'},description:'Імпортні смаколики з Європи, Кореї та інших країн: рамен, шоколад, желейки, вафлі, снеки й напої.',alternates:{canonical:'/'},openGraph:{type:'website',locale:'uk_UA',siteName:'IMPORTA',title:'IMPORTA — імпортні смаколики',description:'Рамен, шоколад, желейки, вафлі, снеки й напої з різних країн.',url:SITE},twitter:{card:'summary_large_image',title:'IMPORTA — імпортні смаколики'}};

export default async function RootLayout({children}:{children:React.ReactNode}){
 const info=await getShopInfo();
 return <html lang="uk"><body><StoreProvider><NavigationFeedback/><SiteHeader/>{children}<footer><div className="wrap footer footerExpanded">
  <div className="footerBrand"><Link className="brand" href="/"><span className="logo"><Package size={18}/></span><span>IMPORTA</span></Link><p>{info.store_status}</p><small>© 2026 IMPORTA</small></div>
  <div className="footerColumn"><b>Покупцям</b><Link href="/delivery-payment">Доставка й оплата</Link><Link href="/returns">Обмін і повернення</Link><Link href="/orders">Мої замовлення</Link><Link href="/favorites">Обране</Link></div>
  <div className="footerColumn"><b>IMPORTA</b><Link href="/about">Про нас</Link><Link href="/contacts">Контакти</Link><Link href="/terms">Умови замовлення</Link><Link href="/privacy">Конфіденційність</Link></div>
  <div className="footerColumn footerContacts"><b>Зв’язок</b>{info.support_phone&&<a href={'tel:'+info.support_phone.replace(/\s/g,'')}><Phone size={14}/>{info.support_phone}</a>}{info.support_email&&<a href={'mailto:'+info.support_email}><Mail size={14}/>{info.support_email}</a>}{info.support_hours&&<span>{info.support_hours}</span>}{!info.support_phone&&!info.support_email&&<Link href="/contacts">Контакти</Link>}</div>
 </div></footer><MobileNav/></StoreProvider></body></html>
}
