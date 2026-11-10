import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
export async function GET(){
 const token=(await cookies()).get("pe_access_token")?.value;
 if(!token)return NextResponse.json({error:"Não autenticado."},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
 const h={apikey:key,Authorization:"Bearer "+token};
 const r=await fetch(url+"/rest/v1/business_settings?select=*&id=eq.true",{headers:h,cache:"no-store"});
 if(!r.ok)return NextResponse.json({error:"Não foi possível carregar as configurações."},{status:r.status});
 const rows=await r.json();return NextResponse.json({settings:rows[0]||null});
}
export async function PATCH(req:NextRequest){
 const token=(await cookies()).get("pe_access_token")?.value;
 if(!token)return NextResponse.json({error:"Não autenticado."},{status:401});
 const body=await req.json();
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
 const h={apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"};
 const p=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:h,body:"{}"});
 const rows=await p.json();const role=rows?.[0]?.role;
 if(!p.ok||!["super_admin","admin"].includes(role))return NextResponse.json({error:"Sem permissão para alterar configurações."},{status:403});
 const allowed=["mpesa_enabled","","bank_transfer_enabled","bank_name","bank_account_name","bank_account_number","bank_nib","whatsapp_number"];
 const payload=Object.fromEntries(Object.entries(body).filter(([k])=>allowed.includes(k)));payload.updated_at=new Date().toISOString();
 const r=await fetch(url+"/rest/v1/business_settings?id=eq.true",{method:"PATCH",headers:{...h,Prefer:"return=representation"},body:JSON.stringify(payload)});
 if(!r.ok)return NextResponse.json({error:"Não foi possível guardar as configurações."},{status:r.status});
 return NextResponse.json({settings:(await r.json())[0]});
}