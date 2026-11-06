"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin, MessageCircle, Search, ShoppingBasket, Truck, Wheat } from "lucide-react";

const slides = [
  { tag:"PINTOS DE UM DIA", title:"Comece a sua criação com a escolha certa.", text:"Pintos de corte, SASSO e poedeiras. Consulte os próximos lotes e reserve a quantidade de que precisa.", action:"Consultar lotes", href:"#pintos", image:"https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=2200&q=85", tone:"chicks" },
  { tag:"RAÇÕES E NUTRIÇÃO", title:"Alimentação certa em cada fase.", text:"Encontre rações de arranque, crescimento, acabamento e postura para acompanhar o desenvolvimento das suas aves.", action:"Explorar alimentação", href:"#explorar", image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=85", tone:"feed" },
  { tag:"EQUIPAMENTOS AVÍCOLAS", title:"Prepare o espaço. Cuide melhor das aves.", text:"Comedouros, bebedouros, aquecimento e materiais essenciais para uma criação mais organizada.", action:"Ver equipamentos", href:"#explorar", image:"https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=2200&q=85", tone:"equipment" }
];

const areas = [
  ["01", "Pintos e lotes", "Broilers, SASSO, poedeiras e outros pintos disponíveis por lote.", "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80", "Ver disponibilidade"],
  ["02", "Rações e alimentação", "Rações para arranque, crescimento, acabamento e postura.", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80", "Explorar rações"],
  ["03", "Saúde avícola", "Vitaminas, suplementos e soluções para o maneio das aves.", "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=80", "Ver soluções"],
  ["04", "Equipamentos", "Comedouros, bebedouros, aquecimento e material de criação.", "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=900&q=80", "Ver equipamentos"],
  ["05", "Kits de criação", "Soluções organizadas para quem vai começar ou aumentar a produção.", "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80", "Conhecer kits"],
  ["06", "Entregas e levantamento", "Combine a forma mais conveniente de receber a sua encomenda.", "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80", "Consultar entregas"]
];
const lots = [["Broiler","Pinto de corte","14 Nov","2.500","55 MT"],["SASSO","Pinto rústico","21 Nov","1.200","65 MT"],["Poedeira","Pinto para postura","28 Nov","800","70 MT"]];

export default function Home() {
  const [active,setActive] = useState(0);\n  const [searchText,setSearchText] = useState("");\n  const [appliedSearch,setAppliedSearch] = useState("");\n  const filteredAreas = useMemo(() => areas.filter(([,title,description]) => (title+" "+description).toLocaleLowerCase().includes(appliedSearch.toLocaleLowerCase())), [appliedSearch]);\n  const runSearch = () => { setAppliedSearch(searchText.trim()); document.getElementById("explorar")?.scrollIntoView({behavior:"smooth"}); };
  useEffect(() => { const timer = window.setInterval(() => setActive(v => (v+1)%slides.length), 6500); return () => window.clearInterval(timer); }, []);
  const slide = slides[active];
  return <div className="site">
    <header className="site-header"><div className="container nav">
      <a className="brand" href="#"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></a>
      <nav><a href="#explorar">Produtos</a><a href="#pintos">Pintos</a><a href="#solucoes">Soluções</a><a href="#empresa">A empresa</a></nav>
      <a className="header-link" href="#contacto">Falar connosco <ArrowRight size={15}/></a>
    </div></header>

    <main>
      <section className="billboard" aria-label="Produtos em destaque">
        {slides.map((item,i)=><div key={item.tag} className={i===active?"billboard-slide active":"billboard-slide"} style={{backgroundImage:"linear-gradient(90deg,rgba(5,30,19,.88) 0%,rgba(5,30,19,.69) 43%,rgba(5,30,19,.12) 100%),url("+item.image+")"}} aria-hidden={i!==active}/>)}
        <div className="billboard-content container">
          <div className="billboard-copy" key={slide.tag}>
            <span className="billboard-kicker"><i/> {slide.tag}</span>
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>
            <div className="billboard-actions"><a className="billboard-cta" href={slide.href}>{slide.action} <ArrowRight size={17}/></a><a className="billboard-secondary" href="#explorar">Conhecer o PintoExpress</a></div>
          </div>
          <div className="billboard-bottom"><span>O BALCÃO AVÍCOLA DE MOÇAMBIQUE</span><div className="slide-controls">
            <button aria-label="Slide anterior" onClick={()=>setActive((active+slides.length-1)%slides.length)}><ArrowLeft size={17}/></button>
            {slides.map((s,i)=><button key={s.tag} aria-label={"Ver slide "+(i+1)} className={i===active?"slide-dot current":"slide-dot"} onClick={()=>setActive(i)}><span/></button>)}
            <button aria-label="Próximo slide" onClick={()=>setActive((active+1)%slides.length)}><ArrowRight size={17}/></button>
          </div></div>
        </div>
      </section>

      <section className="search-section">
        <div className="container search-inner">
          <div className="search-title"><span className="eyebrow">Encontre no nosso balcão</span><h2>O que procura hoje?</h2></div>
          <div className="search-main"><Search size={21}/><input aria-label="Pesquisar produtos" value={searchText} onChange={e=>setSearchText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")runSearch();}} placeholder="Pesquise por produto, raça, lote ou necessidade..."/><button onClick={runSearch}>Pesquisar</button></div>
          <div className="search-shortcuts"><span>Mais procurados:</span><a href="#pintos">Pintos de corte</a><a href="#explorar">Rações</a><a href="#explorar">Vitaminas</a><a href="#explorar">Comedouros e bebedouros</a><span className="search-location"><MapPin size={14}/> Moçambique</span></div>
        </div>
      </section>

      <section id="explorar" className="container section">
        <div className="section-heading"><div><span className="eyebrow">O mercado avícola</span><h2>Explore os nossos produtos e serviços</h2><p>Tudo o que precisa para iniciar, manter ou ampliar a sua produção.</p></div><a href="#contacto">Ver catálogo <ArrowRight size={16}/></a></div>
        {appliedSearch && <div className="search-result-note">Resultados para <strong>“{appliedSearch}”</strong> <button onClick={()=>{setAppliedSearch("");setSearchText("");}}>Limpar pesquisa</button></div>}
        <div className="area-grid">{filteredAreas.map(([num,title,text,image,action])=><a className="area-card" href={title==="Pintos e lotes"?"#pintos":"#contacto"} key={title}>
          <div className="area-image" style={{backgroundImage:"linear-gradient(180deg,rgba(8,39,25,.02),rgba(8,39,25,.56)),url("+image+")"}}><span className="area-num">{num}</span><span className="area-image-action">{action} <ArrowRight size={15}/></span></div>
          <div className="area-card-copy"><h3>{title}</h3><p>{text}</p><span className="area-card-link">Explorar <ArrowRight size={15}/></span></div>
        </a>)}</div>
        {filteredAreas.length===0 && <div className="no-results">Não encontrámos uma categoria correspondente. Experimente “pintos”, “ração” ou “equipamentos”, ou fale connosco.</div>}
      </section>

      <section className="container section process-section"><div className="section-heading"><div><span className="eyebrow">Como funciona</span><h2>Comprar ficou mais simples.</h2></div></div><div className="process-grid">
        <div><span>01</span><h3>Encontrar</h3><p>Pesquise por produto, raça, lote ou necessidade.</p></div><div><span>02</span><h3>Escolher</h3><p>Consulte disponibilidade, quantidade e condições.</p></div><div><span>03</span><h3>Fazer negócio</h3><p>Reserve, pague por M-Pesa ou fale com a nossa equipa.</p></div>
      </div></section>

      <section id="pintos" className="container section"><div className="section-heading"><div><span className="eyebrow">Disponibilidade</span><h2>Próximos lotes de pintos</h2><p>Consulte as próximas datas e reserve com antecedência.</p></div><a href="#contacto">Consultar todos os lotes <ArrowRight size={16}/></a></div>
        <div className="lots-list">{lots.map(([breed,label,date,available,price],i)=><article className={i===0?"lot-row featured":"lot-row"} key={breed}><div className="lot-symbol"><ShoppingBasket size={22}/></div><div className="lot-main"><span>{label}</span><h3>{breed}</h3></div><div className="lot-data"><small>Disponibilidade</small><strong><CalendarDays size={15}/>{date}</strong></div><div className="lot-data"><small>Disponíveis</small><strong>{available}</strong></div><div className="lot-price"><small>Desde</small><strong>{price}<b> / unidade</b></strong></div><a className="lot-action" href="#contacto">Reservar <ArrowRight size={15}/></a></article>)}</div>
      </section>

      <section id="solucoes" className="container section"><div className="solution-panel"><div className="solution-copy"><span className="eyebrow">Para quem quer produzir</span><h2>Não sabe por onde começar?</h2><p>Diga-nos quantas aves pretende criar e para que finalidade. A nossa equipa ajuda a montar uma solução com pintos, alimentação e os principais materiais.</p><a className="primary-btn" href="#contacto">Montar a minha criação <ArrowRight size={16}/></a></div><div className="quantity-box"><span>Quero criar</span><div><a href="#contacto"><strong>50</strong><small>aves</small></a><a className="selected" href="#contacto"><strong>100</strong><small>aves</small></a><a href="#contacto"><strong>500</strong><small>aves</small></a><a href="#contacto"><strong>1.000</strong><small>aves</small></a></div></div></div></section>

      <section id="empresa" className="container section"><div className="split-section"><div className="split-copy"><span className="eyebrow">Presença avícola</span><h2>Um balcão próximo, agora também digital.</h2><p>O PintoExpress combina a confiança de uma operação física com uma forma mais simples de descobrir, reservar e comprar produtos para avicultura.</p><div className="trust-list"><span><CheckCircle2 size={17}/> Empresa identificada</span><span><Wheat size={17}/> Produtos para criação</span><span><Truck size={17}/> Levantamento ou entrega</span></div></div><div className="presence-card"><span className="eyebrow">Quem está aqui</span><h3>Produtores, criadores e compradores.</h3><p>Para quem começa pequeno e para quem precisa de abastecimento regular.</p><a href="#contacto">Falar com a equipa <ArrowRight size={15}/></a></div></div></section>

      <section id="contacto" className="container section last"><div className="contact-panel"><div><span className="eyebrow light">ATENDIMENTO</span><h2>Tem uma necessidade específica?</h2><p>Envie-nos o que procura. Podemos ajudar a encontrar o produto, lote ou solução adequada.</p></div><a className="primary-btn" href="#"><MessageCircle size={17}/> Falar pelo WhatsApp</a></div></section>
    </main>
    <footer><div className="container footer-inner"><a className="brand" href="#"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></a><div><a href="#explorar">Produtos</a><a href="#pintos">Pintos</a><a href="#solucoes">Soluções</a><a href="#empresa">A empresa</a></div><small>© 2026 PintoExpress · Moçambique</small></div></footer>
  </div>;
}
