import Link from "next/link";
import {ArrowUpRight,ClipboardList,Package,Settings,Truck,Users,Wallet} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import RoleManager from "./components/RoleManager";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const roles=[
  ["super_admin","Super Admin","Acesso total e gestão de utilizadores"],["admin","Administrador","Operações gerais e configurações"],["manager","Gestor","Gestão comercial e indicadores"],["sales","Vendas","Pedidos, clientes e atendimento"],["finance","Financeiro","Pagamentos e comprovativos"],["logistics","Logística","Entregas, levantamentos e reservas"],["support","Atendimento","Clientes e acompanhamento"],["viewer","Consulta","Acesso apenas de leitura"]
];

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
  <div className="admin-heading"><div><span className="eyebrow">CENTRO DE OPERAÇÃO</span><h1>Bom dia, {profile.full_name||user.email||"equipa"}.</h1><p>Organize o trabalho do PintoExpress a partir de um único balcão.</p></div><div className="admin-heading-actions"><Link className="admin-primary-action" href="/"><Package size={16}/> Ver site</Link></div></div>
  <section className="admin-summary" aria-label="Estado da operação"><article><span>Encomendas</span><strong>—</strong><small>Aguardam ligação aos dados reais</small></article><article><span>Pagamentos</span><strong>—</strong><small>Sem indicadores fictícios</small></article><article><span>Logística</span><strong>—</strong><small>Sem indicadores fictícios</small></article><article><span>Atividade</span><strong>—</strong><small>Histórico operacional</small></article></section>
  <section className="admin-workspace"><div className="admin-workspace-head"><div><span className="eyebrow">OPERAÇÃO DIÁRIA</span><h2>O que vamos tratar hoje?</h2><p>Aceda directamente às áreas de trabalho do PintoExpress.</p></div></div><div className="admin-workspace-grid">
   <Link href="/admin/encomendas"><AdminModule icon={<ClipboardList/>} title="Encomendas" description="Consulte pedidos, acompanhe referências e actualize estados." number="01"/></Link><Link href="/admin/pagamentos"><AdminModule icon={<Wallet/>} title="Pagamentos" description="Acompanhe pagamentos, transferências e comprovativos." number="02"/></Link><Link href="/admin/logistica"><AdminModule icon={<Truck/>} title="Logística" description="Organize entregas, levantamentos e reservas." number="03"/></Link><Link href="/admin/utilizadores"><AdminModule icon={<Users/>} title="Utilizadores" description="Faça a gestão da equipa, dos perfis e das permissões." number="04"/></Link><Link href="/admin/configuracoes"><AdminModule icon={<Settings/>} title="Configurações" description="Ajuste os dados comerciais e parâmetros da plataforma." number="05"/></Link>
  </div></section>
  <section className="admin-roles"><div className="admin-workspace-head"><div><span className="eyebrow">ACESSOS</span><h2>Perfis da equipa</h2><p>Seleccione um perfil para consultar, adicionar ou gerir os utilizadores associados.</p></div></div><RoleManager roles={roles.map(([id,name,description])=>({id,name,description}))}/></section>
  <footer className="admin-footer"><div><strong>PintoExpress</strong><span>Balcão interno · Operação da plataforma</span></div><nav aria-label="Links internos"><Link href="/admin">Painel</Link><Link href="/admin/whatsapp">Mensagens WhatsApp</Link><Link href="/">Site público</Link></nav></footer>
 </section></main>;
}
function AdminModule({icon,title,description,number}:{icon:React.ReactNode;title:string;description:string;number:string}){return <article className="admin-module-card"><div className="admin-module-top"><span className="admin-module-icon">{icon}</span><span className="admin-module-number">{number}</span></div><div className="admin-module-copy"><strong>{title}</strong><p>{description}</p></div><span className="admin-module-open">Abrir área <ArrowUpRight size={16}/></span></article>}