import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LAPKA — зоомагазин для тих, кого люблять',
  description: 'Корми, ласощі, іграшки та догляд для собак і котів. Підбір товарів під вашого улюбленця.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body>{children}</body></html>;
}
