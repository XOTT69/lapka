type NPBody={action?:'cities'|'warehouses';query?:string;cityRef?:string};

async function npRequest(apiKey:string,modelName:string,calledMethod:string,methodProperties:Record<string,string>){
 const r=await fetch('https://api.novaposhta.ua/v2.0/json/',{
  method:'POST',
  headers:{'content-type':'application/json'},
  body:JSON.stringify({apiKey,modelName,calledMethod,methodProperties}),
  cache:'no-store'
 });
 if(!r.ok)throw new Error('Nova Poshta HTTP '+r.status);
 return r.json();
}

export async function POST(req:Request){
 try{
  const key=process.env.NOVA_POSHTA_API_KEY;
  if(!key)return Response.json({ok:false,configured:false,message:'Nova Poshta API key is not configured.'},{status:503});

  const body=(await req.json()) as NPBody;
  if(body.action==='cities'){
   const q=(body.query||'').trim();
   if(q.length<2)return Response.json({ok:true,data:[]});
   const raw=await npRequest(key,'Address','getCities',{FindByString:q,Limit:'20',Page:'1'});
   const data=Array.isArray(raw.data)?raw.data.map((x:any)=>({
    ref:String(x.Ref||''),
    name:String(x.Description||x.DescriptionRu||''),
    area:String(x.AreaDescription||''),
    settlementType:String(x.SettlementTypeDescription||'')
   })).filter((x:any)=>x.ref&&x.name):[];
   return Response.json({ok:Boolean(raw.success),data,errors:raw.errors||[]});
  }

  if(body.action==='warehouses'){
   const cityRef=(body.cityRef||'').trim();
   if(!cityRef)return Response.json({ok:false,data:[],message:'CityRef required'},{status:400});
   const raw=await npRequest(key,'AddressGeneral','getWarehouses',{CityRef:cityRef,FindByString:(body.query||'').trim(),Limit:'100',Page:'1',Language:'UA'});
   const data=Array.isArray(raw.data)?raw.data.map((x:any)=>({
    ref:String(x.Ref||''),
    number:String(x.Number||''),
    name:String(x.Description||''),
    shortAddress:String(x.ShortAddress||''),
    type:String(x.TypeOfWarehouse||''),
    category:String(x.CategoryOfWarehouse||'')
   })).filter((x:any)=>x.ref&&x.name):[];
   return Response.json({ok:Boolean(raw.success),data,errors:raw.errors||[]});
  }

  return Response.json({ok:false,message:'Unknown action'},{status:400});
 }catch(error){
  return Response.json({ok:false,message:error instanceof Error?error.message:'Nova Poshta error'},{status:502});
 }
}
