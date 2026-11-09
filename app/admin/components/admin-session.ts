import {cookies} from "next/headers";
import {redirect} from "next/navigation";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
export type AdminProfile={id:string;full_name:string|null;role:string;active:boolean};
export async function getAdminSession(){
 const token=(await cookies()).get("pe_access_token")?.value;
 if(!token) redirect("/admin/login");
 const r=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
 const rows=await r.json();
 if(!r.ok||!Array.isArray(rows)||!rows[0]?.active) redirect("/admin/login");
 return {token,profile:rows[0] as AdminProfile};
}