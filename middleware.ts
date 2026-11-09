import {NextRequest,NextResponse} from "next/server";
const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function validate(token:string){try{const r=await fetch(supabaseUrl+"/auth/v1/user",{headers:{apikey:supabaseKey!,Authorization:"Bearer "+token},cache:"no-store"});return r.ok}catch{return false}}
export async function middleware(request:NextRequest){
 const path=request.nextUrl.pathname;
 const isLogin=path==="/admin/login";
 if(!path.startsWith("/admin")) return NextResponse.next();
 if(!supabaseUrl||!supabaseKey) return isLogin?NextResponse.next():NextResponse.redirect(new URL("/admin/login",request.url));
 const access=request.cookies.get("pe_access_token")?.value;
 const refresh=request.cookies.get("pe_refresh_token")?.value;
 if(access&&await validate(access)){
  return isLogin?NextResponse.redirect(new URL("/admin",request.url)):NextResponse.next();
 }
 if(!refresh) return isLogin?NextResponse.next():NextResponse.redirect(new URL("/admin/login",request.url));
 try{
  const r=await fetch(supabaseUrl+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{apikey:supabaseKey,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:refresh}),cache:"no-store"});
  if(!r.ok) return isLogin?NextResponse.next():NextResponse.redirect(new URL("/admin/login",request.url));
  const session=await r.json();
  const destination=isLogin?new URL("/admin",request.url):request.nextUrl;
  const response=isLogin?NextResponse.redirect(destination):NextResponse.next();
  const secure=process.env.NODE_ENV==="production";
  response.cookies.set("pe_access_token",session.access_token,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:session.expires_in||3600});
  if(session.refresh_token) response.cookies.set("pe_refresh_token",session.refresh_token,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:2592000});
  return response;
 }catch{return isLogin?NextResponse.next():NextResponse.redirect(new URL("/admin/login",request.url))}
}
export const config={matcher:["/admin/:path*"]};