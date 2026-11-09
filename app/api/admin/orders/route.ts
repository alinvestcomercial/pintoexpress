import {NextResponse} from "next/server";
import {cookies} from "next/headers";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
export async function GET(){
 const t=(await cookies()).get("pe_access_token")?.value;
 if(!t)return NextResponse.json({error:"Não autorizado."},{status:401});
 const p=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+t,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
 const pr=await p.json(); if(!p.ok||!pr?.[0]?.active)return NextResponse.json({error:"Não autorizado."},{status:403});
 const q=new URL(url+"/rest/v1/orders"); q.searchParams.set("select","id,reference,status,total_amount,currency,payment_method,payment_status,channel,created_at,updated_at,customer:customers(full_name,phone,whatsapp_phone)");
 q.searchParams.set("order","created_at.desc"); q.searchParams.set("limit","100");
 const r=await fetch(q,{headers:{apikey:key,Authorization:"Bearer "+t},cache:"no-store"}); return NextResponse.json({orders:await r.json()},{status:r.status});
}