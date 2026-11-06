import Link from "next/link";
import { ArrowRight, Check, Bird, Egg, Sprout, Package, UserRound, Gauge, ShoppingBasket, ClipboardCheck, MessageCircle } from "lucide-react";
import { SiteFrame } from "../components/SiteChrome";

const packages = [
  { id:"broiler-100-iniciante", species:"Frango de corte", bird:"Broiler", icon:Bird, lot:"100 aves", stage:"Iniciante", title:"Primeiro Lote Broiler", description:"Para começar com um lote gerível e organizar os essenciais desde a chegada dos pintos.", includes:["Pintos de corte","Ração de iniciação e crescimento","Comedouros e bebedouros","Orientação inicial de maneio"], level:"Começar com estrutura", featured:true },
  { id:"broiler-500-experiente", species:"Frango de corte", bird:"Broiler", icon:Bird, lot:"500 aves", stage:"Experiente", title:"Lote Broiler 500", description:"Uma opção para produtores com instalação e rotina de maneio já preparadas.", includes:["Pintos de corte","Plano de alimentação por fase","Equipamento dimensionado ao lote","Reforço de consumíveis conforme necessidade"], level:"Escalar a produção" },
  { id:"poedeira-50-iniciante", species:"Poedeiras", bird:"Postura", icon:Egg, lot:"50 aves", stage:"Iniciante", title:"Primeiro Lote de Poedeiras", description:"Para iniciar um pequeno projecto de produção de ovos com os artigos essenciais organizados.", includes:["Pintos de poedeira","Alimentação adequada à fase","Comedouros e bebedouros","Orientação para preparação da instalação"], level:"Começar a produzir" },
  { id:"poedeira-200-experiente", species:"Poedeiras", bird:"Postura", icon:Egg, lot:"200 aves", stage:"Experiente", title:"Lote de Postura 200", description:"Para quem já conhece a rotina de criação e pretende estruturar um lote de maior dimensão.", includes:["Pintos de poedeira","Plano de alimentação por fase","Equipamento para o lote","Consumíveis complementares"], level:"Aumentar capacidade" },
  { id:"sasso-50-iniciante", species:"Aves rústicas", bird:"SASSO", icon:Sprout, lot:"50 aves", stage:"Iniciante", title:"Primeiro Lote SASSO", description:"Uma entrada acompanhada para criação de aves rústicas em sistema diversificado.", includes:["Pintos SASSO","Alimentação adequada ao sistema","Comedouros e bebedouros","Orientação para o maneio inicial"], level:"Explorar criação rústica" },
  { id:"sasso-200-experiente", species:"Aves rústicas", bird:"SASSO", icon:Sprout, lot:"200 aves", stage:"Experiente", title:"Lote SASSO 200", description:"Pacote de referência para produtores com experiência que pretendem ampliar o efectivo.", includes:["Pintos SASSO","Alimentação por fase","Equipamento para o lote","Consumíveis conforme o sistema"], level:"Ampliar o efectivo" },
];

const buyingSteps = [
 {n:"01",title:"Escolha o lote",text:"Seleccione a espécie, a quantidade de aves e o nível de acompanhamento adequado."},
 {n:"02",title:"Personalize a consulta",text:"Indique a localidade, a data pretendida e as condições da sua instalação."},
 {n:"03",title:"Receba a proposta",text:"Confirmamos disponibilidade, composição, quantidades, preço e entrega antes de fechar a compra."}
];

export default function Solucoes(){
 return <SiteFrame>
  <section className="solutions-hero"><div className="container solutions-hero-inner">
   <div className="solutions-hero-copy"><div className="solutions-breadcrumb"><Link href="/">Início</Link><span>/</span><span>Soluções</span></div>
    <span className="eyebrow light">PACOTES DE CRIAÇÃO · PINTOEXPRESS</span>
    <h1>Escolha o seu lote. Nós ajudamos a preparar o resto.</h1>
    <p>Pacotes organizados por espécie, quantidade de aves e experiência do produtor. Escolha uma opção de referência e peça uma proposta ajustada à sua realidade.</p>
    <div className="solutions-hero-actions"><a className="solutions-primary" href="#pacotes">Escolher um pacote <ArrowRight size={16}/></a><Link className="solutions-secondary" href="/catalogo">Ver produtos individuais</Link></div>
   </div>
   <aside className="solutions-hero-aside"><span className="solutions-aside-icon"><Package size={23}/></span><strong>Uma compra mais simples</strong><p>Em vez de começar do zero, escolha um lote com os produtos essenciais organizados por necessidade.</p><div><span><Check size={14}/> Por espécie e dimensão</span><span><Check size={14}/> Para iniciar ou expandir</span><span><Check size={14}/> Proposta confirmada consigo</span></div></aside>
  </div></section>
  <section className="container solutions-main" id="pacotes">
   <div className="solutions-section-heading"><div><span className="eyebrow">Escolha pelo seu projecto</span><h2>Pacotes de criação</h2><p>Comece por uma opção de referência. A composição final é ajustada à sua instalação e ao calendário de fornecimento.</p></div></div>
   <div className="solutions-package-grid">
    {packages.map(({id,species,bird,icon:Icon,lot,stage,title,description,includes,level,featured})=><article className={featured?"solutions-package-card featured":"solutions-package-card"} key={id}>
     <div className="solutions-package-top"><span className="solutions-package-icon"><Icon size={23}/></span><span className="solutions-package-number">{lot}</span></div>
     <div className="solutions-package-tags"><span>{species}</span><span>{stage}</span></div>
     <h3>{title}</h3><p>{description}</p>
     <div className="solutions-package-points"><strong>O pacote contempla</strong>{includes.map(item=><span key={item}><Check size={14}/>{item}</span>)}</div>
     <div className="solutions-package-foot"><small>{level}</small><Link href={"/pedido?modelo=pacote&pacote="+encodeURIComponent(id)+"&especie="+encodeURIComponent(bird)+"&lote="+encodeURIComponent(lot)+"&experiencia="+encodeURIComponent(stage)}>Escolher este pacote <ArrowRight size={16}/></Link></div>
    </article>)}
   </div>
   <div className="solutions-package-note"><span><ClipboardCheck size={20}/></span><div><strong>Pacotes de referência, preparados à sua medida</strong><p>As quantidades apresentadas são opções iniciais para facilitar a escolha, não representam um histórico confirmado de vendas nem garantem stock. A equipa confirma a disponibilidade dos pintos, composição, quantidades de ração e equipamentos, preço e condições antes da compra.</p></div></div>
   <section className="solutions-how"><div className="solutions-how-heading"><span className="eyebrow">Da escolha à compra</span><h2>Três passos para avançar.</h2><p>Não precisa de dominar todos os detalhes técnicos para pedir uma proposta.</p></div><div className="solutions-steps">{buyingSteps.map(s=><article key={s.n}><span>{s.n}</span><div><strong>{s.title}</strong><p>{s.text}</p></div></article>)}</div></section>
   <section className="solutions-contact-cta"><div className="solutions-cta-icon"><MessageCircle size={22}/></div><div><span className="eyebrow light">NÃO ENCONTROU O LOTE CERTO?</span><h2>Peça um pacote personalizado.</h2><p>Podemos ajustar a quantidade, a espécie e a composição dos artigos ao seu projecto e à capacidade da sua instalação.</p></div><Link href="/pedido?modelo=pacote-personalizado">Personalizar o meu pacote <ArrowRight size={16}/></Link></section>
  </section>
 </SiteFrame>
}