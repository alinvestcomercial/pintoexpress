"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {ArrowRight,LayoutDashboard,LogOut,MessageCircle,ShieldCheck} from "lucide-react";
export default function AdminHeader({active,name:initialName,role:initialRole}:{active:"dashboard"|"messages";name:string;role:string}){
 const [name,setName]=useState(initialName),[role,setRole]=useState(initialRole);
 useEffect(()=>{fetch("/api/admin/session",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(d=>{if(d?.profile){setName(d.profile.full_name||"Equipa");setRole(d.profile.role||"");}}).catch(()=>{})},[]);
 const label=role==="super_admin"?"Super Admin":role==="admin"?"Administrador":role==="manager"?"Gestor":role==="sales"?"Vendas":role==="finance"?"Financeiro":role==="logistics"?"Logística":role==="support"?"Atendimento":role==="viewer"?"Consulta":role||"Equipa";
 return <header className="admin-topbar">
  <Link href="/" className="admin-brand"><ShieldCheck/><span>PintoExpress</span><small>BALCÃO INTERNO</small></Link>
  <nav className="admin-topnav" aria-label="Navegação interna"><Link href="/admin" className={active==="dashboard"?"admin-topnav-active":""}><LayoutDashboard size={15}/> Painel</Link><Link href="/admin/whatsapp" className={active==="messages"?"admin-topnav-active":""}><MessageCircle size={15}/> Mensagens</Link><Link href="/"><ArrowRight size={14}/> Site público</Link><a href="https://wa.me/258842553641"><MessageCircle size={14}/> WhatsApp</a></nav>
  <div className="admin-user"><div><strong>{name}</strong><small>{label}</small></div><form action="/api/admin/logout" method="post"><button className="admin-logout" type="submit"><LogOut size={16}/><span>Sair</span></button></form></div>
 </header>;
}