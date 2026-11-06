"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight, CalendarDays, CheckCircle2, MapPin, Menu, MessageCircle,
  Search, ShoppingBasket, Truck, Wheat, X, Egg, HeartPulse, ClipboardList,
  Plus, Minus, Trash2, Send, Copy, Package, Phone, UserRound, MapPinned
} from "lucide-react";

const products = [
  { id:"broiler", category:"Pintos", name:"Pintos de corte (Broiler)", description:"Para produção de carne. Consulte os próximos ciclos e quantidades mínimas.", image:"https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85", keywords:"broiler corte pintos frango carne" },
  { id:"sasso", category:"Pintos", name:"Pintos SASSO", description:"Aves rústicas para sistemas de criação diversificados. Consulte disponibilidade.", image:"https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?auto=format&fit=crop&w=900&q=85", keywords:"sasso rústico rustico pintos" },
  { id:"layers", category:"Pintos", name:"Pintos de poedeira", description:"Para projectos de produção de ovos. Consulte linhagens e calendário.", image:"https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=85", keywords:"poedeira ovos postura galinhas" },
  { id:"starter", category:"Nutrição", name:"Ração de iniciação", description:"Alimentação para a fase inicial. Peça orientação sobre a formulação adequada.", image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85", keywords:"ração racao starter arranque inicial" },
  { id:"grower", category:"Nutrição", name:"Ração de crescimento", description:"Soluções de alimentação para a fase de crescimento das aves.", image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=85", keywords:"ração racao crescimento grower" },
  { id:"feeders", category:"Equipamentos", name:"Comedouros e bebedouros", description:"Equipamentos para alimentação e abeberamento de aves.", image:"https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=900&q=85", keywords:"comedouro bebedouro equipamento" },
  { id:"health", category:"Saúde", name:"Vitaminas e suplementos", description:"Produtos de apoio nutricional e bem-estar. Consulte a equipa antes de utilizar.", image:"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=85", keywords:"vitaminas suplementos saúde saude" },
  { id:"brooding", category:"Equipamentos", name:"Material de aquecimento", description:"Equipamentos e acessórios para o maneio inicial dos pintos.", image:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=85", keywords:"aquecimento criadeira campânula" },
];

const categories = [
  { number:"01", title:"Pintos de um dia", description:"Pintos de corte, SASSO e poedeiras. Consulte os próximos lotes.", image:products[0].image, tags:"pintos corte broiler sasso poedeiras lotes", filter:"Pintos" },
  { number:"02", title:"Rações e nutrição", description:"Alimentação para arranque, crescimento e postura.", image:products[3].image, tags:"ração racoes alimentação nutricao", filter:"Nutrição" },
  { number:"03", title:"Saúde avícola", description:"Vitaminas e suplementos para o cuidado das aves.", image:products[6].image, tags:"saude saúde vitaminas suplementos", filter:"Saúde" },
  { number:"04", title:"Equipamentos", description:"Comedouros, bebedouros e material de criação.", image:products[5].image, tags:"equipamentos comedouros bebedouros", filter:"Equipamentos" },
  { number:"05", title:"Kits de criação", description:"Peça uma proposta de conjunto adequado ao seu projecto.", image:products[7].image, tags:"kits criação criacao produção", filter:"Equipamentos" },
  { number:"06", title:"Entrega e levantamento", description:"Consulte as opções disponíveis para a sua localização.", image:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=85", tags:"entrega levantamento transporte recolha", filter:"" },
];

const highlights = [
  { icon:Egg, title:"Consultar pintos", text:"Veja tipos de aves, calendário e condições de fornecimento.", href:"#catalogo", action:"Ver pintos", filter:"Pintos" },
  { icon:Wheat, title:"Encontrar alimentação", text:"Escolha soluções adequadas a cada fase de criação.", href:"#catalogo", action:"Ver rações", filter:"Nutrição" },
  { icon:ClipboardList, title:"Preparar uma criação", text:"Organize os produtos e equipamentos de que precisa.", href:"#solucoes", action:"Começar", filter:"" },
];

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

type CartItem = { id:string; quantity:number };

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState("100");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [delivery, setDelivery] = useState("A combinar");
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);

  const visibleProducts = useMemo(() => products.filter(item => {
    const matchesText = (item.name + " " + item.description + " " + item.keywords).toLocaleLowerCase().includes(query.toLocaleLowerCase());
    const matchesCategory = activeCategory === "Todos" || item.category === activeCategory;
    return matchesText && matchesCategory;
  }), [query, activeCategory]);

  const cartItems = cart.map(entry => ({ ...entry, product: products.find(item => item.id === entry.id)! }));
  const totalItems = cart.reduce((sum,item) => sum + item.quantity, 0);

  const addToCart = (id:string) => {
    setCart(current => current.some(item => item.id === id)
      ? current.map(item => item.id === id ? {...item,quantity:item.quantity+1} : item)
      : [...current,{id,quantity:1}]);
    setFeedback("");
  };
  const changeQuantity = (id:string, delta:number) => setCart(current => current.map(item => item.id === id ? {...item,quantity:Math.max(1,item.quantity+delta)} : item));
  const removeItem = (id:string) => setCart(current => current.filter(item => item.id !== id));
  const applyCategory = (category:string) => {
    setActiveCategory(category || "Todos");
    setQuery("");
    setSearchText("");
    document.getElementById("catalogo")?.scrollIntoView({behavior:"smooth"});
  };
  const search = () => {
    setQuery(searchText.trim());
    setActiveCategory("Todos");
    document.getElementById("catalogo")?.scrollIntoView({behavior:"smooth"});
  };
  const buildMessage = () => [
    "Olá, PintoExpress. Gostaria de solicitar uma cotação/encomenda.",
    "",
    "CLIENTE",
    "Nome: " + customerName.trim(),
    "Telefone: " + customerPhone.trim(),
    "Localização: " + (customerLocation.trim() || "A indicar"),
    "Preferência: " + delivery,
    "",
    "PRODUTOS / QUANTIDADES",
    ...cartItems.map(item => "- " + item.product.name + " — " + item.quantity + " unidade(s)"),
    "",
    "Dimensão de criação indicada: " + quantity + " aves",
    "Observações: " + (customerNote.trim() || "Sem observações"),
    "",
    "Pedido sujeito a confirmação de disponibilidade, preço e condições pela equipa."
  ].join("\n");

  const submitRequest = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) { setFeedback("Adicione pelo menos um produto à sua consulta."); return; }
    const message = buildMessage();
    if (whatsappNumber) {
      const number = whatsappNumber.replace(/[^0-9]/g,"");
      window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
      setFeedback("O pedido foi preparado. Envie a mensagem no WhatsApp para a equipa confirmar os detalhes.");
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setFeedback("Pedido preparado e copiado. Configure o contacto WhatsApp oficial ou cole esta mensagem no seu canal de atendimento.");
    } catch {
      setFeedback("Pedido preparado. Copie os dados do formulário e envie à equipa PintoExpress.");
    }
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
            <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a>
            <a href="#categorias" onClick={() => setMenuOpen(false)}>Categorias</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como comprar</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contactos</a>
          </nav>
          <div className="nav-actions">
            <a className="nav-login" href="#contacto">Atendimento</a>
            <a className="nav-cta" href="#catalogo">Explorar balcão <ArrowRight size={15}/></a>
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
              <p>Pintos, rações, saúde e equipamentos num só lugar. Descubra soluções, prepare o seu pedido e confirme as condições directamente com a nossa equipa.</p>
              <div className="billboard-actions">
                <a className="billboard-cta" href="#catalogo">Explorar catálogo <ArrowRight size={17}/></a>
                <a className="billboard-secondary" href="#pedido">Preparar pedido</a>
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
              <input aria-label="Produto, raça ou necessidade" value={searchText} onChange={event => setSearchText(event.target.value)} onKeyDown={event => { if (event.key === "Enter") search(); }} placeholder="Produto, raça, ração ou equipamento..."/>
              <button onClick={search}>Pesquisar <ArrowRight size={15}/></button>
            </div>
            <div className="search-shortcuts"><span>Comece por:</span><button onClick={() => applyCategory("Pintos")}>Pintos</button><button onClick={() => applyCategory("Nutrição")}>Rações</button><button onClick={() => applyCategory("Saúde")}>Saúde avícola</button><button onClick={() => applyCategory("Equipamentos")}>Equipamentos</button><span className="search-location"><MapPin size={14}/> Moçambique</span></div>
          </div>
        </section>

        <section className="container section quick-section">
          <div className="section-heading"><div><span className="eyebrow">Comece por aqui</span><h2>Uma necessidade. A solução certa.</h2><p>Aceda directamente ao que precisa no nosso balcão.</p></div><a href="#categorias">Ver categorias <ArrowRight size={16}/></a></div>
          <div className="highlight-grid">{highlights.map(({icon:Icon,title,text,href,action,filter}) => <a className="highlight-card" href={href} key={title} onClick={() => filter && applyCategory(filter)}><span className="highlight-icon"><Icon size={23}/></span><span className="highlight-copy"><strong>{title}</strong><small>{text}</small><b>{action} <ArrowRight size={15}/></b></span></a>)}</div>
        </section>

        <section id="categorias" className="container section">
          <div className="section-heading"><div><span className="eyebrow">Explore o balcão</span><h2>Procure por categoria.</h2><p>Escolha uma área e descubra soluções para a sua actividade.</p></div><a href="#catalogo">Ver catálogo completo <ArrowRight size={16}/></a></div>
          <div className="area-grid">{categories.map(item => <button className="area-card area-card-button" key={item.number} onClick={() => applyCategory(item.filter)}>
            <span className="area-image" style={{backgroundImage:"linear-gradient(180deg,rgba(8,39,25,.02),rgba(8,39,25,.52)),url("+item.image+")"}}><span className="area-num">{item.number}</span><span className="area-image-action">Explorar <ArrowRight size={15}/></span></span>
            <span className="area-card-copy"><strong>{item.title}</strong><span>{item.description}</span><b className="area-card-link">Ver produtos e soluções <ArrowRight size={15}/></b></span>
          </button>)}</div>
        </section>

        <section id="catalogo" className="container section">
          <div className="section-heading"><div><span className="eyebrow">Vitrine comercial</span><h2>Catálogo de produtos.</h2><p>Adicione produtos à consulta e envie o seu pedido à equipa.</p></div><a href="#pedido">Ver consulta ({totalItems}) <ShoppingBasket size={16}/></a></div>
          <div className="catalog-toolbar">
            <div className="catalog-filters">{["Todos","Pintos","Nutrição","Saúde","Equipamentos"].map(category => <button key={category} className={activeCategory===category?"active":""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
            {query && <button className="clear-filter" onClick={() => {setQuery("");setSearchText("");}}>Limpar pesquisa “{query}” <X size={14}/></button>}
          </div>
          <div className="product-grid">{visibleProducts.map(item => {
            const inCart = cart.find(entry => entry.id === item.id);
            return <article className="product-card" key={item.id}>
              <div className="product-image" style={{backgroundImage:"url("+item.image+")"}}><span>{item.category}</span></div>
              <div className="product-card-body"><h3>{item.name}</h3><p>{item.description}</p><div className="product-card-footer"><span className="quote-label">Preço e stock sob consulta</span><button onClick={() => addToCart(item.id)}>{inCart ? <CheckCircle2 size={15}/> : <Plus size={15}/>} {inCart ? "Adicionar mais" : "Adicionar"}</button></div></div>
            </article>;
          })}</div>
          {!visibleProducts.length && <div className="no-results">Não encontrámos produtos para esta pesquisa. Altere os filtros ou peça ajuda à equipa.</div>}
        </section>

        <section id="como-funciona" className="container section">
          <div className="section-heading"><div><span className="eyebrow">Da pesquisa ao atendimento</span><h2>Como funciona o balcão?</h2><p>Um processo simples, com confirmação humana antes de fechar a compra.</p></div></div>
          <div className="steps-grid">
            <article><span>01</span><Search size={22}/><h3>Descubra</h3><p>Pesquise produtos e escolha o que pretende consultar.</p></article>
            <article><span>02</span><ShoppingBasket size={22}/><h3>Prepare o pedido</h3><p>Indique quantidades, localização e preferência de entrega.</p></article>
            <article><span>03</span><MessageCircle size={22}/><h3>Confirme com a equipa</h3><p>Receba confirmação de stock, preço, pagamento e entrega.</p></article>
          </div>
          <div className="audience-grid">
            <article className="audience-card buyer-card"><span className="audience-label">CRIADOR / COMPRADOR</span><h3>Quero comprar para a minha criação.</h3><p>Encontre pintos, alimentação e materiais. Prepare uma consulta e confirme os detalhes com a equipa.</p><div><a href="#catalogo">Consultar produtos <ArrowRight size={15}/></a><a href="#pedido">Preparar pedido</a></div></article>
            <article className="audience-card producer-card"><span className="audience-label">PRODUTOR / REVENDEDOR</span><h3>Quero abastecer ou crescer.</h3><p>Partilhe as suas necessidades de quantidade e frequência. Ajudamos a identificar soluções e condições de fornecimento.</p><div><a href="#pedido">Pedir orientação <ArrowRight size={15}/></a><a href="#solucoes">Planear fornecimento</a></div></article>
          </div>
        </section>

        <section id="solucoes" className="container section">
          <div className="solution-panel"><div className="solution-copy"><span className="eyebrow light">Planeie a sua criação</span><h2>Quantas aves pretende criar?</h2><p>Escolha uma dimensão aproximada. Incluiremos esta informação no seu pedido para ajudar a equipa a preparar uma proposta.</p><a className="primary-btn" href="#pedido">Pedir orientação <ArrowRight size={16}/></a></div><div className="quantity-box"><span>Dimensão da criação</span><div>{["50","100","500","1.000"].map(value=><button type="button" className={quantity===value?"selected":""} onClick={() => setQuantity(value)} key={value}><strong>{value}</strong><small>aves</small></button>)}</div><p>Selecção actual: <strong>{quantity} aves</strong></p></div></div>
        </section>

        <section id="pedido" className="container section">
          <div className="section-heading"><div><span className="eyebrow">A sua consulta</span><h2>Prepare o seu pedido.</h2><p>Preencha os seus dados. A equipa confirmará disponibilidade, preço e condições.</p></div><span className="cart-count"><ShoppingBasket size={17}/> {totalItems} unidade(s) seleccionada(s)</span></div>
          <div className="order-layout">
            <div className="cart-panel">
              <div className="panel-heading"><div><Package size={19}/><strong>Produtos seleccionados</strong></div><span>{cart.length} referência(s)</span></div>
              {!cartItems.length ? <div className="empty-cart"><ShoppingBasket size={28}/><strong>A sua consulta ainda está vazia.</strong><p>Explore o catálogo e adicione os produtos que pretende consultar.</p><a href="#catalogo">Explorar catálogo <ArrowRight size={15}/></a></div> :
                <div className="cart-lines">{cartItems.map(item => <div className="cart-line" key={item.id}><div className="cart-line-image" style={{backgroundImage:"url("+item.product.image+")"}}/><div className="cart-line-info"><strong>{item.product.name}</strong><small>{item.product.category} · preço sob consulta</small><div className="quantity-control"><button aria-label="Diminuir quantidade" onClick={() => changeQuantity(item.id,-1)}><Minus size={13}/></button><b>{item.quantity}</b><button aria-label="Aumentar quantidade" onClick={() => changeQuantity(item.id,1)}><Plus size={13}/></button></div></div><button className="remove-item" aria-label={"Remover "+item.product.name} onClick={() => removeItem(item.id)}><Trash2 size={16}/></button></div>)}</div>}
              <div className="cart-note"><CheckCircle2 size={16}/> Não há cobrança nesta etapa. O preço e a disponibilidade serão confirmados pela equipa.</div>
            </div>
            <form className="request-form" onSubmit={submitRequest}>
              <div className="panel-heading"><div><Send size={18}/><strong>Dados para atendimento</strong></div><span>Pedido sem compromisso</span></div>
              <label><span><UserRound size={14}/> Nome completo *</span><input required value={customerName} onChange={event=>setCustomerName(event.target.value)} placeholder="Como se chama?"/></label>
              <label><span><Phone size={14}/> Telefone / WhatsApp *</span><input required type="tel" value={customerPhone} onChange={event=>setCustomerPhone(event.target.value)} placeholder="+258 8x xxx xxxx"/></label>
              <label><span><MapPinned size={14}/> Província / Localidade</span><input value={customerLocation} onChange={event=>setCustomerLocation(event.target.value)} placeholder="Ex.: Maputo, Matola"/></label>
              <label><span><Truck size={14}/> Preferência de recepção</span><select value={delivery} onChange={event=>setDelivery(event.target.value)}><option>A combinar</option><option>Levantamento</option><option>Entrega (consultar condições)</option></select></label>
              <label><span>Observações adicionais</span><textarea rows={3} value={customerNote} onChange={event=>setCustomerNote(event.target.value)} placeholder="Data pretendida, frequência, tipo de criação ou outras informações..."/></label>
              <button className="submit-request" type="submit"><MessageCircle size={17}/> Preparar pedido <ArrowRight size={16}/></button>
              {feedback && <div className="request-feedback" role="status">{feedback}{!whatsappNumber && copied ? <span> Configure NEXT_PUBLIC_WHATSAPP_NUMBER para encaminhamento directo.</span> : null}</div>}
              <small className="privacy-note">Ao enviar, autoriza a equipa PintoExpress a utilizar estes dados apenas para responder ao seu pedido. Não introduza dados de pagamento neste formulário.</small>
            </form>
          </div>
        </section>

        <section className="container section">
          <div className="trust-strip"><div className="trust-icon"><CheckCircle2 size={25}/></div><div><strong>Um balcão próximo, agora também digital.</strong><p>Consulte produtos, prepare pedidos e receba confirmação humana das condições antes de efectuar qualquer pagamento.</p></div><div className="trust-benefits"><span><Wheat size={17}/> Produtos avícolas</span><span><Truck size={17}/> Entrega ou levantamento</span><span><HeartPulse size={17}/> Apoio ao criador</span></div></div>
        </section>

        <section id="contacto" className="container section last"><div className="contact-panel"><div><span className="eyebrow light">ATENDIMENTO PINTOEXPRESS</span><h2>Precisa de ajuda para escolher?</h2><p>Prepare uma consulta no balcão ou contacte a equipa para orientação sobre produtos, lotes e fornecimento.</p></div><a className="primary-btn" href="#pedido"><MessageCircle size={17}/> Fazer uma consulta</a></div></section>
      </main>
      <footer><div className="container footer-inner"><a className="brand" href="#"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></a><div><a href="#catalogo">Catálogo</a><a href="#categorias">Categorias</a><a href="#pedido">Pedidos</a><a href="#contacto">Contactos</a></div><small>© 2026 PintoExpress · Moçambique</small></div></footer>
    </div>
  );
}
