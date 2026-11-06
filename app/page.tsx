"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight, CalendarDays, CheckCircle2, ChevronDown, MapPin, Menu,
  MessageCircle, Search, ShoppingBasket, Sprout, Truck, Wheat, X,
  Egg, HeartPulse, PackageCheck, ClipboardList
} from "lucide-react";

const categories = [
  { number:"01", title:"Pintos de um dia", description:"Pintos de corte, SASSO e poedeiras. Consulte os lotes e reserve.", image:"https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=85", tags:"pintos pintos de corte broiler sasso poedeiras lotes" },
  { number:"02", title:"Rações e nutrição", description:"Alimentação para arranque, crescimento, acabamento e postura.", image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85", tags:"ração racoes alimentação nutricao arranque crescimento postura" },
  { number:"03", title:"Saúde avícola", description:"Vitaminas, suplementos e produtos para o cuidado das aves.", image:"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1000&q=85", tags:"saude saúde vitaminas suplementos medicamentos" },
  { number:"04", title:"Equipamentos", description:"Comedouros, bebedouros, aquecimento e material de criação.", image:"https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=1000&q=85", tags:"equipamentos comedouros bebedouros aquecimento" },
  { number:"05", title:"Kits de criação", description:"Conjuntos práticos para começar ou ampliar a sua produção.", image:"https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=85", tags:"kits criação criacao iniciar produção" },
  { number:"06", title:"Entrega e levantamento", description:"Escolha a forma mais conveniente de receber a sua encomenda.", image:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=85", tags:"entrega levantamento transporte recolha" },
];

const lots = [
  { breed:"Broiler", type:"Pinto de corte", date:"14 Nov", quantity:"2.500", price:"55 MT" },
  { breed:"SASSO", type:"Pinto rústico", date:"21 Nov", quantity:"1.200", price:"65 MT" },
  { breed:"Poedeira", type:"Pinto para postura", date:"28 Nov", quantity:"800", price:"70 MT" },
];

const highlights = [
  { icon:Egg, title:"Consultar pintos", text:"Veja raças, próximos lotes e quantidades disponíveis.", href:"#pintos", action:"Ver lotes" },
  { icon:Wheat, title:"Encontrar alimentação", text:"Escolha rações e nutrição adequadas a cada fase.", href:"#categorias", action:"Ver rações" },
  { icon:ClipboardList, title:"Montar uma criação", text:"Descubra os produtos e materiais para o seu projecto.", href:"#solucoes", action:"Começar" },
];

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState("100");
  const visibleCategories = useMemo(
    () => categories.filter(item => (item.title + " " + item.description + " " + item.tags).toLocaleLowerCase().includes(query.toLocaleLowerCase())),
    [query]
  );
  const search = () => {
    setQuery(searchText.trim());
    document.getElementById("categorias")?.scrollIntoView({ behavior:"smooth" });
  };

  return (
    <div className="site">
      <header className="site-header">
        <div className="container nav">
          <a className="brand" href="#" aria-label="PintoExpress início">
            <span className="brand-mark">P</span>
            <span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span>
          </a>
          <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Navegação principal">
            <a href="#categorias" onClick={() => setMenuOpen(false)}>Produtos</a>
            <a href="#pintos" onClick={() => setMenuOpen(false)}>Lotes de pintos</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como comprar</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contactos</a>
          </nav>
          <div className="nav-actions">
            <a className="nav-login" href="#contacto">Atendimento</a>
            <a className="nav-cta" href="#categorias">Explorar balcão <ArrowRight size={15}/></a>
            <button className="mobile-menu" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
          </div>
        </div>
      </header>

      <main>
        <section className="billboard">
          <div className="billboard-photo" />
          <div className="container billboard-content">
            <div className="billboard-copy">
              <span className="billboard-kicker"><i/> BALCÃO DIGITAL AVÍCOLA</span>
              <h1>Encontre tudo para a sua criação.</h1>
              <p>Pintos, rações, saúde e equipamentos num só lugar. Descubra produtos, consulte lotes e fale directamente com a nossa equipa.</p>
              <div className="billboard-actions">
                <a className="billboard-cta" href="#categorias">Explorar produtos <ArrowRight size={17}/></a>
                <a className="billboard-secondary" href="#pintos">Consultar próximos lotes</a>
              </div>
            </div>
            <div className="billboard-bottom"><span>PINTOEXPRESS · O SEU BALCÃO AVÍCOLA</span><span>MOÇAMBIQUE</span></div>
          </div>
        </section>

        <section className="search-section">
          <div className="container search-inner">
            <div className="search-title"><span className="eyebrow">Pesquise no balcão</span><h2>O que procura?</h2></div>
            <div className="search-main">
              <Search size={21}/>
              <input aria-label="Produto, raça, lote ou necessidade" value={searchText} onChange={event => setSearchText(event.target.value)} onKeyDown={event => { if (event.key === "Enter") search(); }} placeholder="Produto, raça, ração ou equipamento..."/>
              <button onClick={search}>Pesquisar <ArrowRight size={15}/></button>
            </div>
            <div className="search-shortcuts"><span>Comece por:</span><a href="#pintos">Pintos</a><a href="#categorias">Rações</a><a href="#categorias">Saúde avícola</a><a href="#categorias">Equipamentos</a><span className="search-location"><MapPin size={14}/> Moçambique</span></div>
          </div>
        </section>

        <section className="container section quick-section">
          <div className="section-heading"><div><span className="eyebrow">Comece por aqui</span><h2>Uma necessidade. A solução certa.</h2><p>Aceda directamente ao que precisa no nosso balcão.</p></div><a href="#categorias">Ver todas as categorias <ArrowRight size={16}/></a></div>
          <div className="highlight-grid">{highlights.map(({icon:Icon,title,text,href,action}) => <a className="highlight-card" href={href} key={title}><span className="highlight-icon"><Icon size={23}/></span><span className="highlight-copy"><strong>{title}</strong><small>{text}</small><b>{action} <ArrowRight size={15}/></b></span></a>)}</div>
        </section>

        <section id="categorias" className="container section">
          <div className="section-heading"><div><span className="eyebrow">Explore o balcão</span><h2>Procure por categoria.</h2><p>Escolha uma área e descubra produtos e soluções para a sua actividade.</p></div><a href="#contacto">Precisa de ajuda? <ArrowRight size={16}/></a></div>
          {query && <div className="search-result-note">Resultados para <strong>“{query}”</strong><button onClick={() => {setQuery("");setSearchText("");}}>Limpar pesquisa</button></div>}
          <div className="area-grid">{visibleCategories.map(item => <a className="area-card" href={item.title === "Pintos de um dia" ? "#pintos" : "#contacto"} key={item.number}>
            <div className="area-image" style={{backgroundImage:"linear-gradient(180deg,rgba(8,39,25,.02),rgba(8,39,25,.52)),url("+item.image+")"}}><span className="area-num">{item.number}</span><span className="area-image-action">Explorar <ArrowRight size={15}/></span></div>
            <div className="area-card-copy"><h3>{item.title}</h3><p>{item.description}</p><span className="area-card-link">Ver produtos e soluções <ArrowRight size={15}/></span></div>
          </a>)}</div>
          {visibleCategories.length === 0 && <div className="no-results">Não encontrámos essa categoria. Experimente outra pesquisa ou fale connosco.</div>}
        </section>

        <section id="como-funciona" className="container section">
          <div className="section-heading"><div><span className="eyebrow">Duas formas de comprar</span><h2>O que pretende fazer?</h2><p>Quer comprar para a sua criação ou preparar um negócio de fornecimento? Estamos aqui para ajudar.</p></div></div>
          <div className="audience-grid">
            <article className="audience-card buyer-card"><span className="audience-label">CRIADOR / COMPRADOR</span><h3>Quero comprar para a minha criação.</h3><p>Encontre pintos, alimentação e materiais. Consulte os lotes e organize a sua encomenda com apoio da nossa equipa.</p><div><a href="#pintos">Consultar produtos <ArrowRight size={15}/></a><a href="#contacto">Falar com atendimento</a></div></article>
            <article className="audience-card producer-card"><span className="audience-label">PRODUTOR / REVENDEDOR</span><h3>Quero abastecer ou crescer.</h3><p>Partilhe as suas necessidades de quantidade e frequência. Ajudamos a identificar produtos e condições adequadas.</p><div><a href="#contacto">Pedir orientação <ArrowRight size={15}/></a><a href="#solucoes">Planear fornecimento</a></div></article>
          </div>
        </section>

        <section id="pintos" className="container section">
          <div className="section-heading"><div><span className="eyebrow">Disponibilidade de pintos</span><h2>Próximos lotes.</h2><p>Consulte as datas indicativas e confirme disponibilidade antes de reservar.</p></div><a href="#contacto">Consultar a equipa <ArrowRight size={16}/></a></div>
          <div className="lots-list">{lots.map((lot,index) => <article className={index === 0 ? "lot-row featured" : "lot-row"} key={lot.breed}><div className="lot-symbol"><ShoppingBasket size={22}/></div><div className="lot-main"><span>{lot.type}</span><h3>{lot.breed}</h3></div><div className="lot-data"><small>Data prevista</small><strong><CalendarDays size={15}/>{lot.date}</strong></div><div className="lot-data"><small>Quantidade indicativa</small><strong>{lot.quantity}</strong></div><div className="lot-price"><small>Preço de referência</small><strong>{lot.price}<b> / unidade</b></strong></div><a className="lot-action" href="#contacto">Consultar <ArrowRight size={15}/></a></article>)}</div>
          <p className="lot-disclaimer">Datas, quantidades e preços sujeitos a confirmação pela equipa PintoExpress.</p>
        </section>

        <section id="solucoes" className="container section">
          <div className="solution-panel"><div className="solution-copy"><span className="eyebrow light">Planeie a sua criação</span><h2>Quantas aves pretende criar?</h2><p>Escolha uma dimensão aproximada. A nossa equipa pode ajudar a organizar pintos, alimentação e equipamentos para o seu projecto.</p><a className="primary-btn" href="#contacto">Pedir orientação <ArrowRight size={16}/></a></div><div className="quantity-box"><span>Dimensão da criação</span><div>{["50","100","500","1.000"].map(value=><button type="button" className={quantity === value ? "selected" : ""} onClick={() => setQuantity(value)} key={value}><strong>{value}</strong><small>aves</small></button>)}</div><p>Selecção actual: <strong>{quantity} aves</strong></p></div></div>
        </section>

        <section className="container section">
          <div className="trust-strip"><div className="trust-icon"><CheckCircle2 size={25}/></div><div><strong>Um balcão próximo, agora também digital.</strong><p>Descubra, consulte e organize as suas compras com atendimento humano, pagamento por M-Pesa e opção de levantamento ou entrega.</p></div><div className="trust-benefits"><span><Wheat size={17}/> Produtos avícolas</span><span><Truck size={17}/> Entrega ou levantamento</span><span><HeartPulse size={17}/> Apoio ao criador</span></div></div>
        </section>

        <section id="contacto" className="container section last"><div className="contact-panel"><div><span className="eyebrow light">ATENDIMENTO PINTOEXPRESS</span><h2>Vamos encontrar o que precisa?</h2><p>Envie-nos a sua necessidade. A nossa equipa ajuda a confirmar produtos, lotes, quantidades e condições.</p></div><a className="primary-btn" href="https://wa.me/?text=Olá%20PintoExpress,%20preciso%20de%20informações%20sobre%20produtos%20avícolas."><MessageCircle size={17}/> Falar pelo WhatsApp</a></div></section>
      </main>
      <footer><div className="container footer-inner"><a className="brand" href="#"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></a><div><a href="#categorias">Produtos</a><a href="#pintos">Lotes</a><a href="#como-funciona">Como comprar</a><a href="#contacto">Contactos</a></div><small>© 2026 PintoExpress · Moçambique</small></div></footer>
    </div>
  );
}
