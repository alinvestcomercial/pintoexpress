"use client";
import Link from "next/link";
import {ArrowRight,BarChart3,Boxes,ChevronDown,ClipboardList,LayoutDashboard,LogOut,MessageCircle,PackageSearch,Settings,Truck,Users,UserRound,Wallet,FileText} from "lucide-react";
import {usePathname} from "next/navigation";
import {useState} from "react";
const links=[
 {href:"/admin",label:"Painel",icon:LayoutDashboard},
 {href:"/admin/mensagens",label:"Atendimento WhatsApp",icon:MessageCircle},
 {href:"/admin/clientes",label:"Clientes",icon:UserRound},
 {href:"/admin/encomendas",label:"Encomendas",icon:ClipboardList},
 {href:"/admin/produtos",label:"Produtos",icon:PackageSearch},
 {href:"/admin/stock",label:"Stock",icon:Boxes},
 {href:"/admin/logistica",label:"Entregas",icon:Truck},
 {href:"/admin/pagamentos",label:"Pagamentos",icon:Wallet},
 {href:"/admin/configuracoes",label:"Configurações",icon:Settings},
 {href:"/admin/relatorios",label:"Relatórios",icon:BarChart3},
 {href:"/admin/utilizadores",label:"Utilizadores",icon:Users},
 {href:"/admin/whatsapp",label:"Modelos WhatsApp",icon:FileText}
];
const labels:Record<string,string>={super_admin:"Super Admin",admin:"Administrador",manager:"Gestor",sales:"Vendas",finance:"Financeiro",logistics:"Logística",support:"Atendimento",viewer:"Consulta"};
export default function AdminHeader({name,role}:{name:string;role:string}){const pathname=usePathname();const[more,setMore]=useState(false);const isActive=(href:string)=>href==="/admin"?pathname==="/admin":pathname.startsWith(href);const primary=links.slice(0,9),moreLinks=links.slice(9);const currentMore=moreLinks.find(x=>isActive(x.href));return <><header className="admin-header"><div className="admin-header-main"><Link href="/admin" className="admin-brand" aria-label="PintoExpress — Painel"><span className="admin-brand-mark">P</span><span><strong>PintoExpress</strong><small>BALCÃO INTERNO</small></span></Link><div className="admin-user"><div><strong>{name}</strong><small>{labels[role]||role||"Equipa"}</small></div><form action="/api/admin/logout" method="post"><button className="admin-logout" type="submit"><LogOut size={15}/><span>Sair</span></button></form></div></div></header><nav className="admin-module-nav" aria-label="Áreas do backoffice"><div className="admin-module-nav-inner">{primary.map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className={isActive(item.href)?"active":""}><Icon size={15}/><span>{item.label}</span></Link>})}<div className="admin-more-wrap"><button className={currentMore?"active":""} onClick={()=>setMore(v=>!v)} aria-expanded={more}><span>{currentMore?.label||"Mais áreas"}</span><ChevronDown size={14}/></button>{more&&<div className="admin-more-menu">{moreLinks.map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className={isActive(item.href)?"active":""} onClick={()=>setMore(false)}><Icon size={15}/><span>{item.label}</span></Link>})}</div>}</div><Link href="/" className="admin-module-public"><ArrowRight size={13}/><span>Site público</span></Link></div></nav></>}
