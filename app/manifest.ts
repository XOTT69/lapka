import type {MetadataRoute} from 'next';

export default function manifest():MetadataRoute.Manifest{
 return {
  name:'LAPKA — зоотовари для собак і котів',
  short_name:'LAPKA',
  description:'Корми, переноски, лежаки, одяг та аксесуари для собак і котів.',
  start_url:'/',
  display:'standalone',
  background_color:'#f6f7f5',
  theme_color:'#246547',
  lang:'uk',
  icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml'}]
 };
}
