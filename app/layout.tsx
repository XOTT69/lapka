import type {Metadata} from 'next';
import './globals.css';
import {StoreProvider} from '@/lib/store';
import SiteHeader from '@/components/site-header';
import Link from 'next/link';
import {PawPrint} from 'lucide-react';

export const metadata:Metadata={title:{default:'LAPKA — зоомагазин для тих, кого люблять',template:'%s | LAPKA'},description:'Корми, ласощі, іграшки та догляд для собак і котів.'};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="uk"><body><StoreProvider><SiteHeader>{children}</SiteHeader><footer><div className="wrap footer"><Link className="brand" href="/"><span className="logo"><PawPrint size={21}/></span>LAPKA</Link><p>Все для тих, хто чекає тебе вдома.</p><div className="footerLinks"><Link href="/catalog">Каталог</Link><Link href="/pets">Улюбленець</Link><Link href="/admin">Адмінка</Link></div><small>© 2026 LAPKA</small></div></footer></StoreProvider></body></html>
}
