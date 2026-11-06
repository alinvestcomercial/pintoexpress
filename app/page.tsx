import { ArrowRight, CalendarDays, CheckCircle2, MessageCircle, Phone, Search, ShieldCheck, Truck, Wheat } from "lucide-react";

const categories = [
  { title: "Pintos", text: "Broilers, SASSO, poedeiras e outros lotes.", tag: "01" },
  { title: "Rações", text: "Alimentação adequada para cada fase.", tag: "02" },
  { title: "Saúde avícola", text: "Vitaminas, suplementos e produtos de manejo.", tag: "03" },
  { title: "Equipamentos", text: "Comedouros, bebedouros e material de criação.", tag: "04" },
];

const lots = [
  { breed: "Broiler", label: "Pinto de corte", date: "14 Nov", available: "2.500", price: "55 MT", status: "Reserva aberta" },
  { breed: "SASSO", label: "Pinto rústico", date: "21 Nov", available: "1.200", price: "65 MT", status: "Novo lote" },
  { breed: "Poedeira", label: "Pinto para postura", date: "28 Nov", available: "800", price: "70 MT", status: "Reserva aberta" },
];

export default function Home() {
  return (
    <>
      <header className="top"><nav className="container nav">
          <a className="brand" href="#"><span className="brand-mark">P</span><span className="brand-name">Pinto<strong>Express</strong></span><small>AVICULTURA · MOÇAMBIQUE</small></a>
          <div className="navlinks">
            <a href="#comprar">Produtos</a>
            <a href="#lotes">Pintos</a>
            <a href="#kits">Kits de criação</a>
            <a href="#empresa">Sobre nós</a>
          </div>
          <a className="whatsapp-mini" href="#contacto"><MessageCircle size={17}/> WhatsApp</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-image"/>
          <div className="hero-overlay"/>
          <div className="container hero-content">
            <div className="hero-copy">
              <div className="hero-label"><span/> BALCÃO AVÍCOLA</div>
              <h1>O que precisa para<br/><mark>a sua criação.</mark></h1>
              <p>Pintos, rações, saúde e equipamentos. Escolha o que precisa, reserve o seu lote e fale directamente com a nossa equipa.</p>
              <div className="hero-actions">
                <a className="btn maize" href="#lotes">Ver pintos disponíveis <ArrowRight size={17}/></a>
                <a className="btn white-outline" href="#contacto"><MessageCircle size={17}/> Pedir pelo WhatsApp</a>
              </div>
              <div className="hero-proof"><span><CheckCircle2 size={15}/> Reserva por lote</span><span><CheckCircle2 size={15}/> Pagamento M-Pesa</span><span><CheckCircle2 size={15}/> Atendimento humano</span></div>
            </div>
          </div>
        </section>

        <section className="counter"><div className="container counter-inner"><div className="counter-intro"><span className="counter-kicker">BALCÃO PINTOEXPRESS</span><h2>O que procura hoje?</h2><p>Comece pelo produto ou diga-nos o que pretende criar.</p></div><div className="counter-search"><Search size={18}/><span>Procure pintos, ração, equipamentos...</span><b>Pesquisar</b></div><a className="counter-whatsapp" href="#contacto"><MessageCircle size={17}/><span><strong>Comprar pelo WhatsApp</strong><small>Atendimento comercial</small></span><ArrowRight size={16}/></a></div></section>

        <section id="comprar" className="container section catalog-section"><div className="section-heading"><div><span className="eyebrow">Catálogo</span><h2>Entre no nosso balcão</h2><p>Escolha uma categoria para encontrar o que precisa.</p></div><a className="section-link" href="#contacto">Precisa de orientação? <ArrowRight size={15}/></a></div><div className="category-grid">{categories.map((item)=><a className="category-card" href="#lotes" key={item.title}><div className="category-image"><span>{item.tag}</span><div className="category-arrow"><ArrowRight size={17}/></div></div><div className="category-copy"><h3>{item.title}</h3><p>{item.text}</p><b>Entrar no balcão</b></div></a>)}</div></section><section id="lotes" className="container section">
          <div className="section-heading">
            <div><span className="eyebrow">Disponibilidade</span><h2>Próximos lotes de pintos</h2><p>Reserve antecipadamente para garantir a quantidade que precisa.</p></div>
            <a className="section-link" href="#contacto">Falar sobre um lote <ArrowRight size={15}/></a>
          </div>
          <div className="lot-counter"><div className="lot-counter-title"><ShoppingBasket size={19}/><span><strong>Feira de pintos</strong><small>Próximas datas de disponibilidade</small></span></div><div className="lot-filter"><span>Todos</span><span>Corte</span><span>Rústicos</span><span>Postura</span></div></div><div className="lot-grid">
            {lots.map((lot, index) => (
              <article className={index === 0 ? "lot-card featured" : "lot-card"} key={lot.breed}>
                <div className="lot-card-head"><span className="lot-status">{lot.status}</span><span className="lot-code">LOTE 0{index + 1}</span></div>
                <div className="lot-visual"><div className="chick-symbol">P</div><span>PINTOEXPRESS</span></div>
                <div className="lot-body"><small>{lot.label}</small><h3>{lot.breed}</h3><div className="lot-details"><span><CalendarDays size={15}/>{lot.date}</span><span><strong>{lot.available}</strong> disponíveis</span></div><div className="lot-bottom"><div><b>{lot.price}</b><small>por unidade</small></div><a href="#contacto">Reservar <ArrowRight size={15}/></a></div></div>
              </article>
            ))}
          </div>
        </section>

        <section id="kits" className="container section">
          <div className="kit-panel">
            <div className="kit-copy">
              <span className="eyebrow">Balcão de orientação</span>
              <h2>Já sabe quantas aves quer criar?</h2>
              <p>Escolha a dimensão da criação. Nós ajudamos a montar o pedido com pintos, ração e os produtos necessários.</p>
              <a className="btn forest" href="#contacto">Montar o meu pedido <ArrowRight size={17}/></a>
            </div>
            <div className="kit-options">
              {["50", "100", "500", "1.000"].map((n, i) => <div className={i === 1 ? "kit-option selected" : "kit-option"} key={n}><b>{n}</b><span>aves</span></div>)}
            </div>
          </div>
        </section>

        <section id="empresa" className="container section">
          <div className="company-panel">
            <div className="company-photo"/>
            <div className="company-copy">
              <span className="eyebrow">PintoExpress</span>
              <h2>Um balcão digital, com atendimento de verdade.</h2>
              <p>O PintoExpress aproxima o comércio avícola de quem cria. Pode começar no site, continuar no WhatsApp ou falar directamente com a nossa equipa.</p>
              <div className="trust-list">
                <div><ShieldCheck size={19}/><span><strong>Empresa identificada</strong><small>Presença e atendimento comercial em Moçambique.</small></span></div>
                <div><Wheat size={19}/><span><strong>Produtos para toda a criação</strong><small>Pintos, alimentação, saúde e equipamentos.</small></span></div>
                <div><Truck size={19}/><span><strong>Levantamento ou entrega</strong><small>Condições combinadas conforme produto e destino.</small></span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="container section last">
          <div className="contact-card">
            <div><span className="eyebrow maize-text">Atendimento</span><h2>Não sabe por onde começar?</h2><p>Diga-nos quantas aves pretende criar e para que finalidade. Orientamos o seu pedido.</p></div>
            <div className="contact-actions"><a className="btn maize" href="#"><MessageCircle size={18}/> Falar pelo WhatsApp</a><a className="phone-link" href="#"><Phone size={15}/> Atendimento comercial</a></div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand footer-brand" href="#"><span className="brand-mark">P</span><span className="brand-name">Pinto<strong>Express</strong></span><small>AVICULTURA · MOÇAMBIQUE</small></a>
          <div className="footer-links"><a href="#comprar">Produtos</a><a href="#lotes">Lotes</a><a href="#empresa">Sobre nós</a><a href="#contacto">Contacto</a></div>
          <p>© 2026 PintoExpress · Moçambique</p>
        </div>
      </footer>
    </>
  );
}