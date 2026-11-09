import Link from "next/link";
import {LayoutDashboard,MessageCircle,ArrowRight} from "lucide-react";

export default function AdminNav({active}:{active:"dashboard"|"messages"}) {
 return <nav className="admin-topnav" aria-label="Navegação interna">
  <Link href="/admin" className={active==="dashboard"?"admin-topnav-active":""}><LayoutDashboard size={15}/> Painel</Link>
  <Link href="/admin/whatsapp" className={active==="messages"?"admin-topnav-active":""}><MessageCircle size={15}/> Mensagens</Link>
  <Link href="/"><ArrowRight size={14}/> Site público</Link>
  <a href="https://wa.me/258842553641"><MessageCircle size={14}/> WhatsApp</a>
 </nav>
}