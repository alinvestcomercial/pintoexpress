import Link from "next/link";
import {ArrowUpRight,Boxes,CalendarClock,ClipboardList,Package,Truck,Wallet,AlertTriangle,Clock3} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

type Metrics={orders_total:number;orders_pending:number;payments_pending:number;logistics_active:number;customers_total:number;stock_available:number;stock_reserved:number;reservations_pending:number;receivable_total:number;installments_due_soon:number;installments_overdue:number;payment_plans_active:number;sales_total:number};
type Order={id:string;reference:string;status:string;total_amount:number;created_at:string;customer?:{full_name:string|null;phone:string|null}|null};

export default async function Admin(){
 const token=(await cookies()).get("pe_access_token")?.value;if(!token)redirect("/admin/login");
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,h={apikey:key,Authorization:"Bearer "+token};
 const u=await fetch(url+"/auth/v1/user",{headers:h,cache:"no-store"});if(!u.ok)redirect("/admin/login");
 const user=await u.json();
 const p=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{...h,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
 const rows=await p.json();if(!p.ok||!Array.isArray(rows)||!rows[0]?.active)redirect("/admin/login");const profile=rows[0];
 const [mr,or]=await Promise.all([
  fetch(url+"/rest/v1/rpc/get_admin_dashboard_metrics",{method:"POST",headers:{...h,"Content-Type":"application/json"},body:"{}",cache:"no-store"}),
  fetch(url+"/rest/v1/orders?select=id,reference,status,total_amount,created_at,customer:customers(full_name,phone)&order=created_at.desc&limit=8",{headers:{...h,"Content-Type":"application/json"},cache:"no-store"})
 ]);
 const raw=mr.ok?await mr.json():null;const metrics:Metrics=Array.isArray(raw)?raw[0]||{}:raw||{};
 const orders:Order[]=or.ok?await or.json():[];
 const money=(n:number)=>new Intl.NumberFormat("pt-MZ",{style:"currency",currency:"MZN",maximumFractionDigits:0}).format(Number(n||0));
 const statusLabel:Record<string,string>={draft:"Rascunho",pending_payment:"A aguardar pagamento",payment_submitted:"Pagamento submetido",paid:"Pago",confirmed:"Confirmada",preparing:"Em preparação",ready:"Pronta",out_for_delivery:"Em entrega",ready_for_pickup:"Pronta para levantamento",completed:"Concluída",cancelled:"Cancelada"};
 return <main className="admin-shell"><AdminHeader name={profile.full_name||user.email||"Equipa"} role={profile.role||""}/><section className="admin-content admin-dashboard-home">
  <header className="ops-hero"><div><span className="eyebrow">BALCÃO DE OPERAÇÃO</span><h1>Visão geral</h1><p>Acompanhe o fluxo do negócio e intervenha onde a operação precisa de atenção.</p></div><div className="ops-hero-date"><CalendarClock size={15}/><span>Operação de hoje</span></div></header>
  <section className="ops-kpis" aria-label="Indicadores principais">
   <Metric icon={<ClipboardList/>} label="Encomendas em curso" value={String(metrics.orders_pending||0)} note={String(metrics.orders_total||0)+" encomendas no total"}/>
   <Metric icon={<Boxes/>} label="Stock disponível" value={String(metrics.stock_available||0)} note={String(metrics.stock_reserved||0)+" unidades reservadas"}/>
   <Metric icon={<Wallet/>} label="Por receber" value={money(Number(metrics.receivable_total||0))} note={String(metrics.installments_overdue||0)+" prestações em atraso"}/>
   <Metric icon={<Truck/>} label="Operações activas" value={String(metrics.logistics_active||0)} note={String(metrics.installments_due_soon||0)+" prestações vencem em 7 dias"}/>
  </section>
  <section className="ops-grid">
   <article className="ops-panel ops-orders"><PanelHead eyebrow="FLUXO COMERCIAL" title="Encomendas a acompanhar" href="/admin/encomendas" link="Abrir encomendas"/>{orders.length?<div className="ops-order-list">{orders.map(o=><Link href="/admin/encomendas" className="ops-order-row" key={o.id}><span className="ops-order-ref">{o.reference}</span><span className="ops-order-customer">{o.customer?.full_name||o.customer?.phone||"Cliente"}</span><span className="ops-order-status">{statusLabel[o.status]||o.status}</span><strong>{money(o.total_amount)}</strong><ArrowUpRight size={13}/></Link>)}</div>:<div className="ops-empty"><ClipboardList/><div><strong>Ainda não existem encomendas</strong><span>Quando entrarem pedidos, o acompanhamento aparecerá aqui.</span></div></div>}</article>
   <article className="ops-panel ops-alerts"><PanelHead eyebrow="ATENÇÃO" title="Pontos que exigem acção"/><div className="ops-alert-list"><AlertRow icon={<Clock3/>} title={String(metrics.payments_pending||0)+" pagamentos pendentes"} text="Submissões aguardam validação" href="/admin/pagamentos"/><AlertRow icon={<AlertTriangle/>} title={String(metrics.reservations_pending||0)+" reservas pendentes"} text="Compromissos de stock por confirmar" href="/admin/reservas"/><AlertRow icon={<Truck/>} title={String(metrics.logistics_active||0)+" operações logísticas"} text="Entregas e levantamentos em acompanhamento" href="/admin/logistica"/></div></article>
  </section>
  <section className="ops-grid ops-grid-bottom">
   <article className="ops-panel"><PanelHead eyebrow="STOCK" title="Disponibilidade e compromissos" href="/admin/stock" link="Gerir stock"/><div className="ops-stock-bars"><div><span>Disponível</span><strong>{Number(metrics.stock_available||0).toLocaleString("pt-MZ")}</strong></div><div><span>Reservado</span><strong>{Number(metrics.stock_reserved||0).toLocaleString("pt-MZ")}</strong></div><div><span>Reservas pendentes</span><strong>{metrics.reservations_pending||0}</strong></div></div></article>
   <article className="ops-panel"><PanelHead eyebrow="FINANCEIRO" title="Recebimentos" href="/admin/pagamentos" link="Abrir financeiro"/><div className="ops-finance-row"><div><span>Vendas</span><strong>{money(Number(metrics.sales_total||0))}</strong></div><div><span>Por receber</span><strong>{money(Number(metrics.receivable_total||0))}</strong></div><div><span>Em atraso</span><strong>{metrics.installments_overdue||0}</strong></div></div></article>
  </section>
  <section className="ops-process"><div className="ops-process-head"><div><span className="eyebrow">CICLO OPERACIONAL</span><h2>Da encomenda à conclusão</h2></div></div><div className="ops-process-steps"><Step n="01" title="Encomenda" text="Entrada do pedido"/><Step n="02" title="Reserva" text="Stock comprometido"/><Step n="03" title="Pagamento" text="Plano e recebimentos"/><Step n="04" title="Preparação" text="Pedido pronto"/><Step n="05" title="Logística" text="Entrega ou levantamento"/><Step n="06" title="Conclusão" text="Operação encerrada"/></div></section>
 </section></main>;
}
function Metric({icon,label,value,note}:{icon:React.ReactNode;label:string;value:string;note:string}){return <article className="ops-metric">{icon}<div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>}
function PanelHead({eyebrow,title,href,link}:{eyebrow:string;title:string;href?:string;link?:string}){return <div className="ops-panel-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{href&&<Link href={href}>{link}<ArrowUpRight size={13}/></Link>}</div>}
function AlertRow({icon,title,text,href}:{icon:React.ReactNode;title:string;text:string;href:string}){return <Link href={href} className="ops-alert-row">{icon}<span><strong>{title}</strong><small>{text}</small></span><ArrowUpRight size={13}/></Link>}
function Step({n,title,text}:{n:string;title:string;text:string}){return <div className="ops-step"><b>{n}</b><div><strong>{title}</strong><span>{text}</span></div></div>}