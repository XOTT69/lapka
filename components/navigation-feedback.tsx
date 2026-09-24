'use client';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';

export default function NavigationFeedback(){
 const path=usePathname();
 const [active,setActive]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const stop=()=>{setActive(false);if(timer.current){clearTimeout(timer.current);timer.current=null}};
 useEffect(()=>{stop()},[path]);
 useEffect(()=>{
  const click=(e:MouseEvent)=>{
   const target=e.target as HTMLElement|null;
   const a=target?.closest('a[href]') as HTMLAnchorElement|null;
   if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   const u=new URL(a.href,location.href);
   if(u.origin!==location.origin||u.href===location.href)return;
   setActive(true);
   if(timer.current)clearTimeout(timer.current);
   timer.current=setTimeout(()=>setActive(false),1400);
  };
  document.addEventListener('click',click,true);
  return()=>{document.removeEventListener('click',click,true);if(timer.current)clearTimeout(timer.current)};
 },[]);
 return <div className={'navProgress '+(active?'active':'')} aria-hidden="true"/>;
}
