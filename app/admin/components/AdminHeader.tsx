"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {ArrowRight,BarChart3,Boxes,CalendarDays,ClipboardList,LayoutDashboard,LogOut,Menu,MessageCircle,PackageSearch,Settings,ShieldCheck,Truck,UserRound,Users,Wallet,X} from "lucide-react";
import {useState} from "react";

const links=[
 {href:"/admin",label:"Painel",icon:LayoutDashboard},
 {href:"/admin/encomendas",label:"Encomendas",icon:ClipboardList},
 {href:"/admin/produtos",label:"Produtos e pacotes",icon:PackageSearch},
 {href:"/admin/stock",label:"Stock",icon:Boxes},
 {href:"/admin/reservas",label:"Reservas",icon:CalendarDays},
 {href:"/admin/pagamentos",label:"Pagamentos e financeiro",icon:Wallet},
 {href:"/admin/logistica",label:"Logística",icon:Truck},
 {href:"/admin/clientes",label:"Clientes",icon:UserRound},
 {href:"/admin/relatorios",label:"Relatórios",icon:BarChart3},
 {href:"/admin/utilizadores",label:"Utilizadores",icon:Users},
 {href:"/admin/configuracoes",label:"Configurações",icon:Settings},
 {href:"/admin/whatsapp",label:"Mensagens",icon:MessageCircle}
];
const labels:Record<string,string>={super_admin:"Super Admin",admin:"Administrador",manager:"Gestor",sales:"Vendas",finance:"Financeiro",logistics:"Logística",support:"Atendimento",viewer:"Consulta"};

export default function AdminHeader({name,role}:{name:string;role:string}){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const isActive=(href:string)=>href==="/admin"?pathname==="/admin":pathname.startsWith(href);
 return <>
  <aside className={"admin-sidebar"+(open?" admin-sidebar-open":"")}>
   <div className="admin-sidebar-brand">
    <Link href="/admin" onClick={()=>setOpen(false)}><ShieldCheck/><span><strong>PintoExpress</strong><small>BALCÃO INTERNO</small></span></Link>
    <button className="admin-sidebar-close" onClick={()=>setOpen(false)} aria-label="Fechar menu"><X size={18}/></button>
   </div>
   <div className="admin-sidebar-label">OPERAÇÃO</div>
   <nav className="admin-sidebar-nav" aria-label="Navegação principal do backoffice">
    {links.map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className={isActive(item.href)?"admin-sidebar-active":""} onClick={()=>setOpen(false)}><Icon size={17}/><span>{item.label}</span></Link>})}
   </nav>
   <div className="admin-sidebar-bottom">
    <Link href="/" className="admin-sidebar-public"><ArrowRight size={15}/><span>Site público</span></Link>
    <div className="admin-sidebar-note">O acesso aos módulos é definido pelo perfil de cada utilizador.</div>
   </div>
  </aside>
  {open&&<button className="admin-sidebar-overlay" onClick={()=>setOpen(false)} aria-label="Fechar menu"/>}
  <header className="admin-topbar">
   <div className="admin-mobile-menu"><button onClick={()=>setOpen(true)} aria-label="Abrir menu"><Menu size={19}/></button><span>Menu</span></div>
   <div className="admin-breadcrumb"><span>Backoffice</span><b>/</b><strong>{links.find(x=>isActive(x.href))?.label||"Painel"}</strong></div>
   <div className="admin-user">
    <div><strong>{name}</strong><small>{labels[role]||role||"Equipa"}</small></div>
    <form action="/api/admin/logout" method="post"><button className="admin-logout" type="submit"><LogOut size={15}/><span>Sair</span></button></form>
   </div>
  </header>
 </>;
}
