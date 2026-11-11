"use client";
import {useEffect,useMemo,useState} from "react";
import {BarChart3,RefreshCw,TrendingUp,Package,Wallet,Users,Truck,AlertTriangle} from "lucide-react";
type ReportData={metrics:any;sales:any[];topProducts:any[];finance:any;stock:any;customers:any;operations:any};
const money=(n:number)=>Number(n||0).toLocaleString("pt-MZ",{style:"currency",currency:"MZN",minimumFractionDigits:2,maximumFractionDigits:2});
const nfmt=(n:number)=>Number(n||0).toLocaleString("pt-MZ");
const labelDate=(s:string)=>new Intl.DateTimeFormat("pt-MZ",{day:"2-digit",month:"short"}).format(new Date(s));
export default function ReportsClient(){
 const [period,setPeriod]=useState(30); const [data,setData]=useState<ReportData|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 async function load(){setLoading(true);setError("");try{const r=await fetch("/api/admin/reports?period="+period,{cache:"no-store"});const d=await r.json();if(!r.ok)throw new Error(d.error||"Não foi possível carregar os relatórios.");setData(d)}catch(e){setError(e instanceof Error?e.message:"Erro ao carregar relatórios.")}finally{setLoading(false)}}
 useEffect(()=>{load()},[period]);
 const maxSales=useMemo(()=>Math.max(1,...(data?.sales||[]).map(x=>Number(x.amount||0))),[data]);
 const cards=[["Vendas no período",money(data?.metrics?.sales_period),TrendingUp],["Encomendas",data?.metrics?.orders_period??0,BarChart3],["Recebido",money(data?.finance?.received),Wallet],["Clientes activos",data?.customers?.active??0,Users]];
 return <div className="reports-page">
  <div className="admin-pagebar reports-heading"><div className="admin-pagebar-copy"><span className="eyebrow">GESTÃO & PERFORMANCE</span><h1>Relatórios</h1><p>Leitura consolidada de vendas, financeiro, stock, clientes e operação.</p></div><div className="reports-actions"><button className="admin-secondary-action" onClick={load} disabled={loading}><RefreshCw size={15} className={loading?"reports-spin":""}/> Actualizar</button></div></div>
  {error&&<div className="reports-error"><AlertTriangle size={15}/><span>{error}</span><button onClick={load}>Tentar novamente</button></div>}
  <div className="reports-period"><span>Período</span>{[30,90,365].map(x=><button key={x} className={period===x?"active":""} onClick={()=>setPeriod(x)}>{x===365?"12 meses":x+" dias"}</button>)}</div>
  <div className="reports-kpis">{cards.map(([title,value,Icon])=><article key={title as string}><div><span>{title}</span><Icon size={15}/></div><strong>{value as any}</strong><small>{loading?"A actualizar…":"Dados reais da plataforma"}</small></article>)}</div>
  <div className="reports-grid reports-grid-main">
   <section className="reports-panel reports-sales"><header><div><span className="eyebrow">EVOLUÇÃO</span><h2>Vendas por período</h2></div><strong>{money(data?.metrics?.sales_period)}</strong></header><div className="reports-chart">{(data?.sales||[]).map((x,i)=><div className="reports-bar-wrap" key={x.date}><div className="reports-bar" style={{height:Math.max(5,Number(x.amount||0)/maxSales*100)+"%"}} title={money(x.amount)}></div><small>{i%3===0?labelDate(x.date):""}</small></div>)}</div></section>
   <section className="reports-panel"><header><div><span className="eyebrow">PRODUTOS</span><h2>Mais vendidos</h2></div><Package size={17}/></header><div className="reports-ranked">{(data?.topProducts||[]).slice(0,6).map((x,i)=><div key={x.name}><b>{String(i+1).padStart(2,"0")}</b><div><strong>{x.name}</strong><small>{nfmt(x.quantity)} unidades</small></div><span>{money(x.value)}</span></div>)}</div>{!(data?.topProducts||[]).length&&<div className="reports-empty">Ainda não existem vendas suficientes para este ranking.</div>}</section>
  </div>
  <div className="reports-grid">
   <section className="reports-panel"><header><div><span className="eyebrow">FINANCEIRO</span><h2>Recebimentos e saldo</h2></div><Wallet size={17}/></header><div className="reports-finance-grid"><div><small>Recebido</small><strong>{money(data?.finance?.received)}</strong></div><div><small>Por receber</small><strong>{money(data?.finance?.outstanding)}</strong></div><div><small>Em atraso</small><strong className="danger">{money(data?.finance?.overdue)}</strong></div></div><div className="reports-progress"><span style={{width:Math.min(100,Number(data?.finance?.collection_rate||0))+"%"}}/></div><div className="reports-progress-label"><span>Taxa de recebimento</span><b>{Number(data?.finance?.collection_rate||0).toFixed(1)}%</b></div></section>
   <section className="reports-panel"><header><div><span className="eyebrow">STOCK</span><h2>Disponibilidade</h2></div><Package size={17}/></header><div className="reports-stock"><div><small>Disponível</small><strong>{nfmt(data?.stock?.available)}</strong></div><div><small>Reservado</small><strong>{nfmt(data?.stock?.reserved)}</strong></div><div><small>Reposição</small><strong>{nfmt(data?.stock?.low_items)}</strong></div></div><div className="reports-alert-line"><AlertTriangle size={14}/><span>{data?.stock?.low_items||0} itens abaixo do nível de reposição</span></div></section>
  </div>
  <div className="reports-grid">
   <section className="reports-panel"><header><div><span className="eyebrow">CLIENTES</span><h2>Base comercial</h2></div><Users size={17}/></header><div className="reports-customer-stats"><div><strong>{nfmt(data?.customers?.active)}</strong><small>Activos</small></div><div><strong>{nfmt(data?.customers?.new_period)}</strong><small>Novos no período</small></div><div><strong>{nfmt(data?.customers?.repeat)}</strong><small>Recorrentes</small></div></div></section>
   <section className="reports-panel"><header><div><span className="eyebrow">OPERAÇÃO</span><h2>Estado das encomendas</h2></div><Truck size={17}/></header><div className="reports-status-list">{(data?.operations?.statuses||[]).map((x:any)=><div key={x.status}><span>{x.label}</span><b>{x.count}</b></div>)}</div></section>
  </div>
 </div>
}