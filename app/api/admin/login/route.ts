import {NextResponse} from "next/server";

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function POST(req:Request){
  try{
    const {email,password}=await req.json();
    if(!url||!key) return NextResponse.json({error:"Autenticação não configurada."},{status:503});

    const auth=await fetch(url+"/auth/v1/token?grant_type=password",{
      method:"POST",
      headers:{apikey:key,"Content-Type":"application/json"},
      body:JSON.stringify({email:String(email||"").trim(),password})
    });
    const session=await auth.json();
    if(!auth.ok) return NextResponse.json({error:session.error_description||session.msg||"Credenciais inválidas."},{status:401});

    const profile=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{
      method:"POST",
      headers:{
        apikey:key,
        Authorization:"Bearer "+session.access_token,
        "Content-Type":"application/json"
      },
      body:"{}",
      cache:"no-store"
    });
    const rows=await profile.json();

    if(!profile.ok){
      return NextResponse.json({error:"Não foi possível validar o perfil interno. Tente novamente."},{status:503});
    }
    if(!Array.isArray(rows)||!rows.length){
      return NextResponse.json({error:"A conta foi autenticada, mas não está autorizada para a área interna."},{status:403});
    }

    const res=NextResponse.json({ok:true,profile:rows[0]});
    const secure=process.env.NODE_ENV==="production";
    res.cookies.set("pe_access_token",session.access_token,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:session.expires_in||3600});
    if(session.refresh_token){
      res.cookies.set("pe_refresh_token",session.refresh_token,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:2592000});
    }
    return res;
  }catch{
    return NextResponse.json({error:"Erro ao processar o acesso."},{status:500});
  }
}