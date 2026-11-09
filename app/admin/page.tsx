import Link from "next/link";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Activity,ArrowRight,ClipboardList,LayoutDashboard,LogOut,MessageCircle,Package,Settings,ShieldCheck,Truck,Users,Wallet} from "lucide-react";

const roles=[
  ["super_admin","Super Admin","Acesso total e gestão de utilizadores"],
  ["admin","Administrador","Operações gerais e configurações"],
  ["manager","Gestor","Gestão comercial e indicadores"],
  ["sales","Vendas","Pedidos, clientes e atendimento"],
  ["finance","Financeiro","Pagamentos e comprovativos"],
  ["logistics","Logística","Entregas, levantamentos e reservas"],
  ["support","Atendimento","Clientes e acompanhamento"],
  ["viewer","Consulta","Acesso apenas de leitura"]
];

export default async function Admin(){
  const token=(await cookies()).get("pe_access_token")?.value;
  if(!token) redirect("/admin/login");
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const u=await fetch(url+"/auth/v1/user",{headers:{apikey:key,Authorization:"Bearer "+token},cache:"no-store"});
  if(!u.ok) redirect("/admin/login");
  const user=await u.json();
  const p=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
  const rows=await p.json();
  if(!p.ok||!Array.isArray(rows)||!rows[0]?.active) redirect("/admin/login");
  const profile=rows[0];

  return <main className="admin-shell">
    <header className="admin-topbar">
      <Link href="/" className="admin-brand"><ShieldCheck/> <span>PintoExpress</span><small>BALCÃO INTERNO</small></Link>
      <nav className="admin-topnav" aria-label="Navegação interna">
        <Link href="/admin" className="admin-topnav-active"><LayoutDashboard size={15}/> Painel</Link><Link href="/admin/whatsapp"><MessageCircle size={15}/> Mensagens</Link>
        <Link href="/"><ArrowRight size={14}/> Site público</Link>
        <a href="https://wa.me/258842553641"><MessageCircle size={14}/> WhatsApp</a>
      </nav>
      <div className="admin-user">
        <div><strong>{profile.full_name||user.email}</strong><small>{profile.role}</small></div>
        <form action="/api/admin/logout" method="post"><button type="submit" aria-label="Sair"><LogOut size={16}/></button></form>
      </div>
    </header>

    <section className="admin-content">
      <div className="admin-heading">
        <div><span className="eyebrow">CENTRO DE OPERAÇÃO</span><h1>Bom dia, {profile.full_name||"equipa"}.</h1><p>Organize o trabalho do PintoExpress a partir de um único balcão.</p></div>
        <div className="admin-heading-actions"><Link className="admin-primary-action" href="/"><Package size={16}/> Ver site</Link><a className="admin-secondary-action" href="https://wa.me/258842553641"><MessageCircle size={16}/> WhatsApp</a></div>
      </div>

      <section className="admin-summary" aria-label="Estado da operação">
        <article><span>Encomendas</span><strong>—</strong><small>Aguardam ligação aos dados reais</small></article>
        <article><span>Pagamentos</span><strong>—</strong><small>Sem indicadores fictícios</small></article>
        <article><span>Logística</span><strong>—</strong><small>Sem indicadores fictícios</small></article>
        <article><span>Atividade</span><strong>—</strong><small>Histórico operacional</small></article>
      </section>

      <section className="admin-workspace">
        <div className="admin-workspace-head"><div><span className="eyebrow">OPERAÇÃO DIÁRIA</span><h2>Escolha onde trabalhar</h2></div><span className="admin-status"><Activity size={14}/> Estrutura preparada</span></div>
        <div className="admin-workspace-grid">
          <AdminModule icon={<ClipboardList/>} title="Encomendas" description="Consultar pedidos, referências e estados." status="Próxima fase"/>
          <AdminModule icon={<Wallet/>} title="Pagamentos" description="Validar M-Pesa, transferências e comprovativos." status="Próxima fase"/>
          <AdminModule icon={<Truck/>} title="Logística" description="Organizar entrega, levantamento e reservas." status="Próxima fase"/>
          <AdminModule icon={<Users/>} title="Utilizadores" description="Gerir equipa, perfis e permissões." status="Disponível"/>
          <AdminModule icon={<Settings/>} title="Configurações" description="Dados comerciais e parâmetros da plataforma." status="Próxima fase"/>
        </div>
      </section>

      <section className="admin-roles">
        <div className="admin-workspace-head"><div><span className="eyebrow">ACESSOS</span><h2>Perfis da equipa</h2></div><span className="admin-status">Controlo por função</span></div>
        <div>{roles.map(r=><article key={r[0]}><strong>{r[1]}</strong><span>{r[2]}</span></article>)}</div>
      </section>

      <footer className="admin-footer"><div><strong>PintoExpress</strong><span>Balcão interno · Operação da plataforma</span></div><nav aria-label="Links internos"><Link href="/admin">Painel</Link><Link href="/admin/whatsapp">Mensagens WhatsApp</Link><Link href="/">Site público</Link><a href="https://wa.me/258842553641">+258 84 255 3641</a></nav></footer>
    </section>
  </main>;
}

function AdminModule({icon,title,description,status}:{icon:React.ReactNode;title:string;description:string;status:string}){
  return <article className="admin-module-card"><div className="admin-module-icon">{icon}</div><div><strong>{title}</strong><p>{description}</p></div><span>{status}</span></article>;
}