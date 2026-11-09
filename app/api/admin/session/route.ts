import {NextResponse} from "next/server";
import {cookies} from "next/headers";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
export async function GET(){
 const t=(await cookies()).get("pe_access_token")?.value;
 if(!t)return NextResponse.json({error:"Não autenticado."},{status:401});
 const r=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+t,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
 const x=await r.json();
 if(!r.ok||!Array.isArray(x)||!x[0]?.active)return NextResponse.json({error:"Não autorizado."},{status:403});
 return NextResponse.json({profile:{id:x[0].id,full_name:x[0].full_name,role:x[0].role,active:x[0].active}});
}