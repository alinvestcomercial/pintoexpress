"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {ArrowRight,Minus,Plus,Trash2,ShoppingBasket,MessageCircle,Send,CheckCircle2,Package} from "lucide-react";
import {SiteFrame} from "../components/SiteChrome";
import {useCart} from "../components/CartProvider";

const whatsapp=process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"";
const packageNames:Record<string,string>={
  "ross-50-iniciante":"Primeiro Lote Ross — 50 aves",
  "cobb-100-iniciante":"Lote Cobb 100 — 100 aves",
  "ross-200-iniciante":"Lote Ross 200 — 200 aves",
  "cobb-500-experiente":"Lote Cobb 500 — 500 aves",
  "ross-1000-experiente":"Lote Ross 1.000 — 1.000 aves"
};

export default function PedidoPage(){
  const {items,setQty,remove,clear}=useCart();
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [location,setLocation]=useState("");
  const [delivery,setDelivery]=useState("A combinar");
  const [notes,setNotes]=useState("");
  const [size,setSize]=useState("100");
  const [feedback,setFeedback]=useState("");
  const [reference,setReference]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [model,setModel]=useState("");
  const [packageId,setPackageId]=useState("");
  const [species,setSpecies]=useState("");
  const [lot,setLot]=useState("");
  const [experience,setExperience]=useState("");
  const [flow,setFlow]=useState("");

  useEffect(()=>{
    const q=new URLSearchParams(window.location.search);
    setModel(q.get("modelo")||"");
    setPackageId(q.get("pacote")||"");
    setSpecies(q.get("especie")||"");
    setLot(q.get("lote")||"");
    setExperience(q.get("experiencia")||"");
    setFlow(q.get("fluxo")||"");
    if(q.get("lote")) setSize(q.get("lote")!.replace(/[^0-9]/g,"")||"100");
  },[]);

  const count=items.reduce((n,x)=>n+x.quantity,0);
  const packageName=packageId.startsWith("standard-")
    ? "Pacote standard "+packageId.replace("standard-","")+" aves — "+(species||"linhagem a escolher")
    : packageNames[packageId]||(model==="pacote-personalizado"?"Pacote personalizado":model==="kit"?"Kit de criação":"");

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!items.length&&!model){setFeedback("Escolha um pacote ou adicione pelo menos um produto antes de enviar.");return;}
    if(submitting)return;
    setSubmitting(true); setFeedback(""); setReference("");

    const packageSlug=packageId.startsWith("standard-")
      ? `standard-${(species||"ross").toLowerCase()}-${lot||size}`
      : "";

    try{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if(!url||!key) throw new Error("Serviço de encomendas indisponível.");

      const response=await fetch(url+"/rest/v1/rpc/create_order_request",{
        method:"POST",
        headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json"},
        body:JSON.stringify({
          p_name:name,
          p_phone:phone,
          p_location:location,
          p_package_slug:packageSlug||null,
          p_bird_type:species?species.toLowerCase():null,
          p_quantity:packageSlug?1:null,
          p_delivery:delivery,
          p_notes:notes||null
        })
      });

      const data=await response.json();
      if(!response.ok) throw new Error(data?.message||"Não foi possível registar o pedido.");
      const result=Array.isArray(data)?data[0]:data;
      setReference(result.reference);

      const message=[
        "Olá, PintoExpress. Registei um pedido no site.",
        "",
        "Referência: "+result.reference,
        "Nome: "+name,
        "Telefone: "+phone,
        "Localização: "+location,
        "Modelo: "+(packageName||"Produtos individuais"),
        "Espécie: "+(species||"A definir"),
        "Lote: "+(lot||size+" aves"),
        "Recepção: "+delivery,
        "",
        "Observações: "+(notes||"Sem observações"),
        "Peço a confirmação do preço final, disponibilidade e modalidade de pagamento aplicável."
      ].join("\n");

      if(whatsapp){
        window.open("https://wa.me/"+whatsapp.replace(/[^0-9]/g,"")+"?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
      }
      setFeedback("Pedido registado. Guarde a referência para acompanhar a encomenda. A equipa irá dar seguimento ao pedido e às instruções da modalidade escolhida.");
    }catch(error){
      setFeedback(error instanceof Error?error.message:"Não foi possível registar o pedido.");
    }finally{
      setSubmitting(false);
    }
  }

  return <SiteFrame>
    <section className="page-hero"><div className="container">
      <span className="eyebrow light">A SUA ENCOMENDA</span>
      <h1>Vamos preparar a sua encomenda.</h1>
      <p>Confirme os seus dados. A PintoExpress valida o valor e a disponibilidade antes de indicar a forma de pagamento.</p>
    </div></section>
    <section className="container section page-content">
      <div className="section-heading"><div>
        <span className="eyebrow">O seu pedido</span><h2>Produtos seleccionados ({count})</h2>
        <p>Preço, stock e condições serão confirmados pela equipa.</p>
      </div><Link href="/catalogo">Continuar a explorar <ArrowRight size={15}/></Link></div>

      {model&&<div className="package-request-banner"><Package size={19}/><div>
        <strong>{packageName||"Pedido de pacote personalizado"}</strong>
        <p>{[species,lot,experience].filter(Boolean).join(" · ")||"Indique os detalhes do lote e a equipa ajudará a definir a composição."}</p>
      </div></div>}

      {flow==="compra"&&<div className="checkout-route-notice">
        <strong>Compra de pacote seleccionada</strong>
        <p>O preço e a configuração de pagamento ainda serão validados pela equipa. Esta etapa regista o pedido; não inicia uma cobrança M-Pesa.</p>
        <Link href="/como-comprar">Como funciona o pagamento <ArrowRight size={14}/></Link>
      </div>}

      <div className="order-layout">
        <div className="cart-panel">
          <div className="panel-heading"><div><ShoppingBasket size={18}/><strong>Produtos adicionais</strong></div><span>{items.length} referência(s)</span></div>
          {!items.length?<div className="empty-cart"><ShoppingBasket size={28}/><strong>Ainda não adicionou produtos.</strong><p>{model?"Não é obrigatório. O pacote seleccionado já inicia a sua encomenda.":"Explore o catálogo e adicione os produtos que pretende consultar."}</p><Link href="/catalogo">Explorar catálogo <ArrowRight size={15}/></Link></div>
          :<div className="cart-lines">{items.map(x=><div className="cart-line" key={x.id}><div className="cart-line-info"><strong>{x.name}</strong><small>{x.category} · preço sob consulta</small><div className="quantity-control"><button type="button" onClick={()=>setQty(x.id,x.quantity-1)} aria-label="Diminuir"><Minus size={13}/></button><b>{x.quantity}</b><button type="button" onClick={()=>setQty(x.id,x.quantity+1)} aria-label="Aumentar"><Plus size={13}/></button></div></div><button type="button" className="remove-item" onClick={()=>remove(x.id)} aria-label="Remover"><Trash2 size={16}/></button></div>)}</div>}
          <div className="cart-note"><CheckCircle2 size={16}/> O envio desta encomenda não constitui confirmação de pagamento.</div>
        </div>

        <form className="request-form" onSubmit={submit}>
          <div className="panel-heading"><div><Send size={18}/><strong>Dados da encomenda</strong></div><span>Registo digital</span></div>
          <label><span>Nome completo *</span><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Como se chama?"/></label>
          <label><span>Telefone / WhatsApp *</span><input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+258 8x xxx xxxx"/></label>
          <label><span>Província / Localidade *</span><input required value={location} onChange={e=>setLocation(e.target.value)} placeholder="Ex.: Maputo, Matola"/></label>
          <label><span>Preferência de recepção</span><select value={delivery} onChange={e=>setDelivery(e.target.value)}><option>A combinar</option><option>Levantamento</option><option>Entrega (consultar condições)</option></select></label>
          <label><span>Observações</span><textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Data pretendida, capacidade do aviário ou outras informações..."/></label>
          <button className="submit-request" type="submit" disabled={submitting}><MessageCircle size={17}/> {submitting?"A registar...":"Registar encomenda"} <ArrowRight size={16}/></button>
          {reference&&<div className="request-reference" role="status"><strong>Referência: {reference}</strong><span>Use esta referência no WhatsApp, no comprovativo e no acompanhamento.</span><Link href={"/encomendas-entregas?ref="+encodeURIComponent(reference)}>Acompanhar pedido <ArrowRight size={14}/></Link></div>}
          {feedback&&<div className="request-feedback" role="status">{feedback}</div>}
          <small className="privacy-note">Os dados serão utilizados para processar o pedido. A referência é atribuída após o registo efectivo.</small>
        </form>
      </div>
      {items.length>0&&<button className="clear-cart" onClick={clear}>Limpar produtos adicionais</button>}
    </section>
  </SiteFrame>;
}