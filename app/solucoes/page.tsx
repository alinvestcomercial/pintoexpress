import Link from "next/link";
import {
  ArrowRight, Bird, Check, ClipboardList, Egg, HeartPulse,
  Package, Wheat, Sprout, Truck
} from "lucide-react";
import { SiteFrame } from "../components/SiteChrome";

const pathways = [
  {
    number: "01",
    icon: Bird,
    label: "Produção de carne",
    title: "Frangos de corte",
    description: "Para quem pretende iniciar ou organizar uma criação orientada à produção de carne.",
    needs: ["Pintos de corte (Broiler)", "Ração para as diferentes fases", "Equipamento para o maneio inicial"],
    link: "/catalogo?q=broiler",
    action: "Explorar pintos de corte",
  },
  {
    number: "02",
    icon: Egg,
    label: "Produção de ovos",
    title: "Criação de poedeiras",
    description: "Consulte os artigos associados a projectos de produção de ovos e preparação da criação.",
    needs: ["Pintos de poedeira", "Nutrição para postura", "Comedouros e bebedouros"],
    link: "/catalogo?q=poedeira",
    action: "Explorar poedeiras",
  },
  {
    number: "03",
    icon: Sprout,
    label: "Sistemas diversificados",
    title: "Aves rústicas",
    description: "Uma opção para quem procura aves adaptadas a sistemas de criação diversificados.",
    needs: ["Pintos SASSO", "Alimentação adequada ao projecto", "Apoio na selecção dos artigos"],
    link: "/catalogo?q=SASSO",
    action: "Explorar aves rústicas",
  },
  {
    number: "04",
    icon: ClipboardList,
    label: "Planeamento do projecto",
    title: "Dimensionar a sua criação",
    description: "Ainda está a definir a escala? Comece por indicar o número aproximado de aves e o seu objectivo.",
    needs: ["Quantidade estimada de aves", "Objectivo da produção", "Localidade e calendário pretendido"],
    link: "/contactos",
    action: "Conversar sobre o projecto",
  },
];

const steps = [
  { number: "1", title: "Escolha o objectivo", text: "Identifique o tipo de criação que pretende desenvolver." },
  { number: "2", title: "Reúna os artigos", text: "Consulte o catálogo e adicione ao pedido os produtos relevantes." },
  { number: "3", title: "Confirme com a equipa", text: "Receba confirmação de disponibilidade, preços e condições." },
];

export default function Solucoes() {
  return (
    <SiteFrame>
      <section className="solutions-hero">
        <div className="container solutions-hero-inner">
          <div className="solutions-hero-copy">
            <div className="solutions-breadcrumb"><Link href="/">Início</Link><span>/</span><span>Soluções</span></div>
            <span className="eyebrow light">PLANEAMENTO AVÍCOLA · PINTOEXPRESS</span>
            <h1>Uma solução certa começa com um bom plano.</h1>
            <p>Escolha o tipo de criação que pretende desenvolver. Ajudamos a identificar os produtos e as necessidades a considerar antes de avançar com o pedido.</p>
            <div className="solutions-hero-actions">
              <a className="solutions-primary" href="#escolher-solucao">Escolher uma solução <ArrowRight size={16}/></a>
              <Link className="solutions-secondary" href="/catalogo">Ver catálogo completo</Link>
            </div>
          </div>
          <div className="solutions-hero-aside" aria-label="Etapas de consulta">
            <span className="solutions-aside-icon"><ClipboardList size={23}/></span>
            <strong>Da ideia ao pedido</strong>
            <p>Um percurso simples para organizar a sua consulta comercial.</p>
            <div><span><Check size={14}/> Objectivo definido</span><span><Check size={14}/> Produtos reunidos</span><span><Check size={14}/> Condições confirmadas</span></div>
          </div>
        </div>
      </section>

      <section className="container solutions-main" id="escolher-solucao">
        <div className="solutions-section-heading">
          <div><span className="eyebrow">Encontre o seu caminho</span><h2>Que tipo de criação pretende desenvolver?</h2><p>Comece pela opção mais próxima do seu projecto. Pode ajustar o pedido com a nossa equipa.</p></div>
          <Link href="/catalogo">Ver todos os produtos <ArrowRight size={15}/></Link>
        </div>

        <div className="solutions-pathways">
          {pathways.map(({number, icon: Icon, label, title, description, needs, link, action}) => (
            <article className="solutions-pathway-card" key={number}>
              <div className="solutions-pathway-top"><span className="solutions-pathway-icon"><Icon size={23}/></span><span className="solutions-pathway-number">{number}</span></div>
              <span className="solutions-pathway-label">{label}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="solutions-needs"><strong>O que poderá precisar</strong>{needs.map(item => <span key={item}><Check size={14}/>{item}</span>)}</div>
              <Link href={link} className="solutions-pathway-link">{action}<ArrowRight size={16}/></Link>
            </article>
          ))}
        </div>

        <section className="solutions-how">
          <div className="solutions-how-heading"><span className="eyebrow">Como funciona</span><h2>Simples, do primeiro passo à confirmação.</h2><p>Não precisa de conhecer todos os detalhes técnicos para começar.</p></div>
          <div className="solutions-steps">
            {steps.map(step => <article key={step.number}><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></article>)}
          </div>
        </section>

        <section className="solutions-contact-cta">
          <div className="solutions-cta-icon"><HeartPulse size={22}/></div>
          <div><span className="eyebrow light">PRECISA DE ACOMPANHAMENTO?</span><h2>Vamos conversar sobre a sua criação.</h2><p>Partilhe o seu objectivo, a quantidade aproximada de aves e a sua localidade. A equipa ajuda a estruturar o pedido e confirma as opções disponíveis.</p></div>
          <Link href="/contactos">Falar com a equipa <ArrowRight size={16}/></Link>
        </section>
      </section>
    </SiteFrame>
  );
}