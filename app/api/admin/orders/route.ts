import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {queueCustomerWhatsApp} from "../../../../lib/server/notifications";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
async function staff(){const token=(await cookies()).get("pe_access_token")?.value;if(!token||!url||!key)return null;const r=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:"{}",cache:"no-store"});if(!r.ok)return null;const rows=await r.json();if(!Array.isArray(rows)||!rows[0]?.active)return null;return {token,profile:rows[0]}}
export async function GET(){const auth=await staff();if(!auth)return NextResponse.json({error:"Sessão interna inválida."},{status:401});const query=new URLSearchParams({select:"id,reference,status,total_amount,currency,payment_method,payment_status,channel,created_at,customer:customers(full_name,phone,whatsapp_phone),items:order_items(id,item_name,bird_type,quantity,unit_price,line_total),fulfillments(id,type,status,scheduled_for,address,contact_phone,delivery_fee,notes,incident_notes,proof_reference,proofs:fulfillment_proofs(id,file_name,mime_type,file_size,created_at)),stock_reservations(id,quantity,status,lot:inventory_lots(lot_code)),events:order_events(id,status,event_type,message,created_at),payments(id,method,status,amount,external_reference,paid_at,installment_id,proofs:payment_proofs(id,file_path,whatsapp_message_reference,status)),payment_plan:payment_plans(id,total_amount,status,installments:payment_installments(id,installment_number,due_date,amount,paid_amount,status))",order:"created_at.desc",limit:"200"});const r=await fetch(url+"/rest/v1/orders?"+query.toString(),{headers:{apikey:key,Authorization:"Bearer "+auth.token},cache:"no-store"});const data=await r.json();return NextResponse.json(r.ok?{orders:data}:{error:"Não foi possível consultar as encomendas."},{status:r.ok?200:502})}
export async function PATCH(req:NextRequest){const auth=await staff();if(!auth)return NextResponse.json({error:"Sessão interna inválida."},{status:401});const body=await req.json();const id=String(body.id||""),status=String(body.status||""),message=String(body.message||"").slice(0,500);if(!id||!status)return NextResponse.json({error:"Indique a encomenda e o novo estado."},{status:400});const allowed=["draft","pending_payment","payment_submitted","paid","confirmed","preparing","ready","out_for_delivery","ready_for_pickup","completed","cancelled"];if(!allowed.includes(status))return NextResponse.json({error:"Estado inválido."},{status:400});const r=await fetch(url+"/rest/v1/rpc/staff_update_order_status",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+auth.token,"Content-Type":"application/json"},body:JSON.stringify({p_order_id:id,p_status:status,p_message:message||null}),cache:"no-store"});const data=await r.json();if(!r.ok)return NextResponse.json({error:data.message||data.details||"Não foi possível actualizar o estado."},{status:r.status===403?403:400});if(["confirmed","preparing","ready","out_for_delivery","ready_for_pickup","completed"].includes(status)){const labels:Record<string,string>={confirmed:"foi confirmada",preparing:"está em preparação",ready:"está pronta",out_for_delivery:"saiu para entrega",ready_for_pickup:"está pronta para levantamento",completed:"foi concluída"};await queueCustomerWhatsApp({url,key,token:auth.token,orderId:id,event:"order",templateKey:status==="ready"?"order_ready":status==="out_for_delivery"?"delivery_update":"order_received",message:"Olá {{cliente}}. A sua encomenda {{encomenda}} "+labels[status]+". Obrigado por escolher a PintoExpress."}).catch(()=>null)}return NextResponse.json({order:data})}

export async function POST(req:NextRequest){
 const auth=await staff();
 if(!auth)return NextResponse.json({error:"Sessão interna inválida."},{status:401});
 const role=auth.profile.role;
 if(!["super_admin","admin","manager","sales","support"].includes(role))return NextResponse.json({error:"Sem permissão para criar encomendas."},{status:403});
 let body:any;
 try{body=await req.json()}catch{return NextResponse.json({error:"Pedido inválido."},{status:400})}
 const customerId=String(body.customer_id||"");
 const items=Array.isArray(body.items)?body.items:[];
 const method=body.payment_method?String(body.payment_method):null;
 const notes=String(body.notes||"").slice(0,2000);
 if(!customerId||!items.length)return NextResponse.json({error:"Seleccione o cliente e adicione pelo menos um artigo."},{status:400});
 if(method&&!["mpesa","bank_transfer","cash","other"].includes(method))return NextResponse.json({error:"Meio de pagamento inválido."},{status:400});
 const cleanItems=items.map((item:any)=>({kind:item.kind==="package"?"package":"product",id:String(item.id||""),quantity:Number(item.quantity)}));
 if(cleanItems.some((item:any)=>!item.id||!Number.isFinite(item.quantity)||item.quantity<=0))return NextResponse.json({error:"Verifique os artigos e as quantidades."},{status:400});
 const r=await fetch(url+"/rest/v1/rpc/staff_create_backoffice_order",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+auth.token,"Content-Type":"application/json"},body:JSON.stringify({p_customer_id:customerId,p_items:cleanItems,p_payment_method:method,p_notes:notes||null}),cache:"no-store"});
 const data=await r.json();
 if(!r.ok)return NextResponse.json({error:data.message||data.details||"Não foi possível criar a encomenda."},{status:r.status===403?403:400});
 return NextResponse.json({order:data},{status:201});
}
