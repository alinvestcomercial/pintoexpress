import { ArrowRight, CalendarDays, CheckCircle2, MapPin, MessageCircle, Search, ShoppingBasket, Truck, Wheat } from "lucide-react";

const areas = [
  ["01", "Pintos e lotes", "Broilers, SASSO, poedeiras e outros pintos disponíveis por lote."],
  ["02", "Rações e alimentação", "Rações para arranque, crescimento, acabamento e postura."],
  ["03", "Saúde avícola", "Vitaminas, suplementos e soluções para o maneio das aves."],
  ["04", "Equipamentos", "Comedouros, bebedouros, aquecimento e material de criação."],
  ["05", "Kits de criação", "Soluções organizadas para quem vai começar ou aumentar a produção."],
  ["06", "Entregas e levantamento", "Combine a forma mais conveniente de receber a sua encomenda."],
];

const lots = [
  ["Broiler", "Pinto de corte", "14 Nov", "2.500", "55 MT"],
  ["SASSO", "Pinto rústico", "21 Nov", "1.200", "65 MT"],
  ["Poedeira", "Pinto para postura", "28 Nov", "800", "70 MT"],
];

export default function Home() {
  return (
    <div className="site">
      <header className="site-header">
        <div className="container nav">
          <a className="brand" href="#">
            <span className="brand-mark">P</span>
            <span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span>
          </a>
          <nav>
            <a href="#explorar">Explorar</a><a href="#pintos">Pintos</a><a href="#solucoes">Soluções</a><a href="#empresa">A empresa</a>
          </nav>
          <a className="header-link" href="#contacto">Falar connosco <ArrowRight size={14}/></a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">BALCÃO AVÍCOLA · MOÇAMBIQUE</span>
              <h1>Encontre tudo para<br/><em>criar aves.</em></h1>
              <p>Descubra pintos, rações, equipamentos e soluções para a sua produção avícola. Pesquise primeiro. Depois, compre ou fale directamente com a nossa equipa.</p>
            </div>
            <div className="hero-search">
              <div className="search-box"><Search size={19}/><span>Produto, raça, lote ou necessidade</span><button>Pesquisar</button></div>
              <div className="location-box"><MapPin size={15}/><span>Localização</span><strong>Moçambique</strong></div>
              <div className="search-quick"><span>Explorar:</span><a href="#pintos">Pintos</a><a href="#explorar">Rações</a><a href="#explorar">Equipamentos</a><a href="#solucoes">Kits</a></div>
            </div>
          </div>
        </section>

        <section className="market-bar">
          <div className="container market-inner">
            <div><strong>PINTOEXPRESS</strong><span>O mercado avícola num só lugar.</span></div>
            <div className="market-links"><a className="active" href="#explorar">Produtos e soluções</a><a href="#pintos">Lotes disponíveis</a><a href="#contacto">Atendimento</a></div>
          </div>
        </section>

        <section id="explorar" className="container section">
          <div className="section-heading">
            <div><span className="eyebrow">O mercado avícola</span><h2>O que procura?</h2><p>Escolha uma área para começar a descobrir produtos e soluções.</p></div>
            <a href="#contacto">Ver catálogo <ArrowRight size={15}/></a>
          </div>
          <div className="area-grid">
            {areas.map(([num,title,text]) => (
              <a className="area-card" href={title === "Pintos e lotes" ? "#pintos" : "#contacto"} key={title}>
                <span className="area-num">{num}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <ArrowRight size={16}/>
              </a>
            ))}
          </div>
        </section>

        <section className="container section process-section">
          <div className="section-heading"><div><span className="eyebrow">Como funciona</span><h2>Uma forma simples de comprar.</h2></div></div>
          <div className="process-grid">
            <div><span>01</span><h3>Encontrar</h3><p>Pesquise por produto, raça, lote ou necessidade.</p></div>
            <div><span>02</span><h3>Escolher</h3><p>Compare disponibilidade, quantidade e condições.</p></div>
            <div><span>03</span><h3>Fazer negócio</h3><p>Reserve, pague por M-Pesa ou fale com a nossa equipa.</p></div>
          </div>
        </section>

        <section id="pintos" className="container section">
          <div className="section-heading">
            <div><span className="eyebrow">Disponibilidade</span><h2>Próximos lotes de pintos.</h2><p>Veja o que está previsto e reserve com antecedência.</p></div>
            <a href="#contacto">Ver todos os lotes <ArrowRight size={15}/></a>
          </div>
          <div className="lots-list">
            {lots.map(([breed,label,date,available,price], i) => (
              <article className={i === 0 ? "lot-row featured" : "lot-row"} key={breed}>
                <div className="lot-symbol"><ShoppingBasket size={21}/></div>
                <div className="lot-main"><span>{label}</span><h3>{breed}</h3></div>
                <div className="lot-data"><small>Disponibilidade</small><strong><CalendarDays size={14}/>{date}</strong></div>
                <div className="lot-data"><small>Disponíveis</small><strong>{available}</strong></div>
                <div className="lot-price"><small>Desde</small><strong>{price}<b> / unidade</b></strong></div>
                <a className="lot-action" href="#contacto">Reservar <ArrowRight size={14}/></a>
              </article>
            ))}
          </div>
        </section>

        <section id="solucoes" className="container section">
          <div className="solution-panel">
            <div className="solution-copy">
              <span className="eyebrow">Para quem quer produzir</span>
              <h2>Não sabe por onde começar?</h2>
              <p>Diga-nos quantas aves pretende criar e para que finalidade. A nossa equipa ajuda a montar uma solução com pintos, alimentação e os principais materiais.</p>
              <a className="primary-btn" href="#contacto">Montar a minha criação <ArrowRight size={15}/></a>
            </div>
            <div className="quantity-box"><span>Quero criar</span><div><a href="#contacto"><strong>50</strong><small>aves</small></a><a className="selected" href="#contacto"><strong>100</strong><small>aves</small></a><a href="#contacto"><strong>500</strong><small>aves</small></a><a href="#contacto"><strong>1.000</strong><small>aves</small></a></div></div>
          </div>
        </section>

        <section id="empresa" className="container section">
          <div className="split-section">
            <div className="split-copy">
              <span className="eyebrow">Presença avícola</span>
              <h2>Um balcão próximo, agora também digital.</h2>
              <p>O PintoExpress combina a confiança de uma operação física com uma forma mais simples de descobrir, reservar e comprar produtos para avicultura.</p>
              <div className="trust-list"><span><CheckCircle2 size={16}/> Empresa identificada</span><span><Wheat size={16}/> Produtos para criação</span><span><Truck size={16}/> Levantamento ou entrega</span></div>
            </div>
            <div className="presence-card"><span className="eyebrow">Quem está aqui</span><h3>Produtores, criadores e compradores.</h3><p>Para quem começa pequeno e para quem precisa de abastecimento regular.</p><a href="#contacto">Falar com a equipa <ArrowRight size={14}/></a></div>
          </div>
        </section>

        <section id="contacto" className="container section last">
          <div className="contact-panel"><div><span className="eyebrow light">ATENDIMENTO</span><h2>Tem uma necessidade específica?</h2><p>Envie-nos o que procura. Podemos ajudar a encontrar o produto, lote ou solução adequada.</p></div><a className="primary-btn" href="#"><MessageCircle size={16}/> Falar pelo WhatsApp</a></div>
        </section>
      </main>

      <footer><div className="container footer-inner"><a className="brand" href="#"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></a><div><a href="#explorar">Explorar</a><a href="#pintos">Pintos</a><a href="#solucoes">Soluções</a><a href="#empresa">A empresa</a></div><small>© 2026 PintoExpress · Moçambique</small></div></footer>
    </div>
  );
}
