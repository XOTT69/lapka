export type ProductReview={id:string;productExternalId:string;rating:number;body:string;verified:boolean;authorName:string;createdAt:string};
const URL=process.env.NEXT_PUBLIC_SUPABASE_URL||'https://sulidxtbtblhkhwvggzy.supabase.co';
const KEY=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_UZRENjCh8MgcoU6HleYS4w_F8UrDSGo';
const headers={apikey:KEY,Authorization:'Bearer '+KEY};

export async function getProductReviews(productExternalId:string):Promise<ProductReview[]>{
 const p=new URLSearchParams({select:'id,product_external_id,rating,body,verified,author_name,created_at',product_external_id:'eq.'+productExternalId,order:'created_at.desc',limit:'50'});
 const r=await fetch(URL+'/rest/v1/product_reviews?'+p.toString(),{headers,next:{revalidate:60}});
 if(!r.ok)return [];
 const rows=await r.json() as any[];
 return rows.map(x=>({id:x.id,productExternalId:x.product_external_id,rating:Number(x.rating),body:x.body,verified:Boolean(x.verified),authorName:x.author_name||'Покупець',createdAt:x.created_at}));
}
