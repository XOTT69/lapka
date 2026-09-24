import Link from 'next/link';
import {BarChart3,Boxes,ClipboardList,Settings} from 'lucide-react';

export default function Admin(){
 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">LAPKA Admin</span><h1>Панель магазину</h1><p>Робоче місце для замовлень, каталогу та цін.</p></div>
 <div className="adminHub">
  <Link href="/admin/orders"><ClipboardList/><div><b>Замовлення</b><small>Оплата, статуси, доставка</small></div></Link>
  <Link href="/admin/pricing"><BarChart3/><div><b>Ціни та маржа</b><small>B2B, РРЦ, прибуток</small></div></Link>
  <Link href="/catalog"><Boxes/><div><b>Каталог</b><small>Перевірити товари на сайті</small></div></Link>
  <Link href="/account"><Settings/><div><b>Акаунт</b><small>Профіль адміністратора</small></div></Link>
 </div></main>
}
