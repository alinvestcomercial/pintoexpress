import {NextResponse} from "next/server";
import {cookies} from "next/headers";
export async function GET(req:Request){
 const t=(await cookies()).get("pe_access_token")?.value;if(!t)return NextResponse.json({error:"Não autenticado."},{status:401});
 const period=Math.max(1,Math.min(365,Number(new URL(req.url).searchParams.get("period")||30)));
 const u=process.env.NEXT_PUBLIC_SUPABASE_URL!,k=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,h={apikey:k,Authorization:"Bearer "+t,"Content-Type":"application/json"};
 const p=await fetch(u+"/rest/v1/rpc/staff_get_reports",{method:"POST",headers:h,body:JSON.stringify({p_period:period})});
 if(!p.ok)return NextResponse.json({error:"Não foi possível carregar os relatórios."},{status:p.status});
 return NextResponse.json(await p.json(),{headers:{"Cache-Control":"no-store"}});
}