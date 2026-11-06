import Link from "next/link";
import { ArrowRight, Search, ShoppingBasket, MessageCircle, CheckCircle2, Truck, PackageCheck, ClipboardCheck, ShieldCheck } from "lucide-react";
import { SiteFrame } from "../components/SiteChrome";

const steps=[
 {icon:Search,title:"Escolha como quer comprar",text:"Pode escolher um pacote de criação por espécie e dimensão, ou seleccionar produtos individuais no catálogo."},
 {icon:ShoppingBasket,title:"Prepare o seu pedido",text:"Escolha o lote ou adicione os produtos à lista. Indique quantidade, experiência e localidade para ajustarmos a proposta."},
 {icon:MessageCircle,title:"Envie a sua consulta",text:"Submeta os seus contactos e os detalhes da criação. A consulta não obriga a comprar."},
 {icon:CheckCircle2,title:"Receba confirmação e decida",text:"A equipa confirma composição, preço, stock, calendário, entrega e pagamento. Só depois decide se pretende avançar."}
];
const assurances=[
 {icon:PackageCheck,title:"Pacotes por necessidade",text:"Lotes de referência para frangos de corte, poedeiras e aves rústicas."},
 {icon:Truck,title:"Entrega ou levantamento",text:"A modalidade e os custos são confirmados conforme a localidade."},
 {icon:ShieldCheck,title:"Compra com confirmação",text:"Nenhum pagamento é devido apenas por enviar uma consulta."}
];
export default function ComoComprar(){return <SiteFrame>
 <section className="howbuy-hero"><div className="container howbuy-hero-inner"><div><div className="solutions-breadcrumb"><Link href="/">Início</Link><span>/</span><span>Como comprar</span></div><span className="eyebrow light">DO INTERESSE À COMPRA</span><h1>Escolha. Peça a sua proposta. Decida com confiança.</h1><p>Na PintoExpress, pode comprar por pacotes de criação ou escolher produtos individuais. A nossa equipa confirma todos os detalhes antes de fechar a encomenda.</p><div className="solutions-hero-actions"><Link className="solutions-primary" href="/solucoes">Escolher um pacote <ArrowRight size={16}/></Link><Link className="solutions-secondary" href="/catalogo">Explorar catálogo</Link></div></div><div className="howbuy-hero-card"><ShoppingBasket size={24}/><strong>Pronto para começar?</strong><p>Escolha o tipo de criação e o tamanho do lote. O pedido inicial é simples e sem compromisso.</p><Link href="/solucoes">Ver pacotes disponíveis <ArrowRight size={15}/></Link></div></div></section>
 <section className="container howbuy-main"><div className="solutions-section-heading"><div><span className="eyebrow">Processo de compra</span><h2>Da escolha à confirmação</h2><p>Um percurso claro, com apoio da equipa em cada etapa.</p></div></div><div className="howbuy-steps-grid">{steps.map(({icon:Icon,title,text},i)=><article key={title}><span className="howbuy-step-number">0{i+1}</span><span className="howbuy-step-icon"><Icon size={22}/></span><h3>{title}</h3><p>{text}</p></article>)}</div>
 <div className="howbuy-assurances">{assurances.map(({icon:Icon,title,text})=><article key={title}><Icon size={20}/><div><strong>{title}</strong><p>{text}</p></div></article>)}</div>
 <section className="howbuy-choice"><div><span className="eyebrow">Escolha o próximo passo</span><h2>O que pretende comprar hoje?</h2><p>Se já sabe o tipo e a dimensão da criação, comece por um pacote. Se procura um artigo específico, vá directamente ao catálogo.</p></div><div className="howbuy-choice-actions"><Link href="/solucoes" className="howbuy-choice-primary"><PackageCheck size={18}/><span><strong>Comprar por pacote</strong><small>Escolher espécie e número de aves</small></span><ArrowRight size={17}/></Link><Link href="/catalogo" className="howbuy-choice-secondary"><ShoppingBasket size={18}/><span><strong>Comprar produtos individuais</strong><small>Pesquisar artigos no catálogo</small></span><ArrowRight size={17}/></Link></div></section>
 <div className="notice-panel howbuy-notice"><CheckCircle2 size={22}/><div><strong>Importante: o envio do pedido não é uma encomenda confirmada.</strong><p>Preços, stock, prazo, entrega e meios de pagamento são confirmados pela equipa. Não efectue pagamentos com base apenas no envio do formulário.</p></div></div>
 </section>
 </SiteFrame>}
