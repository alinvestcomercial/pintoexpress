"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ArrowRight,ClipboardList,ChevronDown,LayoutDashboard,LogOut,Menu as MenuIcon,MessageCircle,Settings,ShieldCheck,Truck,Users,Wallet} from "lucide-react";
const links=[{href:"/admin",label:"Painel",icon:LayoutDashboard},{href:"/admin/encomendas",label:"Encomendas",icon:ClipboardList},{href:"/admin/pagamentos",label:"Pagamentos",icon:Wallet},{href:"/admin/logistica",label:"Logística",icon:Truck},{href:"/admin/utilizadores",label:"Utilizadores",icon:Users},{href:"/admin/configuracoes",label:"Configurações",icon:Settings},{href:"/admin/whatsapp",label:"Mensagens",icon:MessageCircle},{href:"/",label:"Site público",icon:ArrowRight}];
const labels:Record<string,string>={super_admin:"Super Admin",admin:"Administrador",manager:"Gestor",sales:"Vendas",finance:"Financeiro",logistics:"Logística",support:"Atendimento",viewer:"Consulta"};
export default function AdminHeader({name,role}:{name:string;role:string}){
 const pathname=usePathname();
 return <header className="admin-topbar"><Link href="/" className="admin-brand"><ShieldCheck/><span>PintoExpress</span><small>BALCÃO INTERNO</small></Link>
 <div className="admin-user"><div><strong>{name}</strong><small>{labels[role]||role||"Equipa"}</small></div><details className="admin-menu-dropdown"><summary><MenuIcon size={16}/><span>Menu</span><ChevronDown size={13}/></summary><nav aria-label="Navegação do backoffice">{links.map(item=>{const Icon=item.icon,active=item.href==="/admin"?pathname==="/admin":item.href!=="/"&&pathname.startsWith(item.href);return <Link key={item.href} href={item.href} className={active?"admin-menu-active":""}><Icon size={16}/><span>{item.label}</span></Link>})}</nav></details><form action="/api/admin/logout" method="post"><button className="admin-logout" type="submit"><LogOut size={16}/><span>Sair</span></button></form></div></header>;
}