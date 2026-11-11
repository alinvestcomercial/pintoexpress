"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Save, Settings2, MessageCircle, Landmark, CreditCard, ShieldCheck, Info, Plus, Trash2, Palette, ShoppingCart, Truck, Building2 } from "lucide-react";

type Bank={id:string;name:string;account_name:string;account_number:string;nib:string;logo_url:string;active:boolean};
type S={
 mpesa_enabled:boolean;bank_transfer_enabled:boolean;whatsapp_number:string;platform_name:string;platform_tagline:string;
 logo_url:string;favicon_url:string;support_email:string;phone_number:string;address:string;city:string;currency:string;timezone:string;
 order_prefix:string;reservation_expiry_hours:number;low_stock_threshold:number;require_payment_proof:boolean;auto_reserve_on_confirmation:boolean;
 notify_whatsapp_on_order:boolean;notify_whatsapp_on_payment:boolean;notify_whatsapp_on_delivery:boolean;default_order_status:string;banks:Bank[];
};

const defaults:S={
 mpesa_enabled:false,bank_transfer_enabled:false,whatsapp_number:"258842553641",platform_name:"PintoExpress",platform_tagline:"",
 logo_url:"",favicon_url:"",support_email:"",phone_number:"258842553641",address:"",city:"Maputo",currency:"MZN",
 timezone:"Africa/Maputo",order_prefix:"PED",reservation_expiry_hours:24,low_stock_threshold:10,require_payment_proof:true,
 auto_reserve_on_confirmation:true,notify_whatsapp_on_order:true,notify_whatsapp_on_payment:true,notify_whatsapp_on_delivery:true,
 default_order_status:"pending",banks:[]
};

export default function SettingsClient({role}:{role:string}){
 const [s,setS]=useState<S>(defaults);
 const [busy,setBusy]=useState(true);
 const [saving,setSaving]=useState(false);
 const [msg,setMsg]=useState("");
 const [error,setError]=useState("");
 const can=["super_admin","admin"].includes(role);

 const load=async()=>{
  setBusy(true);setError("");
  try{
   const r=await fetch("/api/admin/settings",{cache:"no-store"});
   const d=await r.json();
   if(!r.ok)throw new Error(d.error||"Erro ao carregar.");
   setS({...defaults,...d.settings,banks:d.settings?.banks||[]});
  }catch(e){setError(e instanceof Error?e.message:"Erro ao carregar.");}
  finally{setBusy(false);}
 };
 useEffect(()=>{load();},[]);

 const setField=(key:keyof S,value:unknown)=>setS(x=>({...x,[key]:value}));
 const setBank=(index:number,key:keyof Bank,value:unknown)=>setS(x=>({
  ...x,banks:x.banks.map((bank,i)=>i===index?{...bank,[key]:value}:bank)
 }));

 const uploadLogo=(kind:"logo"|"favicon")=>(event:React.ChangeEvent<HTMLInputElement>)=>{
  const file=event.target.files?.[0];
  if(!file)return;
  if(!file.type.startsWith("image/")){setError("Seleccione uma imagem válida.");return;}
  const reader=new FileReader();
  reader.onload=()=>setField(kind==="logo"?"logo_url":"favicon_url",String(reader.result||""));
  reader.readAsDataURL(file);
 };

 const addBank=()=>setS(x=>({...x,banks:[...x.banks,{
  id:crypto.randomUUID(),name:"",account_name:"",account_number:"",nib:"",logo_url:"",active:true
 }]}));

 const removeBank=(index:number)=>setS(x=>({...x,banks:x.banks.filter((_,i)=>i!==index)}));

 const save=async()=>{
  setSaving(true);setMsg("");setError("");
  try{
   const r=await fetch("/api/admin/settings",{
    method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)
   });
   const d=await r.json();
   if(!r.ok)throw new Error(d.error||"Não foi possível guardar.");
   setS({...defaults,...d.settings,banks:d.settings?.banks||[]});
   setMsg("Configurações guardadas com sucesso.");
  }catch(e){setError(e instanceof Error?e.message:"Não foi possível guardar.");}
  finally{setSaving(false);}
 };

 const renderBank=(bank:Bank,index:number)=>(
  <div className="settings-bank" key={bank.id||String(index)}>
   <div className="settings-bank-logo">
    {bank.logo_url?<img src={bank.logo_url} alt="" />:<Landmark size={17}/>}
   </div>
   <div className="settings-bank-fields">
    <input placeholder="Banco" value={bank.name} disabled={!can} onChange={e=>setBank(index,"name",e.target.value)}/>
    <input placeholder="Titular" value={bank.account_name} disabled={!can} onChange={e=>setBank(index,"account_name",e.target.value)}/>
    <input placeholder="N.º conta" value={bank.account_number} disabled={!can} onChange={e=>setBank(index,"account_number",e.target.value)}/>
    <input placeholder="NIB" value={bank.nib} disabled={!can} onChange={e=>setBank(index,"nib",e.target.value)}/>
    <input placeholder="URL do logotipo" value={bank.logo_url} disabled={!can} onChange={e=>setBank(index,"logo_url",e.target.value)}/>
   </div>
   <button type="button" className="settings-remove" disabled={!can} onClick={()=>removeBank(index)} aria-label="Remover conta">
    <Trash2 size={14}/>
   </button>
  </div>
 );

 return (
  <div className="settings-workspace">
   <div className="admin-pagebar settings-heading">
    <div className="admin-pagebar-copy">
     <span className="eyebrow">PARÂMETROS DA PLATAFORMA</span>
     <h1>Configurações</h1>
     <p>Configure identidade, pagamentos, operação, comunicação e regras do PintoExpress.</p>
    </div>
    <button className="admin-secondary-action" onClick={load} disabled={busy}><RefreshCw size={15}/> Actualizar</button>
   </div>

   {(msg||error)&&(
    <div className={error?"settings-message error":"settings-message"}>
     <Info size={15}/><span>{error||msg}</span>
    </div>
   )}

   {!can&&(
    <div className="settings-readonly">
     <ShieldCheck size={16}/>
     <div><strong>Modo consulta</strong><span>O seu perfil pode consultar estas configurações, mas apenas administradores podem alterá-las.</span></div>
    </div>
   )}

   <div className="settings-section-intro"><div><span className="eyebrow">CENTRO DE CONTROLO</span><h2>Definições da operação</h2><p>Organize a identidade, pagamentos, vendas, comunicação e logística num único lugar.</p></div><span className="settings-save-hint">Alterações guardadas aplicam-se aos módulos correspondentes.</span></div><div className="settings-grid">
    <section className="settings-card settings-card-identity">
     <header><div className="settings-icon"><Palette size={18}/></div><div><span className="eyebrow">IDENTIDADE</span><h2>Marca e apresentação</h2><p>Dados usados no website, checkout e comunicações.</p></div></header>
     <div className="settings-form-grid">
      <label>Nome da plataforma<input value={s.platform_name} disabled={!can} onChange={e=>setField("platform_name",e.target.value)}/></label>
      <label>Frase institucional<input value={s.platform_tagline} disabled={!can} onChange={e=>setField("platform_tagline",e.target.value)}/></label>
      <label>Logotipo<input type="file" accept="image/*" disabled={!can} onChange={uploadLogo("logo")}/></label>
      <label>Favicon<input type="file" accept="image/*" disabled={!can} onChange={uploadLogo("favicon")}/></label>
     </div>
     {s.logo_url&&<img className="settings-logo-preview" src={s.logo_url} alt="Logotipo"/>}
    </section>

    <section className="settings-card settings-card-company">
     <header><div className="settings-icon"><Building2 size={18}/></div><div><span className="eyebrow">EMPRESA</span><h2>Dados comerciais</h2><p>Informações institucionais e canais oficiais.</p></div></header>
     <div className="settings-form-grid">
      <label>Email de suporte<input type="email" value={s.support_email} disabled={!can} onChange={e=>setField("support_email",e.target.value)}/></label>
      <label>Telefone<input value={s.phone_number} disabled={!can} onChange={e=>setField("phone_number",e.target.value)}/></label>
      <label>Cidade<input value={s.city} disabled={!can} onChange={e=>setField("city",e.target.value)}/></label>
      <label>Endereço<input value={s.address} disabled={!can} onChange={e=>setField("address",e.target.value)}/></label>
     </div>
    </section>

    <section className="settings-card settings-card-payments">
     <header><div className="settings-icon"><CreditCard size={18}/></div><div><span className="eyebrow">PAGAMENTOS</span><h2>Meios de pagamento</h2><p>M-Pesa e múltiplas contas bancárias.</p></div></header>
     <label className="settings-toggle"><span><b>M-Pesa</b><small>Disponível no checkout.</small></span><input type="checkbox" checked={s.mpesa_enabled} disabled={!can} onChange={e=>setField("mpesa_enabled",e.target.checked)}/><i/></label>
     <label className="settings-toggle"><span><b>Transferência bancária</b><small>Disponível quando existir uma conta activa.</small></span><input type="checkbox" checked={s.bank_transfer_enabled} disabled={!can} onChange={e=>setField("bank_transfer_enabled",e.target.checked)}/><i/></label>
     <div className="settings-bank-list">{s.banks.map(renderBank)}</div>
     <button type="button" className="admin-secondary-action settings-add-bank" disabled={!can} onClick={addBank}><Plus size={14}/> Adicionar conta bancária</button>
    </section>

    <section className="settings-card settings-card-communication">
     <header><div className="settings-icon"><MessageCircle size={18}/></div><div><span className="eyebrow">COMUNICAÇÃO</span><h2>WhatsApp e notificações</h2><p>Defina os eventos que podem gerar comunicação.</p></div></header>
     <label>WhatsApp / telefone<input value={s.whatsapp_number} disabled={!can} onChange={e=>setField("whatsapp_number",e.target.value)}/></label>
     <label className="settings-toggle"><span><b>Nova encomenda</b><small>Permitir notificação WhatsApp.</small></span><input type="checkbox" checked={s.notify_whatsapp_on_order} disabled={!can} onChange={e=>setField("notify_whatsapp_on_order",e.target.checked)}/><i/></label>
     <label className="settings-toggle"><span><b>Pagamento registado</b><small>Permitir notificação WhatsApp.</small></span><input type="checkbox" checked={s.notify_whatsapp_on_payment} disabled={!can} onChange={e=>setField("notify_whatsapp_on_payment",e.target.checked)}/><i/></label>
     <label className="settings-toggle"><span><b>Entrega / logística</b><small>Permitir notificação WhatsApp.</small></span><input type="checkbox" checked={s.notify_whatsapp_on_delivery} disabled={!can} onChange={e=>setField("notify_whatsapp_on_delivery",e.target.checked)}/><i/></label>
    </section>

    <section className="settings-card settings-card-orders">
     <header><div className="settings-icon"><ShoppingCart size={18}/></div><div><span className="eyebrow">ENCOMENDAS</span><h2>Regras do fluxo</h2><p>Controlos que afectam o ciclo da encomenda.</p></div></header>
     <div className="settings-form-grid">
      <label>Prefixo das encomendas<input value={s.order_prefix} disabled={!can} onChange={e=>setField("order_prefix",e.target.value)}/></label>
      <label>Estado inicial<select value={s.default_order_status} disabled={!can} onChange={e=>setField("default_order_status",e.target.value)}><option value="pending">Pendente</option><option value="confirmed">Confirmada</option></select></label>
      <label>Expiração de reserva (horas)<input type="number" min="1" value={s.reservation_expiry_hours} disabled={!can} onChange={e=>setField("reservation_expiry_hours",Number(e.target.value))}/></label>
      <label>Nível de alerta de stock<input type="number" min="0" value={s.low_stock_threshold} disabled={!can} onChange={e=>setField("low_stock_threshold",Number(e.target.value))}/></label>
     </div>
     <label className="settings-toggle"><span><b>Reservar stock ao confirmar encomenda</b><small>Liga directamente Encomendas + Stock.</small></span><input type="checkbox" checked={s.auto_reserve_on_confirmation} disabled={!can} onChange={e=>setField("auto_reserve_on_confirmation",e.target.checked)}/><i/></label>
     <label className="settings-toggle"><span><b>Exigir comprovativo de pagamento</b><small>Controla o fluxo de validação financeira.</small></span><input type="checkbox" checked={s.require_payment_proof} disabled={!can} onChange={e=>setField("require_payment_proof",e.target.checked)}/><i/></label>
    </section>

    <section className="settings-card settings-card-logistics">
     <header><div className="settings-icon"><Truck size={18}/></div><div><span className="eyebrow">LOGÍSTICA</span><h2>Operação de entrega</h2><p>Parâmetros gerais usados pela equipa logística.</p></div></header>
     <div className="settings-rules"><div><b>Moeda</b><span>{s.currency}</span></div><div><b>Fuso horário</b><span>{s.timezone}</span></div><div><b>Reservas</b><span>Expiram após {s.reservation_expiry_hours} horas.</span></div></div>
    </section>

    <section className="settings-card settings-card-system">
     <header><div className="settings-icon"><Settings2 size={18}/></div><div><span className="eyebrow">SISTEMA</span><h2>Ambiente operacional</h2><p>Definições base da plataforma.</p></div></header>
     <div className="settings-form-grid">
      <label>Moeda<input value={s.currency} disabled={!can} onChange={e=>setField("currency",e.target.value)}/></label>
      <label>Fuso horário<input value={s.timezone} disabled={!can} onChange={e=>setField("timezone",e.target.value)}/></label>
     </div>
    </section>
   </div>

   {can&&<div className="settings-actions"><span>As alterações ficam disponíveis nos módulos que utilizam estes parâmetros.</span><button className="admin-primary-action" onClick={save} disabled={saving||busy}><Save size={15}/>{saving?"A guardar...":"Guardar configurações"}</button></div>}
  </div>
 );
}
