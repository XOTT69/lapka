import type {NextConfig} from 'next';

const nextConfig:NextConfig={
 images:{
  remotePatterns:[
   {protocol:'https',hostname:'basmati.com.ua',pathname:'/**'},
   {protocol:'https',hostname:'www.zoobaza.com.ua',pathname:'/**'}
  ],
  formats:['image/avif','image/webp']
 }
};

export default nextConfig;
