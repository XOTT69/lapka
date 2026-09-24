'use client';
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';

export default function NavigationFeedback(){
 const path=usePathname();
 const [active,setActive]=useState(false);
 useEffect(()=>{setActive(false)},[path]);
 useEffect(()=>{
  const click=(e:MouseEvent)=>{
   const target=e.target as HTMLElement|null;
   const a=target?.closest('a[href]') as HTMLAnchorElement|null;
   if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   const u=new URL(a.href,location.href);
   if(u.origin===location.origin&&u.href!==location.href)setActive(true);
  };
  document.addEventListener('click',click,true);
  return()=>document.removeEventListener('click',click,true);
 },[]);
 return <div className={'navProgress '+(active?'active':'')} aria-hidden="true"/>;
}
