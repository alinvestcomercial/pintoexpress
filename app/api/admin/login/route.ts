import {NextResponse} from "next/server";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export async function POST(req:Request){try{const {email,password}=await req.json();if(!url||!key)return NextResponse.json({error:"Autenticação não configurada."},{status:503});
 const r=await fetch(url+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
 const d=await r.json();if(!r.ok)return NextResponse.json({error:d.error_description||d.msg||"Credenciais inválidas."},{status:401});
 const u=await fetch(url+"/auth/v1/user",{headers:{apikey:key,Authorization:"Bearer "+d.access_token}});const user=await u.json();
 const profile=await fetch(url+"/rest/v1/staff_profiles?select=id,full_name,role,active&id=eq."+user.id+"&active=eq.true",{headers:{apikey:key,Authorization:"Bearer "+d.access_token}});
 const rows=await profile.json();if(!profile.ok||!rows.length)return NextResponse.json({error:"A conta existe, mas ainda não tem acesso à área interna."},{status:403});
 const res=NextResponse.json({ok:true});res.cookies.set("pe_access_token",d.access_token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:d.expires_in||3600});if(d.refresh_token)res.cookies.set("pe_refresh_token",d.refresh_token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:2592000});return res;
 }catch{return NextResponse.json({error:"Erro ao processar o acesso."},{status:500});}}
