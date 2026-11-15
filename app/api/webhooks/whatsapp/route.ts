import {createHmac,timingSafeEqual} from "node:crypto";
import {NextRequest,NextResponse} from "next/server";

const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
const verifyToken=process.env.WHATSAPP_VERIFY_TOKEN;
const appSecret=process.env.WHATSAPP_APP_SECRET;
const phone=v=>String(v||"").replace(/[^0-9]/g,"");
const headers=()=>({apikey:serviceKey!,Authorization:"Bearer "+serviceKey!,"Content-Type":"application/json"});

function validSignature(body:string,value:string|null){
  if(!appSecret||!value?.startsWith("sha256="))return false;
  const a=Buffer.from(value),b=Buffer.from("sha256="+createHmac("sha256",appSecret).update(body).digest("hex"));
  return a.length===b.length&&timingSafeEqual(a,b);
}

export async function GET(req:NextRequest){
  const u=new URL(req.url);
  if(u.searchParams.get("hub.mode")!=="subscribe"||u.searchParams.get("hub.verify_token")!==verifyToken)return new NextResponse("Forbidden",{status:403});
  return new NextResponse(u.searchParams.get("hub.challenge")||"",{status:200});
}

export async function POST(req:NextRequest){
  if(!supabaseUrl||!serviceKey||!verifyToken||!appSecret)return NextResponse.json({error:"WhatsApp webhook não está configurado no servidor."},{status:503});
  const raw=await req.text();
  if(!validSignature(raw,req.headers.get("x-hub-signature-256")))return NextResponse.json({error:"Assinatura inválida."},{status:401});
  let payload:any;
  try{payload=JSON.parse(raw)}catch{return NextResponse.json({error:"Payload inválido."},{status:400});}
  if(payload?.object!=="whatsapp_business_account")return NextResponse.json({received:true});
  let stored=0;
  for(const entry of Array.isArray(payload.entry)?payload.entry:[]){
    for(const change of Array.isArray(entry.changes)?entry.changes:[]){
      for(const incoming of Array.isArray(change?.value?.messages)?change.value.messages:[]){
        const providerId=String(incoming?.id||"").trim(),from=phone(incoming?.from);
        if(!providerId||!from)continue;
        const existing=await fetch(supabaseUrl+"/rest/v1/messages?select=id&provider_message_id=eq."+encodeURIComponent(providerId)+"&limit=1",{headers:headers(),cache:"no-store"});
        const existingRows=await existing.json();
        if(existing.ok&&existingRows?.[0])continue;
        let body=String(incoming?.text?.body||"").trim(),subject="WhatsApp recebido";
        if(!body){subject="WhatsApp · "+String(incoming?.type||"mensagem");body="Mensagem recebida no WhatsApp.";}
        const cq=supabaseUrl+"/rest/v1/customers?select=id&or=(phone.eq."+encodeURIComponent(from)+",whatsapp_phone.eq."+encodeURIComponent(from)+")&limit=1";
        const cr=await fetch(cq,{headers:headers(),cache:"no-store"}),cd=await cr.json();
        const customerId=cr.ok?cd?.[0]?.id||null:null;
        const ir=await fetch(supabaseUrl+"/rest/v1/messages",{method:"POST",headers:{...headers(),Prefer:"return=minimal"},body:JSON.stringify({channel:"whatsapp",recipient:from,subject,body,status:"received",created_by:null,attempts:0,provider_message_id:providerId,customer_id:customerId})});
        if(ir.ok)stored++;
        else if(ir.status!==409)console.error("WhatsApp webhook insert failed",await ir.text());
      }
    }
  }
  return NextResponse.json({received:true,stored});
}