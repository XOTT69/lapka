const suppliers=[
 {id:'source_a',name:'Catalog source A',format:'XML/YML',status:'connected'},
 {id:'source_b',name:'Catalog source B',format:'XML',status:'awaiting-feed'},
 {id:'source_c',name:'Catalog source C',format:'XML',status:'awaiting-feed'}
];
export async function GET(){return Response.json({suppliers})}
