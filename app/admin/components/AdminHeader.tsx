import Link from "next/link";
import {cookies} from "next/headers";
import {ArrowRight,LayoutDashboard,LogOut,MessageCircle,ShieldCheck} from "lucide-react";

export default async function AdminHeader({active}:{active:"dashboard"|"messages"}) {
  const token=(await cookies()).get("pe_access_token")?.value;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  let name="Equipa";
  let role="";
  let email="";
  if(token){
    const u=await fetch(url+"/auth/v1/user",{headers:{apikey:key,Authorization:"Bearer "+token},cache:"no-store"});
    if(u.ok){
      const user=await u.json();
      email=user.email||"";
      const p=await fetch(url+"/rest/v1/rpc/get_my_staff_profile",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
      if(p.ok){
        const rows=await p.json();
        if(Array.isArray(rows)&&rows[0]){
          name=rows[0].full_name||email||name;
          role=rows[0].role||"";
        }
      }
    }
  }
  return <header className="admin-topbar">
    <Link href="/" className="admin-brand"><ShieldCheck/><span>PintoExpress</span><small>BALCÃO INTERNO</small></Link>
    <nav className="admin-topnav" aria-label="Navegação interna">
      <Link href="/admin" className={active==="dashboard"?"admin-topnav-active":""}><LayoutDashboard size={15}/> Painel</Link>
      <Link href="/admin/whatsapp" className={active==="messages"?"admin-topnav-active":""}><MessageCircle size={15}/> Mensagens</Link>
      <Link href="/"><ArrowRight size={14}/> Site público</Link>
      <a href="https://wa.me/258842553641"><MessageCircle size={14}/> WhatsApp</a>
    </nav>
    <div className="admin-user">
      <div><strong>{name}</strong><small>{role||email}</small></div>
      <form action="/api/admin/logout" method="post"><button type="submit" aria-label="Terminar sessão"><LogOut size={16}/><span>Sair</span></button></form>
    </div>
  </header>;
}