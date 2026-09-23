import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LAPKA',
    short_name: 'LAPKA',
    description: 'Зоомагазин для тих, кого люблять',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf6',
    theme_color: '#171713',
    lang: 'uk',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
    ]
  };
}
