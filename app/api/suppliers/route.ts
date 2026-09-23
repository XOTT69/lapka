const suppliers=[
 {id:'zoobaza',name:'ZooBaza',format:'XML/YML',status:'connected',feed:'https://basmati.com.ua/zoobaza_full.php'},
 {id:'todli',name:'Todli B2B',format:'XML',status:'awaiting-feed'},
 {id:'collar',name:'COLLAR',format:'XML',status:'awaiting-feed'}
];
export async function GET(){return Response.json({suppliers,note:'ZooBaza connected. Other supplier feed URLs stay server-side once received.'})}
