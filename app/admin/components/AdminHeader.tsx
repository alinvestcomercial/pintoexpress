import Link from "next/link";
import {ArrowRight,LayoutDashboard,LogOut,ShieldCheck} from "lucide-react";
export default function AdminHeader({active,name,role}:{active:"dashboard"|"messages";name:string;role:string}){
 const labels:Record<string,string>={super_admin:"Super Admin",admin:"Administrador",manager:"Gestor",sales:"Vendas",finance:"Financeiro",logistics:"Logística",support:"Atendimento",viewer:"Consulta"};
 return <header className="admin-topbar">
  <Link href="/" className="admin-brand"><ShieldCheck/><span>PintoExpress</span><small>BALCÃO INTERNO</small></Link>
  <nav className="admin-topnav" aria-label="Navegação interna"><Link href="/admin" className={active==="dashboard"?"admin-topnav-active":""}><LayoutDashboard size={15}/> Painel</Link><Link href="/admin/whatsapp" className={active==="messages"?"admin-topnav-active":""}><MessageCircle size={15}/> Mensagens</Link><Link href="/"><ArrowRight size={14}/> Site público</Link></nav>
  <div className="admin-user"><div><strong>{name}</strong><small>{labels[role]||role||"Equipa"}</small></div><form action="/api/admin/logout" method="post"><button className="admin-logout" type="submit"><LogOut size={16}/><span>Sair</span></button></form></div>
 </header>;
}