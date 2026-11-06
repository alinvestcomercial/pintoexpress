import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Truck,
  Wheat,
} from "lucide-react";

const categories = [
  { icon: "🐣", title: "Pintos", text: "Broilers, SASSO, poedeiras e outros lotes." },
  { icon: "🌾", title: "Ração", text: "Alimentação para cada fase da criação." },
  { icon: "🩺", title: "Saúde", text: "Vitaminas, suplementos e produtos de manejo." },
  { icon: "📦", title: "Equipamento", text: "Bebedouros, comedouros e material de criação." },
];

const lots = [
  { breed: "Broiler", label: "Pinto de corte", date: "14 Nov", available: "2.500", price: "55 MT", tag: "Mais procurado" },
  { breed: "SASSO", label: "Pinto rústico", date: "21 Nov", available: "1.200", price: "65 MT", tag: "Novo lote" },
  { breed: "Poedeira", label: "Pinto para postura", date: "28 Nov", available: "800", price: "70 MT", tag: "Reserva aberta" },
];

export default function Home() {
  return (
    <>
      <header className="top">
        <nav className="container nav">
          <a className="brand" href="#">Pinto<span>Express</span></a>
          <div className="navlinks">
            <a href="#comprar">Comprar</a>
            <a href="#lotes">Próximos lotes</a>
            <a href="#kits">Kits</a>
            <a href="#como">Como funciona</a>
          </div>
          <div className="nav-actions">
            <a className="icon-link" href="#contacto" aria-label="Pesquisar"><Search size={19}/></a>
            <a className="whatsapp-mini" href="#contacto"><MessageCircle size={18}/> WhatsApp</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <span className="eyebrow light">O balcão digital avícola</span>
            <h1>Crie melhor.<br/><em>Compre certo.</em></h1>
            <p>Pintos, ração e tudo o que precisa para começar e fazer crescer a sua criação.</p>
            <div className="actions">
              <a className="btn primary large" href="#lotes">Comprar pintos <ArrowRight size={18}/></a>
              <a className="btn ghost large" href="#contacto"><MessageCircle size={18}/> Comprar pelo WhatsApp</a>
            </div>
            <div className="hero-proof">
              <span><CheckCircle2 size={16}/> Pagamento por M-Pesa</span>
              <span><CheckCircle2 size={16}/> Reserva por lote</span>
              <span><CheckCircle2 size={16}/> Atendimento humano</span>
            </div>
          </div>
        </section>

        <section id="comprar" className="container section">
          <div className="section-heading">
            <div><span className="eyebrow">Comece por aqui</span><h2>O que você precisa hoje?</h2></div>
            <a className="text-link" href="#lotes">Ver tudo <ChevronRight size={17}/></a>
          </div>
          <div className="category-grid">
            {categories.map((item) => (
              <a className="category-card" href="#lotes" key={item.title}>
                <div className="category-icon">{item.icon}</div>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
                <ChevronRight size={19}/>
              </a>
            ))}
          </div>
        </section>

        <section id="lotes" className="container section">
          <div className="section-heading">
            <div><span className="eyebrow">Disponibilidade</span><h2>Próximos lotes</h2><p>Escolha a data e reserve a quantidade que precisa.</p></div>
            <a className="text-link" href="#contacto">Ver calendário <ChevronRight size={17}/></a>
          </div>
          <div className="lot-grid">
            {lots.map((lot) => (
              <article className="lot-card" key={lot.breed}>
                <div className="lot-photo" />
                <div className="lot-body">
                  <span className="lot-tag">{lot.tag}</span>
                  <h3>{lot.breed}</h3>
                  <p>{lot.label}</p>
                  <div className="lot-meta"><span><CalendarDays size={15}/> {lot.date}</span><span><Package size={15}/> {lot.available} disponíveis</span></div>
                  <div className="lot-footer"><strong>{lot.price}<small>/un.</small></strong><a className="btn small" href="#contacto">Reservar</a></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="kits" className="container section">
          <div className="kit-banner">
            <div>
              <span className="eyebrow">Para quem está a começar</span>
              <h2>Quer criar 100, 500 ou 1.000 aves?</h2>
              <p>Monte a sua criação com um kit pensado para o número de aves. Pintos, ração, saúde e equipamento num só pedido.</p>
              <a className="btn primary" href="#contacto">Montar o meu kit <ArrowRight size={17}/></a>
            </div>
            <div className="kit-options">
              <div><strong>50</strong><span>aves</span></div>
              <div className="active"><strong>100</strong><span>aves</span></div>
              <div><strong>500</strong><span>aves</span></div>
              <div><strong>1.000</strong><span>aves</span></div>
            </div>
          </div>
        </section>

        <section id="como" className="container section">
          <div className="trust-grid">
            <div className="trust-copy">
              <span className="eyebrow">Simples e seguro</span>
              <h2>Do lote ao seu aviário, sem complicação.</h2>
              <p>O PintoExpress junta compra, reserva, pagamento e acompanhamento num único processo.</p>
              <div className="trust-points">
                <div><ShieldCheck size={21}/><span><strong>Empresa identificada</strong><small>Atendimento e presença física em Moçambique.</small></span></div>
                <div><Wheat size={21}/><span><strong>Produtos para a criação</strong><small>Pintos, ração, saúde e equipamento.</small></span></div>
                <div><Truck size={21}/><span><strong>Levantamento ou entrega</strong><small>Opções definidas conforme produto e destino.</small></span></div>
              </div>
            </div>
            <div className="steps-card">
              <div className="step"><b>01</b><div><strong>Escolha</strong><span>Selecione o lote, produto ou kit.</span></div></div>
              <div className="step"><b>02</b><div><strong>Reserve</strong><span>Indique telefone e quantidade.</span></div></div>
              <div className="step"><b>03</b><div><strong>Pague</strong><span>Confirme o pagamento por M-Pesa.</span></div></div>
              <div className="step"><b>04</b><div><strong>Receba</strong><span>Confirmação e documentos pelo WhatsApp.</span></div></div>
            </div>
          </div>
        </section>

        <section id="contacto" className="container section last">
          <div className="contact-card">
            <div><span className="eyebrow">Atendimento</span><h2>Prefere falar com alguém?</h2><p>O balcão também está no WhatsApp. Faça a sua encomenda, consulte uma reserva ou peça ajuda.</p></div>
            <div className="contact-actions"><a className="btn primary large" href="#"><MessageCircle size={19}/> Falar no WhatsApp</a><a className="phone-link" href="#"><Phone size={17}/> Atendimento comercial</a></div>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="container footer-inner"><div className="brand">Pinto<span>Express</span><small>O balcão digital avícola.</small></div><p>© 2026 PintoExpress · Moçambique</p></div></footer>
    </>
  );
}
