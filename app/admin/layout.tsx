import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';

export default async function AdminLayout({children}:{children:React.ReactNode}){
 const supabase=await createClient();
 if(!supabase)redirect('/sign-in');
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/sign-in');
 const {data:admin}=await supabase.from('admin_users').select('id').eq('id',user.id).maybeSingle();
 if(!admin)redirect('/account');
 return children;
}
