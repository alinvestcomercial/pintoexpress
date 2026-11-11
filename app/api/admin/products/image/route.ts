import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
export async function POST(req:NextRequest){
 try{
  const token=(await cookies()).get("pe_access_token")?.value;
  if(!token)return NextResponse.json({error:"Sessão inválida."},{status:401});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const headers={apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const profile=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers,body:"{}"});
  const rows=await profile.json();
  if(!profile.ok||!rows?.[0]?.active)return NextResponse.json({error:"Sessão inválida."},{status:401});
  if(!["super_admin","admin","manager","sales"].includes(rows[0].role))return NextResponse.json({error:"Sem permissão para enviar imagens."},{status:403});
  const form=await req.formData(),file=form.get("file");
  if(!(file instanceof File))return NextResponse.json({error:"Seleccione uma imagem."},{status:400});
  const allowed=["image/jpeg","image/png","image/webp"];
  if(!allowed.includes(file.type))return NextResponse.json({error:"Formato não suportado. Use JPG, PNG ou WebP."},{status:400});
  if(file.size>5*1024*1024)return NextResponse.json({error:"A imagem não pode ultrapassar 5 MB."},{status:400});
  const ext=file.type==="image/jpeg"?"jpg":file.type==="image/png"?"png":"webp";
  const objectPath="catalog/"+crypto.randomUUID()+"."+ext;
  const upload=await fetch(url+"/storage/v1/object/product-images/"+objectPath,{method:"POST",headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":file.type,"x-upsert":"false"},body:await file.arrayBuffer()});
  const result=await upload.json().catch(()=>({}));
  if(!upload.ok)return NextResponse.json({error:result.message||"Falha ao enviar imagem para o armazenamento."},{status:upload.status});
  return NextResponse.json({image_url:url+"/storage/v1/object/public/product-images/"+objectPath});
 }catch{return NextResponse.json({error:"Não foi possível enviar a imagem."},{status:500})}
}
