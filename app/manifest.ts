import type {MetadataRoute} from 'next';

export default function manifest():MetadataRoute.Manifest{
 return {
  name:'IMPORTA — імпортні смаколики',
  short_name:'IMPORTA',
  description:'Рамен, шоколад, желейки, вафлі, снеки й напої з Європи, Кореї та інших країн.',
  start_url:'/',
  display:'standalone',
  background_color:'#f6f7f5',
  theme_color:'#246547',
  lang:'uk',
  icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml'}]
 };
}
