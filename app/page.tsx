import { ArrowRight, CalendarDays, CheckCircle2, MessageCircle, Search, ShoppingBasket, ShieldCheck, Truck, Wheat } from "lucide-react";

const categories = [
  ["Pintos", "Broilers, SASSO, poedeiras e outros lotes.", "01"],
  ["Rações", "Alimentação adequada para cada fase.", "02"],
  ["Saúde avícola", "Vitaminas, suplementos e produtos de manejo.", "03"],
  ["Equipamentos", "Comedouros, bebedouros e material de criação.", "04"],
];

const lots = [
  ["Broiler", "Pinto de corte", "14 Nov", "2.500", "55 MT", "Reserva aberta"],
  ["SASSO", "Pinto rústico", "21 Nov", "1.200", "65 MT", "Novo lote"],
  ["Poedeira", "Pinto para postura", "28 Nov", "800", "70 MT", "Reserva aberta"],
];

export default function Home() {
  return <div>
    <header className="site-header">
      <div className="container nav">
        <a className="brand" href="#"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></a>
        <nav><a href="#catalogo">Produtos</a><a href="#pintos">Pintos</a><a href="#criar">Quero criar</a><a href="#empresa">A empresa</a></nav>
        <a className="header-cta" href="#contacto"><MessageCircle size={16}/> WhatsApp</a>
      </div>
    </header>

    <main>
      <section className="hero-counter">
        <div className="container hero-inner">
          <div className="hero-intro">
            <span className="eyebrow light">BALCÃO AVÍCOLA DE MOÇAMBIQUE</span>
            <h1>Encontre o que precisa<br/><span>para criar melhor.</span></h1>
            <p>Pintos, rações, produtos de saúde e equipamentos. Pesquise, escolha e fale directamente com a nossa equipa.</p>
          </div>
          <div className="search-panel">
            <div className="search-row"><Search size={20}/><span>Empresa, produto, raça ou necessidade...</span><button>Pesquisar</button></div>
            <div className="search-links"><span>Procure por:</span><a href="#pintos">Pintos</a><a href="#catalogo">Rações</a><a href="#catalogo">Equipamentos</a><a href="#criar">Kits de criação</a></div>
          </div>
          <div className="hero-trust"><span><CheckCircle2 size={15}/> Reserva por lote</span><span><CheckCircle2 size={15}/> M-Pesa</span><span><CheckCircle2 size={15}/> Atendimento humano</span></div>
        </div>
      </section>

      <section className="counter-nav">
        <div className="container counter-nav-inner">
          <div><strong>PINTOEXPRESS</strong><span>O mercado avícola num só lugar.</span></div>
          <div className="counter-tabs"><a className="active" href="#catalogo">Produtos</a><a href="#pintos">Lotes de pintos</a><a href="#criar">Soluções para criação</a></div>
        </div>
      </section>

      <section id="catalogo" className="container section">
        <div className="section-title"><div><span className="eyebrow">Explore o balcão</span><h2>O que procura?</h2><p>Escolha uma área para começar.</p></div><a href="#contacto">Ver todo o catálogo <ArrowRight size={15}/></a></div>
        <div className="category-grid">{categories.map(([title,text,num])=><a className="category-card" href="#pintos" key={title}><div className="category-number">{num}</div><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={17}/></a>)}</div>
      </section>

      <section id="pintos" className="container section">
        <div className="section-title"><div><span className="eyebrow">Disponibilidade</span><h2>Próximos lotes de pintos</h2><p>Veja as próximas datas e reserve a quantidade de que precisa.</p></div><a href="#contacto">Falar sobre um lote <ArrowRight size={15}/></a></div>
        <div className="market-strip"><div><ShoppingBasket size={19}/><span><strong>Feira de pintos</strong><small>Próximas disponibilidades</small></span></div><div><span>Todos</span><span>Corte</span><span>Rústicos</span><span>Postura</span></div></div>
        <div className="lot-grid">{lots.map(([breed,label,date,available,price,status],i)=><article className={i===0?"lot-card featured":"lot-card"} key={breed}>
          <div className="lot-top"><span>{status}</span><b>LOTE 0{i+1}</b></div><div className="lot-image"><span>P</span></div>
          <div className="lot-content"><small>{label}</small><h3>{breed}</h3><div className="lot-meta"><span><CalendarDays size={15}/>{date}</span><span><strong>{available}</strong> disponíveis</span></div><div className="lot-footer"><strong>{price}<small>/ unidade</small></strong><a href="#contacto">Reservar <ArrowRight size={14}/></a></div></div>
        </article>)}</div>
      </section>

      <section id="criar" className="container section">
        <div className="create-panel">
          <div><span className="eyebrow">Soluções para criação</span><h2>Não sabe exactamente o que comprar?</h2><p>Diga-nos quantas aves pretende criar e para que finalidade. O balcão ajuda a montar a sua compra.</p><a className="primary-btn" href="#contacto">Montar a minha criação <ArrowRight size={16}/></a></div>
          <div className="create-options"><span>Quero criar</span>{["50 aves","100 aves","500 aves","1.000 aves"].map((n,i)=><a className={i===1?"selected":""} href="#contacto" key={n}><strong>{n.split(" ")[0]}</strong><small>aves</small></a>)}</div>
        </div>
      </section>

      <section id="empresa" className="container section">
        <div className="business-section"><div><span className="eyebrow">A nossa casa</span><h2>Um comércio avícola com presença digital.</h2><p>O PintoExpress junta a proximidade de um balcão comercial com a conveniência de poder pesquisar e reservar online.</p><div className="business-points"><span><ShieldCheck size={17}/><b>Compra identificada</b></span><span><Wheat size={17}/><b>Produtos para a criação</b></span><span><Truck size={17}/><b>Levantamento ou entrega</b></span></div></div><div className="business-side"><strong>Precisa de ajuda?</strong><span>Fale com a nossa equipa.</span><a href="#contacto">Ir para atendimento <ArrowRight size={15}/></a></div></div>
      </section>

      <section id="contacto" className="container section last"><div className="contact-card"><div><span className="eyebrow light">ATENDIMENTO</span><h2>Comece aqui.</h2><p>Envie o que procura pelo WhatsApp e a nossa equipa continua o atendimento consigo.</p></div><a className="primary-btn" href="#"><MessageCircle size={17}/> Falar pelo WhatsApp</a></div></section>
    </main>

    <footer><div className="container footer-inner"><a className="brand" href="#"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></a><div><a href="#catalogo">Produtos</a><a href="#pintos">Pintos</a><a href="#empresa">A empresa</a><a href="#contacto">Contacto</a></div><small>© 2026 PintoExpress · Moçambique</small></div></footer>
  </div>;
}