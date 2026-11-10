import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const bucket="fulfillment-proofs";
const roles=["super_admin","admin","manager","logistics"];
async function staff(){const token=(await cookies()).get("pe_access_token")?.value;if(!token)return null;const r=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:"{}",cache:"no-store"});if(!r.ok)return null;const rows=await r.json();return Array.isArray(rows)&&rows[0]?.active?{token,profile:rows[0]}:null}
const headers=(token:string)=>({apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"});
export async function POST(req:NextRequest){
 const a=await staff();if(!a)return NextResponse.json({error:"Sessão inválida."},{status:401});
 if(!roles.includes(a.profile.role))return NextResponse.json({error:"Sem permissão para anexar comprovativos logísticos."},{status:403});
 try{
  const form=await req.formData();const fulfillmentId=String(form.get("fulfillment_id")||"");const file=form.get("file");
  if(!fulfillmentId||!(file instanceof File))return NextResponse.json({error:"Seleccione a operação e o ficheiro."},{status:400});
  const allowed=["application/pdf","image/jpeg","image/png","image/webp"];
  if(!allowed.includes(file.type))return NextResponse.json({error:"Formato não permitido. Use PDF, JPG, PNG ou WEBP."},{status:415});
  if(file.size<1||file.size>12*1024*1024)return NextResponse.json({error:"O ficheiro deve ter até 12 MB."},{status:413});
  const fr=await fetch(url+"/rest/v1/fulfillments?select=id,order_id&id=eq."+encodeURIComponent(fulfillmentId),{headers:headers(a.token),cache:"no-store"});const fd=await fr.json();if(!fr.ok||!fd[0])return NextResponse.json({error:"Operação logística não encontrada."},{status:404});
  const safeName=file.name.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._-]+/g,"-").slice(-100)||"comprovativo";
  const path=fulfillmentId+"/"+crypto.randomUUID()+"-"+safeName;
  const upload=await fetch(url+"/storage/v1/object/"+bucket+"/"+path.split("/").map(encodeURIComponent).join("/"),{method:"POST",headers:{apikey:key,Authorization:"Bearer "+a.token,"Content-Type":file.type,"x-upsert":"false"},body:await file.arrayBuffer()});
  if(!upload.ok){const err=await upload.json().catch(()=>({}));return NextResponse.json({error:err.message||"Falha ao guardar o ficheiro no armazenamento seguro."},{status:400})}
  const metadata={fulfillment_id:fulfillmentId,order_id:fd[0].order_id,bucket_id:bucket,object_path:path,file_name:file.name.slice(0,255),mime_type:file.type,file_size:file.size,uploaded_by:a.profile.id};
  const save=await fetch(url+"/rest/v1/fulfillment_proofs",{method:"POST",headers:{...headers(a.token),Prefer:"return=representation"},body:JSON.stringify(metadata)});
  const sd=await save.json().catch(()=>[]);
  if(!save.ok){await fetch(url+"/storage/v1/object/"+bucket+"/"+path.split("/").map(encodeURIComponent).join("/"),{method:"DELETE",headers:headers(a.token)});return NextResponse.json({error:sd.message||"Ficheiro guardado, mas não foi possível associá-lo à encomenda."},{status:400})}
  return NextResponse.json({proof:sd[0]},{status:201});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Não foi possível anexar o comprovativo."},{status:400})}
}
export async function GET(req:NextRequest){
 const a=await staff();if(!a)return NextResponse.json({error:"Sessão inválida."},{status:401});
 if(!roles.includes(a.profile.role))return NextResponse.json({error:"Sem permissão para consultar comprovativos."},{status:403});
 const id=req.nextUrl.searchParams.get("id");if(!id)return NextResponse.json({error:"Comprovativo não indicado."},{status:400});
 const r=await fetch(url+"/rest/v1/fulfillment_proofs?select=id,bucket_id,object_path,file_name,mime_type,file_size,created_at,fulfillment_id,order_id&id=eq."+encodeURIComponent(id),{headers:headers(a.token),cache:"no-store"});const rows=await r.json();if(!r.ok||!rows[0])return NextResponse.json({error:"Comprovativo não encontrado."},{status:404});
 const p=rows[0];const signed=await fetch(url+"/storage/v1/object/sign/"+p.bucket_id+"/"+p.object_path.split("/").map(encodeURIComponent).join("/"),{method:"POST",headers:headers(a.token),body:JSON.stringify({expiresIn:300})});const sd=await signed.json();if(!signed.ok)return NextResponse.json({error:sd.message||"Não foi possível abrir o comprovativo."},{status:400});
 const signedUrl=sd.signedURL||sd.signedUrl;return NextResponse.json({url:signedUrl?.startsWith("http")?signedUrl:url+"/storage/v1"+signedUrl});
}
