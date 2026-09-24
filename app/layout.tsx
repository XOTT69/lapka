import type {Metadata,Viewport} from 'next';
import './globals.css';
import {StoreProvider} from '@/lib/store';
import SiteHeader from '@/components/site-header';
import MobileNav from '@/components/mobile-nav';
import NavigationFeedback from '@/components/navigation-feedback';
import Link from 'next/link';
import {PawPrint} from 'lucide-react';

export const viewport:Viewport={width:'device-width',initialScale:1,maximumScale:1,userScalable:false,viewportFit:'cover'};
const SITE=(process.env.NEXT_PUBLIC_SITE_URL||'https://lapka-red.vercel.app').replace(/\\/$/,'');
export const metadata:Metadata={metadataBase:new URL(SITE),title:{default:'LAPKA — товари для собак і котів',template:'%s | LAPKA'},description:'Корми, переноски, лежаки, одяг та аксесуари для собак і котів.',alternates:{canonical:'/'},openGraph:{type:'website',locale:'uk_UA',siteName:'LAPKA',title:'LAPKA — товари для собак і котів',description:'Корми, переноски, лежаки, одяг та аксесуари для собак і котів.',url:SITE},twitter:{card:'summary_large_image',title:'LAPKA — товари для собак і котів'}};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="uk"><body><StoreProvider><NavigationFeedback/><SiteHeader/>{children}<footer><div className="wrap footer"><Link className="brand" href="/"><span className="logo"><PawPrint size={18}/></span><span>LAPKA</span></Link><p>Зоотовари для собак і котів.</p><div className="footerLinks"><Link href="/catalog">Каталог</Link><Link href="/favorites">Обране</Link><Link href="/account">Профіль</Link><Link href="/orders">Замовлення</Link></div><small>© 2026 LAPKA</small></div></footer><MobileNav/></StoreProvider></body></html>
}
