import Link from 'next/link';
import {BarChart3,Boxes,ClipboardList,Settings,Truck,Store,Star} from 'lucide-react';

export default function Admin(){
 return <main className="wrap page"><div className="pageIntro"><span className="eyebrow">LAPKA Admin</span><h1>Керування магазином</h1><p>Замовлення, доставка, ціни й публічні налаштування в одному місці.</p></div>
 <div className="adminHub">
  <Link href="/admin/orders"><ClipboardList/><div><b>Замовлення</b><small>Оплата, статуси, ТТН</small></div></Link>
  <Link href="/admin/settings"><Store/><div><b>Налаштування магазину</b><small>Контакти, доставка, повернення</small></div></Link>
  <Link href="/admin/pricing"><BarChart3/><div><b>Ціни та маржа</b><small>B2B, РРЦ, прибуток</small></div></Link><Link href="/admin/reviews"><Star/><div><b>Відгуки</b><small>Verified-відгуки покупців</small></div></Link>
  <Link href="/catalog"><Boxes/><div><b>Каталог</b><small>Перевірити товари на сайті</small></div></Link>
  <Link href="/admin/shipping"><Truck/><div><b>Нова пошта</b><small>Відправник і автостворення ТТН</small></div></Link>
  <Link href="/account"><Settings/><div><b>Мій акаунт</b><small>Повернутися до профілю</small></div></Link>
 </div></main>
}