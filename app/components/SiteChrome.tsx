"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, ShoppingBasket, X } from "lucide-react";

export function SiteHeader(){
  const [open,setOpen]=useState(false);
  return <header className="site-header"><div className="container nav">
    <Link className="brand" href="/"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></Link>
    <nav className={open?"main-nav open":"main-nav"} aria-label="Navegação principal">
      <Link href="/">Início</Link><Link href="/catalogo">Catálogo</Link><Link href="/solucoes">Soluções</Link><Link href="/como-comprar">Como comprar</Link><Link href="/sobre">Sobre nós</Link><Link href="/contactos">Contactos</Link>
    </nav>
    <div className="nav-actions"><Link className="nav-cta" href="/pedido"><ShoppingBasket size={15}/> Meu pedido <ArrowRight size={15}/></Link><button className="mobile-menu" aria-label={open?"Fechar menu":"Abrir menu"} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
  </div></header>;
}
export function SiteFooter(){return <footer><div className="container footer-inner"><Link className="brand" href="/"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></Link><div><Link href="/catalogo">Catálogo</Link><Link href="/solucoes">Soluções</Link><Link href="/como-comprar">Como comprar</Link><Link href="/contactos">Contactos</Link></div><small>© 2026 PintoExpress · Moçambique</small></div></footer>}
export function SiteFrame({children}:{children:React.ReactNode}){return <div className="site"><SiteHeader/><main>{children}</main><SiteFooter/></div>}
