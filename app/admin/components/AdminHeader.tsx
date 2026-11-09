"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ArrowRight,ClipboardList,LayoutDashboard,LogOut,MessageCircle,Package,Settings,ShieldCheck,Truck,Users,Wallet} from "lucide-react";
const links=[{href:"/admin",label:"Painel",icon:LayoutDashboard},{href:"/admin/encomendas",label:"Encomendas",icon:ClipboardList},{href:"/admin/pagamentos",label:"Pagamentos",icon:Wallet},{href:"/admin/logistica",label:"Logística",icon:Truck},{href:"/admin/utilizadores",label:"Utilizadores",icon:Users},{href:"/admin/configuracoes",label:"Configurações",icon:Settings},{href:"/admin/whatsapp",label:"Mensagens",icon:MessageCircle}];
const labels:Record<string,string>={super_admin:"Super Admin",admin:"Administrador",manager:"Gestor",sales:"Vendas",finance:"Financeiro",logistics:"Logística",support:"Atendimento",viewer:"Consulta"};
export default function AdminHeader({name,role}:{name:string;role:string}){
 const pathname=usePathname();
 return <header className="admin-topbar"><Link href="/" className="admin-brand"><ShieldCheck/><span>PintoExpress</span><small>BALCÃO INTERNO</small></Link>
 <nav className="admin-topnav" aria-label="Navegação do backoffice">{links.map(item=>{const Icon=item.icon,active=pathname===item.href||(item.href!=="/admin"&&pathname.startsWith(item.href+"/"));return <Link key={item.href} href={item.href} className={active?"admin-topnav-active":""}><Icon size={15}/>{item.label}</Link>})}<Link href="/" className="admin-public-link"><ArrowRight size={14}/> Site público</Link></nav>
 <div className="admin-user"><div><strong>{name}</strong><small>{labels[role]||role||"Equipa"}</small></div><form action="/api/admin/logout" method="post"><button className="admin-logout" type="submit"><LogOut size={16}/><span>Sair</span></button></form></div></header>;
}