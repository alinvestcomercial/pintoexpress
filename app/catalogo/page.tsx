"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowDownUp, ArrowRight, Check, ChevronDown, Filter, HeartPulse, PackageSearch,
  Package, Plus, Search, ShoppingBasket, Wheat, X, Egg, Truck, ChevronLeft, ChevronRight
} from "lucide-react";
import { SiteFrame } from "../components/SiteChrome";
import { useCart } from "../components/CartProvider";

type Product = {
  id: string; name: string; category: string; description: string;
  image: string; tag?: string; popular?: boolean;
};

const products: Product[] = [
  { id:"pintos-broiler", name:"Pintos de corte (Broiler)", category:"Pintos", description:"Para produção de carne. Consulte os próximos ciclos, quantidades mínimas e calendário de fornecimento.", image:"https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=85", tag:"Mais procurado", popular:true },
  { id:"pintos-sasso", name:"Pintos SASSO", category:"Pintos", description:"Aves rústicas para sistemas de criação diversificados. Consulte a equipa sobre disponibilidade.", image:"https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?auto=format&fit=crop&w=1000&q=85", tag:"Aves rústicas" },
  { id:"pintos-poedeira", name:"Pintos de poedeira", category:"Pintos", description:"Para projectos de produção de ovos. Consulte linhagens e calendário de fornecimento.", image:"https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1000&q=85" },
  { id:"racao-iniciacao", name:"Ração de iniciação", category:"Nutrição", description:"Alimentação para a fase inicial e arranque das aves. Peça orientação sobre formulação e quantidades.", image:"https://images.unsplash.com/photo-1500382017468-9049fed74703?auto=format&fit=crop&w=1000&q=85", tag:"Fase inicial" },
  { id:"racao-crescimento", name:"Ração de crescimento", category:"Nutrição", description:"Soluções de alimentação para a fase de crescimento. Consulte as opções disponíveis.", image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=85" },
  { id:"vitaminas-suplementos", name:"Vitaminas e suplementos", category:"Saúde", description:"Produtos de apoio nutricional e bem-estar. Consulte a equipa antes de utilizar.", image:"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1000&q=85" },
  { id:"comedouros-bebedouros", name:"Comedouros e bebedouros", category:"Equipamentos", description:"Equipamentos para alimentação e abeberamento. Consulte modelos, capacidades e quantidades.", image:"https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=1000&q=85", popular:true },
  { id:"material-aquecimento", name:"Material de aquecimento", category:"Equipamentos", description:"Equipamentos e acessórios para o maneio inicial dos pintos. Consulte opções para a sua instalação.", image:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=85" }
];

const categories = [
  { name:"Todos", icon:Package, note:"Ver o catálogo completo" },
  { name:"Pintos", icon:Egg, note:"Aves para diferentes objectivos" },
  { name:"Nutrição", icon:Wheat, note:"Alimentação por fase" },
  { name:"Saúde", icon:HeartPulse, note:"Cuidado e bem-estar" },
  { name:"Equipamentos", icon:Truck, note:"Materiais para a criação" }
];

function CatalogContent() {
  const params = useSearchParams();
  const { add, items } = useCart();
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [addedId, setAddedId] = useState("");
  const q = (params.get("q") || "").trim().toLocaleLowerCase("pt");
  const category = params.get("categoria") || "Todos";
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const counts = useMemo(() => categories.reduce<Record<string,number>>((acc, c) => {
    acc[c.name] = c.name === "Todos" ? products.length : products.filter(p => p.category === c.name).length;
    return acc;
  }, {}), []);

  const filtered = useMemo(() => {
    const result = products.filter(p =>
      (category === "Todos" || p.category === category) &&
      [p.name,p.category,p.description].join(" ").toLocaleLowerCase("pt").includes(q)
    );
    if (sort === "name") result.sort((a,b) => a.name.localeCompare(b.name,"pt"));
    if (sort === "category") result.sort((a,b) => a.category.localeCompare(b.category,"pt") || a.name.localeCompare(b.name,"pt"));
    if (sort === "popular") result.sort((a,b) => Number(Boolean(b.popular))-Number(Boolean(a.popular)));
    return result;
  }, [q,category,sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => { setPage(1); }, [q, category, sort, pageSize]);

  function addProduct(product: Product) {
    add({id:product.id,name:product.name,category:product.category});
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(current => current === product.id ? "" : current), 1800);
  }

  const selectedCategory = categories.find(c => c.name === category)?.name || "Todos";

  return <SiteFrame>
    <section className="catalog-hero">
      <div className="container catalog-hero-inner">
        <div className="catalog-hero-copy">
          <div className="catalog-breadcrumb"><Link href="/">Início</Link><span>/</span><span>Catálogo</span></div>
          <span className="eyebrow light">BALCÃO COMERCIAL · PINTOEXPRESS</span>
          <h1>Encontre o que a sua criação precisa.</h1>
          <p>Explore o catálogo por categoria, pesquise um produto e reúna tudo num pedido de consulta. A nossa equipa confirma preços, stock e condições.</p>
          <div className="catalog-hero-points"><span><Check size={15}/> Produtos por categoria</span><span><Check size={15}/> Preços sob consulta</span><span><Check size={15}/> Apoio da equipa</span></div>
        </div>
        <div className="catalog-hero-art" aria-hidden="true"><div className="catalog-art-image"/><div className="catalog-art-note"><span className="catalog-art-icon"><ShoppingBasket size={18}/></span><span><strong>O seu balcão avícola</strong><small>Escolha. Reúna. Consulte.</small></span></div></div>
      </div>
    </section>

    <section className="container catalog-main">
      <div className="catalog-search-panel">
        <form className="catalog-search catalog-search-premium" action="/catalogo" role="search">
          <Search size={21}/><input name="q" defaultValue={params.get("q") || ""} aria-label="Pesquisar no catálogo" placeholder="O que procura? Ex.: pintos, ração, bebedouros..."/>
          {q && <Link className="catalog-clear-search" href={category === "Todos" ? "/catalogo" : "/catalogo?categoria="+encodeURIComponent(category)} aria-label="Limpar pesquisa"><X size={17}/></Link>}
          {category !== "Todos" && <input type="hidden" name="categoria" value={category}/>}
          <button type="submit">Pesquisar <ArrowRight size={16}/></button>
        </form>
        <div className="catalog-search-hint"><span>Pesquisas frequentes:</span><Link href="/catalogo?q=pintos">Pintos</Link><Link href="/catalogo?q=ração">Ração</Link><Link href="/catalogo?q=comedouros">Comedouros</Link></div>
      </div>

      <div className="catalog-category-heading"><div><span className="eyebrow">Explore por necessidade</span><h2>Escolha uma categoria.</h2></div><span className="catalog-category-caption">Encontre rapidamente o que procura</span></div>
      <div className="catalog-category-rail">
        {categories.map(({name,icon:Icon,note}) => <Link key={name} href={name === "Todos" ? "/catalogo" : "/catalogo?categoria="+encodeURIComponent(name)+(q?"&q="+encodeURIComponent(params.get("q")||""):"")} className={"catalog-category-tile"+(selectedCategory===name?" is-active":"")}>
          <span className="catalog-category-icon"><Icon size={21}/></span><span className="catalog-category-text"><strong>{name === "Todos" ? "Todos os produtos" : name}</strong><small>{name === "Todos" ? note : note}</small></span><span className="catalog-category-count">{counts[name]}</span>
        </Link>)}
      </div>

      <div className="catalog-results-head">
        <div><span className="eyebrow">Vitrine PintoExpress</span><h2>{q ? "Resultados da pesquisa" : selectedCategory === "Todos" ? "Produtos disponíveis para consulta" : selectedCategory}</h2><p>{filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}{q ? <> para <strong>“{params.get("q")}”</strong></> : null}. Preços e disponibilidade são confirmados no atendimento.</p></div>
        <div className="catalog-shortcuts"><Link className="catalog-orders-shortcut" href="/encomendas-entregas"><PackageSearch size={16}/> Acompanhar pedido</Link><Link className="catalog-cart-shortcut" href="/pedido"><ShoppingBasket size={17}/><span>Meu pedido</span><b>{cartCount}</b><ArrowRight size={15}/></Link></div>
      </div>

      <div className="catalog-results catalog-results-full">
        <div className="catalog-toolbar-premium">
          <span className="catalog-result-total"><strong>{filtered.length}</strong> {filtered.length===1?"produto":"produtos"}</span>
          <div className="catalog-toolbar-actions">
            <label className="catalog-sort"><ArrowDownUp size={15}/><span>Ordenar:</span><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Ordenar produtos"><option value="recommended">Recomendados</option><option value="popular">Mais procurados</option><option value="name">Nome (A–Z)</option><option value="category">Categoria</option></select><ChevronDown size={14}/></label>
            <label className="catalog-page-size"><span>Por página</span><select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))} aria-label="Produtos por página"><option value={12}>12</option><option value={24}>24</option><option value={48}>48</option></select></label>
          </div>
        </div>
        {filtered.length ? (
          <>
            <div className="catalog-product-grid">
              {visibleProducts.map((p) => (
                <article className="catalog-product-card" key={p.id}>
                  <Link href={"/produto/" + p.id} className="catalog-product-image" style={{backgroundImage:"url(" + p.image + ")"}} aria-label={"Ver detalhes de " + p.name}>
                    <span className="catalog-product-category">{p.category}</span>
                    {p.tag && <span className="catalog-product-tag">{p.tag}</span>}
                  </Link>
                  <div className="catalog-product-body">
                    <div className="catalog-product-meta">
                      <span>{p.category}</span>
                      <span className="catalog-consult-status"><i/> Sob consulta</span>
                    </div>
                    <Link href={"/produto/" + p.id} className="catalog-product-name">{p.name}</Link>
                    <p>{p.description}</p>
                    <div className="catalog-product-footer">
                      <span className="catalog-price-note">Preço e stock <strong>sob consulta</strong></span>
                      <button className={addedId===p.id ? "catalog-add-button is-added" : "catalog-add-button"} onClick={() => addProduct(p)}>
                        {addedId===p.id ? <><Check size={15}/> Adicionado</> : <><Plus size={15}/> Adicionar</>}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {pageCount > 1 && (
              <nav className="catalog-pagination" aria-label="Paginação do catálogo">
                <span className="catalog-pagination-summary">
                  A mostrar <strong>{(currentPage-1)*pageSize+1}–{Math.min(currentPage*pageSize,filtered.length)}</strong> de <strong>{filtered.length}</strong> produtos
                </span>
                <div className="catalog-pagination-controls">
                  <button type="button" onClick={() => setPage(p => Math.max(1,p-1))} disabled={currentPage===1} aria-label="Página anterior"><ChevronLeft size={17}/><span>Anterior</span></button>
                  {Array.from({length:pageCount},(_,i)=>i+1).filter(n=>n===1||n===pageCount||Math.abs(n-currentPage)<=1).map((n,i,arr) => (
                    <span className="catalog-page-number-wrap" key={n}>
                      {i>0 && n-arr[i-1]>1 ? <span className="catalog-page-dots">…</span> : null}
                      <button type="button" className={currentPage===n ? "active" : ""} onClick={() => setPage(n)} aria-label={"Página " + n} aria-current={currentPage===n ? "page" : undefined}>{n}</button>
                    </span>
                  ))}
                  <button type="button" onClick={() => setPage(p => Math.min(pageCount,p+1))} disabled={currentPage===pageCount} aria-label="Página seguinte"><span>Seguinte</span><ChevronRight size={17}/></button>
                </div>
              </nav>
            )}
          </>
        ) : (
          <div className="catalog-empty">
            <span><Search size={25}/></span>
            <h3>Não encontrámos esse produto.</h3>
            <p>Experimente outro termo ou explore uma categoria diferente.</p>
            <Link href="/catalogo">Limpar filtros <ArrowRight size={15}/></Link>
          </div>
        )}
      </div>
    </section>
  </SiteFrame>;
}

export default function CatalogPage() {
  return <Suspense fallback={<SiteFrame><div className="container catalog-loading"><span className="catalog-loading-mark"><Package size={22}/></span><strong>A preparar o catálogo...</strong><small>Estamos a organizar os produtos para si.</small></div></SiteFrame>}><CatalogContent/></Suspense>;
}
