import Link from "next/link";
import {ArrowUpRight,ClipboardList,Package,Truck,Wallet,Boxes,CalendarDays,BarChart3,UserRound,PackageSearch} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function Admin(){
 const token=(await cookies()).get("pe_access_token")?.value;
 if(!token) redirect("/admin/login");
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
 const u=await fetch(url+"/auth/v1/user",{headers:{apikey:key,Authorization:"Bearer "+token},cache:"no-store"});
 if(!u.ok) redirect("/admin/login");
 const user=await u.json();
 const p=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
 const rows=await p.json(); if(!p.ok||!Array.isArray(rows)||!rows[0]?.active) redirect("/admin/login");
 const profile=rows[0];
 return <main className="admin-shell"><AdminHeader name={profile.full_name||user.email||"Equipa"} role={profile.role||""}/><section className="admin-content">
  <div className="admin-heading"><div><span className="eyebrow">CENTRO DE OPERAÇÃO</span><h1>Bom dia, {profile.full_name||user.email||"equipa"}.</h1><p>O ponto central para acompanhar encomendas, stock, pagamentos e a operação do dia.</p></div><div className="admin-heading-actions"><Link className="admin-primary-action" href="/"><Package size={16}/> Ver site</Link></div></div>
  <section className="admin-command-grid" aria-label="Atalhos operacionais">
   <Link href="/admin/encomendas" className="admin-command-card admin-command-feature"><div><span className="eyebrow">COMERCIAL</span><strong>Encomendas</strong><p>Acompanhe pedidos desde a entrada até à conclusão.</p></div><ClipboardList/></Link>
   <Link href="/admin/stock" className="admin-command-card"><Boxes/><div><span>Stock</span><small>Disponibilidade e reservas</small></div><ArrowUpRight/></Link>
   <Link href="/admin/pagamentos" className="admin-command-card"><Wallet/><div><span>Financeiro</span><small>Recebimentos e prestações</small></div><ArrowUpRight/></Link>
   <Link href="/admin/logistica" className="admin-command-card"><Truck/><div><span>Logística</span><small>Entregas e levantamentos</small></div><ArrowUpRight/></Link>
  </section>
  <section className="admin-dashboard-section"><div className="admin-section-title"><div><span className="eyebrow">VISÃO DA OPERAÇÃO</span><h2>O que está a acontecer?</h2><p>Indicadores reais e pontos que exigem atenção.</p></div><Link href="/admin/relatorios">Ver relatórios <ArrowUpRight size={14}/></Link></div>
   <div className="admin-summary admin-summary-dashboard"><article><span>Encomendas</span><strong>—</strong><small>Pedidos em acompanhamento</small></article><article><span>Stock reservado</span><strong>—</strong><small>Compromisso com encomendas</small></article><article><span>Por receber</span><strong>—</strong><small>Inclui pagamentos em prestações</small></article><article><span>Operações logísticas</span><strong>—</strong><small>Entregas e levantamentos</small></article></div>
  </section>
  <section className="admin-dashboard-section"><div className="admin-section-title"><div><span className="eyebrow">ACESSO RÁPIDO</span><h2>Outras áreas</h2><p>Abra directamente os módulos de suporte à operação.</p></div></div>
   <div className="admin-quick-grid"><Quick href="/admin/produtos" icon={<PackageSearch/>} title="Produtos e pacotes" text="Catálogo e preços"/><Quick href="/admin/reservas" icon={<CalendarDays/>} title="Reservas" text="Compromissos de stock"/><Quick href="/admin/clientes" icon={<UserRound/>} title="Clientes" text="Histórico comercial"/><Quick href="/admin/relatorios" icon={<BarChart3/>} title="Relatórios" text="Indicadores da operação"/></div>
  </section>
  <footer className="admin-footer"><div><strong>PintoExpress</strong><span>Balcão interno · Operação da plataforma</span></div><nav aria-label="Links internos"><Link href="/admin">Painel</Link><Link href="/admin/whatsapp">Mensagens</Link><Link href="/">Site público</Link></nav></footer>
 </section></main>;
}
function Quick({href,icon,title,text}:{href:string;icon:React.ReactNode;title:string;text:string}){return <Link href={href} className="admin-quick-card">{icon}<span><strong>{title}</strong><small>{text}</small></span><ArrowUpRight size={14}/></Link>}