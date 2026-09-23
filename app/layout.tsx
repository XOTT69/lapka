import type {Metadata, Viewport} from 'next';
import './globals.css';
import {StoreProvider} from '@/lib/store';
import SiteHeader from '@/components/site-header';
import MobileNav from '@/components/mobile-nav';
import Link from 'next/link';
import {PawPrint} from 'lucide-react';

export const viewport:Viewport={width:'device-width',initialScale:1,maximumScale:1,userScalable:false,viewportFit:'cover'};

export const metadata:Metadata={title:{default:'LAPKA — товари для собак і котів',template:'%s | LAPKA'},description:'Корми, аксесуари, переноски, лежаки та догляд для собак і котів.'};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="uk"><body><StoreProvider><SiteHeader/>{children}<footer><div className="wrap footer"><Link className="brand" href="/"><span className="logo"><PawPrint size={18}/></span>LAPKA</Link><p>Турбота про тих, хто чекає вдома.</p><div className="footerLinks"><Link href="/catalog">Каталог</Link><Link href="/account">Профіль</Link><Link href="/orders">Замовлення</Link></div><small>© 2026 LAPKA</small></div></footer><MobileNav/></StoreProvider></body></html>
}
