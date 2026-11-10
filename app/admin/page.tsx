import Link from "next/link";
import {ArrowUpRight,Boxes,CalendarClock,ClipboardList,Package,Truck,Wallet,AlertTriangle,Clock3,CheckCircle2} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function Admin(){
 const token=(await cookies()).get("pe_access_token")?.value;if(!token)redirect("/admin/login");
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
 const u=await fetch(url+"/auth/v1/user",{headers:{apikey:key,Authorization:"Bearer "+token},cache:"no-store"});if(!u.ok)redirect("/admin/login");
 const user=await u.json();
 const p=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
 const rows=await p.json();if(!p.ok||!Array.isArray(rows)||!rows[0]?.active)redirect("/admin/login");const profile=rows[0];
 return <main className="admin-shell"><AdminHeader name={profile.full_name||user.email||"Equipa"} role={profile.role||""}/><section className="admin-content admin-dashboard-home">
  <header className="ops-hero"><div><span className="eyebrow">BALCÃO DE OPERAÇÃO</span><h1>Visão geral</h1><p>Acompanhe o fluxo do negócio e intervenha onde a operação precisa de atenção.</p></div><div className="ops-hero-date"><CalendarClock size={15}/><span>Operação de hoje</span></div></header>
  <section className="ops-kpis" aria-label="Indicadores principais">
   <Metric icon={<ClipboardList/>} label="Encomendas em curso" value="—" note="Pedidos que ainda não foram concluídos"/>
   <Metric icon={<Boxes/>} label="Stock disponível" value="—" note="Saldo disponível para venda"/>
   <Metric icon={<Wallet/>} label="Por receber" value="—" note="Inclui planos em prestações"/>
   <Metric icon={<Truck/>} label="Operações hoje" value="—" note="Entregas e levantamentos"/>
  </section>
  <section className="ops-grid">
   <article className="ops-panel ops-orders"><PanelHead eyebrow="FLUXO COMERCIAL" title="Encomendas a acompanhar" href="/admin/encomendas" link="Abrir encomendas"/><div className="ops-empty"><ClipboardList/><div><strong>Sem dados carregados</strong><span>As encomendas recentes e os respectivos estados aparecem aqui.</span></div></div></article>
   <article className="ops-panel ops-alerts"><PanelHead eyebrow="ATENÇÃO" title="Pontos que exigem acção"/><div className="ops-alert-list"><AlertRow icon={<Clock3/>} title="Pagamentos pendentes" text="Submissões aguardam validação" href="/admin/pagamentos"/><AlertRow icon={<AlertTriangle/>} title="Reservas a verificar" text="Compromissos de stock por confirmar" href="/admin/reservas"/><AlertRow icon={<Truck/>} title="Logística" text="Entregas e levantamentos em acompanhamento" href="/admin/logistica"/></div></article>
  </section>
  <section className="ops-grid ops-grid-bottom">
   <article className="ops-panel"><PanelHead eyebrow="STOCK" title="Disponibilidade e compromissos" href="/admin/stock" link="Gerir stock"/><div className="ops-stock-bars"><div><span>Disponível</span><strong>—</strong></div><div><span>Reservado</span><strong>—</strong></div><div><span>Em preparação</span><strong>—</strong></div></div></article>
   <article className="ops-panel"><PanelHead eyebrow="FINANCEIRO" title="Recebimentos" href="/admin/pagamentos" link="Abrir financeiro"/><div className="ops-finance-row"><div><span>Recebido</span><strong>—</strong></div><div><span>Por receber</span><strong>—</strong></div><div><span>Em atraso</span><strong>—</strong></div></div></article>
  </section>
  <section className="ops-process"><div className="ops-process-head"><div><span className="eyebrow">CICLO OPERACIONAL</span><h2>Da encomenda à conclusão</h2></div></div><div className="ops-process-steps"><Step n="01" title="Encomenda" text="Entrada do pedido"/><Step n="02" title="Reserva" text="Stock comprometido"/><Step n="03" title="Pagamento" text="Plano e recebimentos"/><Step n="04" title="Preparação" text="Pedido pronto"/><Step n="05" title="Logística" text="Entrega ou levantamento"/><Step n="06" title="Conclusão" text="Operação encerrada"/></div></section>
 </section></main>;
}
function Metric({icon,label,value,note}:{icon:React.ReactNode;label:string;value:string;note:string}){return <article className="ops-metric">{icon}<div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>}
function PanelHead({eyebrow,title,href,link}:{eyebrow:string;title:string;href?:string;link?:string}){return <div className="ops-panel-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{href&&<Link href={href}>{link}<ArrowUpRight size={13}/></Link>}</div>}
function AlertRow({icon,title,text,href}:{icon:React.ReactNode;title:string;text:string;href:string}){return <Link href={href} className="ops-alert-row">{icon}<span><strong>{title}</strong><small>{text}</small></span><ArrowUpRight size={13}/></Link>}
function Step({n,title,text}:{n:string;title:string;text:string}){return <div className="ops-step"><b>{n}</b><div><strong>{title}</strong><span>{text}</span></div></div>}