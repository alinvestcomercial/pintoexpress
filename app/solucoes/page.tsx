import Link from "next/link";
import {
  ArrowRight, Check, ClipboardList, Package, Users, SlidersHorizontal,
  Bird, Egg, Sprout, MessageCircle
} from "lucide-react";
import { SiteFrame } from "../components/SiteChrome";

const buyingModels = [
  {
    number: "01",
    icon: Package,
    tag: "Para começar",
    title: "Kit de iniciação",
    description: "Um conjunto orientado para quem está a preparar o arranque da sua criação e precisa de reunir os artigos essenciais.",
    points: ["Produtos essenciais para o arranque", "Quantidades ajustadas à fase inicial", "Composição confirmada pela equipa"],
    action: "Solicitar kit de iniciação",
    href: "/pedido?modelo=kit-iniciacao",
    featured: false,
  },
  {
    number: "02",
    icon: Users,
    tag: "Por quantidade de aves",
    title: "Kit por dimensão",
    description: "Uma proposta organizada de acordo com a dimensão da criação que pretende desenvolver.",
    points: ["Dimensionamento pelo número de aves", "Combinação de produtos e consumíveis", "Proposta comercial sob consulta"],
    action: "Dimensionar o meu kit",
    href: "/pedido?modelo=kit-dimensao",
    featured: true,
  },
  {
    number: "03",
    icon: SlidersHorizontal,
    tag: "À medida do projecto",
    title: "Kit personalizado",
    description: "Uma solução construída a partir do seu objectivo, sistema de criação, instalações e necessidades específicas.",
    points: ["Selecção orientada ao seu sistema", "Possibilidade de incluir equipamentos", "Acompanhamento individual"],
    action: "Personalizar o meu kit",
    href: "/pedido?modelo=kit-personalizado",
    featured: false,
  },
];

const steps = [
  { number: "1", title: "Escolha o modelo", text: "Seleccione o tipo de pacote que melhor corresponde à sua necessidade." },
  { number: "2", title: "Indique os detalhes", text: "Partilhe o número de aves, fase de criação, localização e outros requisitos." },
  { number: "3", title: "Receba a proposta", text: "A equipa confirma a composição, disponibilidade, preço e condições antes da compra." },
];

const productionTypes = [
  { icon: Bird, title: "Frangos de corte", text: "Pacotes orientados à produção de carne.", href: "/catalogo?q=broiler" },
  { icon: Egg, title: "Poedeiras", text: "Pacotes para projectos de produção de ovos.", href: "/catalogo?q=poedeira" },
  { icon: Sprout, title: "Aves rústicas", text: "Opções para sistemas de criação diversificados.", href: "/catalogo?q=SASSO" },
];

export default function Solucoes() {
  return (
    <SiteFrame>
      <section className="solutions-hero">
        <div className="container solutions-hero-inner">
          <div className="solutions-hero-copy">
            <div className="solutions-breadcrumb"><Link href="/">Início</Link><span>/</span><span>Soluções</span></div>
            <span className="eyebrow light">MODELOS DE COMPRA · PINTOEXPRESS</span>
            <h1>Uma criação, um pacote pensado para si.</h1>
            <p>Escolha como prefere organizar a sua compra: comece com um kit de iniciação, dimensione o pacote pelo número de aves ou construa uma solução à medida do seu projecto.</p>
            <div className="solutions-hero-actions">
              <a className="solutions-primary" href="#modelos-compra">Conhecer os pacotes <ArrowRight size={16}/></a>
              <Link className="solutions-secondary" href="/catalogo">Comprar produtos individualmente</Link>
            </div>
          </div>
          <div className="solutions-hero-aside" aria-label="Vantagens dos pacotes">
            <span className="solutions-aside-icon"><Package size={23}/></span>
            <strong>Mais simples de organizar</strong>
            <p>Em vez de escolher cada artigo separadamente, reúna as necessidades num único pedido.</p>
            <div><span><Check size={14}/> Produtos agrupados</span><span><Check size={14}/> Quantidades ajustáveis</span><span><Check size={14}/> Proposta confirmada pela equipa</span></div>
          </div>
        </div>
      </section>

      <section className="container solutions-main" id="modelos-compra">
        <div className="solutions-section-heading">
          <div><span className="eyebrow">Escolha o seu modelo</span><h2>Três formas de comprar por pacote.</h2><p>Todos os pacotes são preparados ou confirmados de acordo com as características da sua criação.</p></div>
          <Link href="/kits">Ver detalhes dos kits <ArrowRight size={15}/></Link>
        </div>

        <div className="solutions-package-grid">
          {buyingModels.map(({number, icon: Icon, tag, title, description, points, action, href, featured}) => (
            <article className={featured ? "solutions-package-card featured" : "solutions-package-card"} key={number}>
              <div className="solutions-package-top"><span className="solutions-package-icon"><Icon size={23}/></span><span className="solutions-package-number">{number}</span></div>
              <span className="solutions-package-tag">{tag}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="solutions-package-points"><strong>O que inclui o modelo</strong>{points.map(item => <span key={item}><Check size={14}/>{item}</span>)}</div>
              <Link href={href} className="solutions-package-link">{action}<ArrowRight size={16}/></Link>
            </article>
          ))}
        </div>

        <div className="solutions-package-note"><span><ClipboardList size={20}/></span><div><strong>Uma nota importante sobre os pacotes</strong><p>Os modelos apresentados são pontos de partida para uma consulta. A composição final, os preços, o stock e a disponibilidade de cada artigo são confirmados pela equipa antes de qualquer compra.</p></div></div>

        <section className="solutions-how">
          <div className="solutions-how-heading"><span className="eyebrow">Como funciona</span><h2>Do modelo escolhido à proposta.</h2><p>Não precisa de conhecer todos os detalhes técnicos para preparar o seu pedido.</p></div>
          <div className="solutions-steps">
            {steps.map(step => <article key={step.number}><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></article>)}
          </div>
        </section>

        <section className="solutions-production">
          <div className="solutions-production-heading"><span className="eyebrow">Também pode indicar o objectivo</span><h2>Que tipo de criação está a preparar?</h2></div>
          <div className="solutions-production-grid">
            {productionTypes.map(({icon: Icon, title, text, href}) => <Link href={href} className="solutions-production-item" key={title}><Icon size={21}/><span><strong>{title}</strong><small>{text}</small></span><ArrowRight size={16}/></Link>)}
          </div>
        </section>

        <section className="solutions-contact-cta">
          <div className="solutions-cta-icon"><MessageCircle size={22}/></div>
          <div><span className="eyebrow light">PRECISA DE ACOMPANHAMENTO?</span><h2>Vamos preparar o pacote adequado à sua criação.</h2><p>Partilhe o seu objectivo, a quantidade aproximada de aves e a sua localidade. A equipa ajuda a estruturar o pedido e confirma as opções disponíveis.</p></div>
          <Link href="/contactos">Falar com a equipa <ArrowRight size={16}/></Link>
        </section>
      </section>
    </SiteFrame>
  );
}