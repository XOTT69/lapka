'use client';
import {useEffect,useMemo,useState} from 'react';
import {Building2,MapPin} from 'lucide-react';

type City={ref:string;name:string;area:string;settlementType:string};
type Warehouse={ref:string;number:string;name:string;shortAddress:string;type:string;category:string};

export default function NovaPoshtaPicker(){
 const [cityQuery,setCityQuery]=useState(''),[cities,setCities]=useState<City[]>([]),[city,setCity]=useState<City|null>(null);
 const [warehouseQuery,setWarehouseQuery]=useState(''),[warehouses,setWarehouses]=useState<Warehouse[]>([]),[warehouse,setWarehouse]=useState<Warehouse|null>(null);
 const [loadingCities,setLoadingCities]=useState(false),[loadingWarehouses,setLoadingWarehouses]=useState(false),[error,setError]=useState('');

 useEffect(()=>{
  if(city||cityQuery.trim().length<2){setCities([]);return}
  const t=setTimeout(async()=>{
   setLoadingCities(true);setError('');
   try{
    const r=await fetch('/api/nova-poshta',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'cities',query:cityQuery})});
    const j=await r.json();
    if(!r.ok)throw new Error(j.message||'Не вдалося завантажити міста');
    setCities(j.data||[]);
   }catch(e){setError(e instanceof Error?e.message:'Помилка доставки')}finally{setLoadingCities(false)}
  },350);
  return()=>clearTimeout(t);
 },[cityQuery,city]);

 useEffect(()=>{
  if(!city){setWarehouses([]);return}
  const t=setTimeout(async()=>{
   setLoadingWarehouses(true);setError('');
   try{
    const r=await fetch('/api/nova-poshta',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'warehouses',cityRef:city.ref,query:warehouseQuery})});
    const j=await r.json();
    if(!r.ok)throw new Error(j.message||'Не вдалося завантажити відділення');
    setWarehouses(j.data||[]);
   }catch(e){setError(e instanceof Error?e.message:'Помилка доставки')}finally{setLoadingWarehouses(false)}
  },300);
  return()=>clearTimeout(t);
 },[city,warehouseQuery]);

 const shown=useMemo(()=>warehouses.slice(0,60),[warehouses]);

 return <div className="npPicker">
  <input type="hidden" name="city" value={city?.name||''}/>
  <input type="hidden" name="cityRef" value={city?.ref||''}/>
  <input type="hidden" name="warehouse" value={warehouse?.name||''}/>
  <input type="hidden" name="warehouseRef" value={warehouse?.ref||''}/>

  <div className="npField">
   <label>Місто</label>
   <div className="npInput"><MapPin size={18}/><input value={city?city.name:cityQuery} onChange={e=>{setCity(null);setWarehouse(null);setCityQuery(e.target.value)}} placeholder="Почни вводити місто" autoComplete="off"/>{loadingCities&&<span className="npSpinner"/>}</div>
   {!city&&cities.length>0&&<div className="npDropdown">{cities.map(c=><button type="button" key={c.ref} onClick={()=>{setCity(c);setCityQuery(c.name);setCities([]);setWarehouse(null);setWarehouseQuery('')}}><b>{c.name}</b><small>{[c.settlementType,c.area].filter(Boolean).join(' · ')}</small></button>)}</div>}
  </div>

  <div className={"npField "+(!city?'disabled':'')}>
   <label>Відділення або поштомат</label>
   <div className="npInput"><Building2 size={18}/><input disabled={!city} value={warehouse?warehouse.name:warehouseQuery} onChange={e=>{setWarehouse(null);setWarehouseQuery(e.target.value)}} placeholder={city?'Обери або знайди відділення':'Спочатку обери місто'} autoComplete="off"/>{loadingWarehouses&&<span className="npSpinner"/>}</div>
   {city&&!warehouse&&shown.length>0&&<div className="npDropdown warehouseDropdown">{shown.map(w=><button type="button" key={w.ref} onClick={()=>{setWarehouse(w);setWarehouseQuery(w.name)}}><b>{w.name}</b>{w.shortAddress&&<small>{w.shortAddress}</small>}</button>)}</div>}
  </div>

  {city&&warehouse&&<div className="npSelected"><MapPin size={16}/><div><b>{city.name}</b><span>{warehouse.name}</span></div></div>}
  {error&&<div className="formMessage">{error}</div>}
 </div>
}
