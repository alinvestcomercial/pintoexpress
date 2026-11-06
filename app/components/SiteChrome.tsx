"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, ShoppingBasket, X } from "lucide-react";
import {useCart} from "./CartProvider";
function Header(){const [open,setOpen]=useState(false);const {items}=useCart();const count=items.reduce((n,x)=>n+x.quantity,0);return <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></Link><nav className={open?"main-nav open":"main-nav"} aria-label="Navegação principal"><Link href="/">Início</Link><Link href="/catalogo">Catálogo</Link><Link href="/solucoes">Soluções</Link><Link href="/como-comprar">Como comprar</Link><Link href="/sobre">Sobre nós</Link><Link href="/contactos">Contactos</Link></nav><div className="nav-actions"><Link className="nav-cta" href="/pedido"><ShoppingBasket size={15}/> Meu pedido ({count}) <ArrowRight size={15}/></Link><button className="mobile-menu" aria-label={open?"Fechar menu":"Abrir menu"} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></div></header>}
function Footer(){return <footer className="site-footer">
  <div className="container footer-main">
    <div className="footer-brand-column">
      <Link className="footer-brand" href="/" aria-label="PintoExpress — página inicial">
        <span className="footer-brand-mark">P</span>
        <span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span>
      </Link>
      <p>O seu balcão digital para produtos, fornecimento e soluções para a actividade avícola em Moçambique.</p>
      <span className="footer-presence"><span/> Atendimento orientado às necessidades da sua criação</span>
    </div>
    <div className="footer-column">
      <strong>Explorar</strong>
      <Link href="/catalogo">Catálogo de produtos</Link>
      <Link href="/kits">Kits de criação</Link>
      <Link href="/solucoes">Soluções</Link>
      <Link href="/entrega-levantamento">Entrega e levantamento</Link>
    </div>
    <div className="footer-column">
      <strong>Institucional</strong>
      <Link href="/sobre">Sobre a PintoExpress</Link>
      <Link href="/como-comprar">Como comprar</Link>
      <Link href="/contactos">Contactos</Link>
      <Link href="/pedido">O meu pedido</Link>
    </div>
    <div className="footer-contact-column">
      <strong>Conte connosco</strong>
      <p>Precisa de orientação para encontrar os produtos ou a solução adequada?</p>
      <Link className="footer-contact-link" href="/contactos">Fale com a nossa equipa <ArrowRight size={15}/></Link>
    </div>
  </div>
  <div className="footer-bottom">
    <div className="container footer-bottom-inner">
      <span>© {new Date().getFullYear()} PintoExpress. Todos os direitos reservados.</span>
      <span>Moçambique <i/> Balcão avícola digital</span>
    </div>
  </div>
</footer>}
export function SiteFrame({children}:{children:React.ReactNode}){return <div className="site"><Header/><main>{children}</main><Footer/></div>}
