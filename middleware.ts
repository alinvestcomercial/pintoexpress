import {NextResponse, type NextRequest} from "next/server";
const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function middleware(request:NextRequest){
  if(!request.nextUrl.pathname.startsWith("/admin")||request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  const access=request.cookies.get("pe_access_token")?.value;
  const refresh=request.cookies.get("pe_refresh_token")?.value;
  if(access) return NextResponse.next();
  if(!refresh||!supabaseUrl||!supabaseKey) return NextResponse.redirect(new URL("/admin/login",request.url));
  try{
    const r=await fetch(supabaseUrl+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{apikey:supabaseKey,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:refresh})});
    if(!r.ok) return NextResponse.redirect(new URL("/admin/login",request.url));
    const session=await r.json(); const response=NextResponse.next(); const secure=process.env.NODE_ENV==="production";
    response.cookies.set("pe_access_token",session.access_token,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:session.expires_in||3600});
    if(session.refresh_token) response.cookies.set("pe_refresh_token",session.refresh_token,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:2592000});
    return response;
  }catch{return NextResponse.redirect(new URL("/admin/login",request.url))}
}
export const config={matcher:["/admin/:path*"]};