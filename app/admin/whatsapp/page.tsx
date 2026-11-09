"use client";
import {FormEvent,useEffect,useState} from "react";
import {Check,MessageCircle,Save} from "lucide-react";
import AdminHeader from "../components/AdminHeader";

type Template={id:string;template_key:string;name:string;description:string|null;message:string;active:boolean};
export default function WhatsAppTemplates(){
 const [items,setItems]=useState<Template[]>([]);const [busy,setBusy]=useState(true);const [saving,setSaving]=useState<string|null>(null);const [notice,setNotice]=useState("");
 useEffect(()=>{fetch("/api/admin/whatsapp-templates").then(r=>r.json()).then(d=>setItems(d.templates||[])).finally(()=>setBusy(false))},[]);
 async function save(e:FormEvent,item:Template){e.preventDefault();setSaving(item.id);setNotice("");const r=await fetch("/api/admin/whatsapp-templates",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(item)});const d=await r.json();if(r.ok){setItems(x=>x.map(v=>v.id===item.id?d.template:v));setNotice("Template guardado.");}else setNotice(d.error||"Não foi possível guardar.");setSaving(null)}
 return <main className="admin-shell"><AdminHeader active="messages" name="Equipa" role=""/><section className="admin-content">
  <div className="admin-pagebar"><div className="admin-pagebar-copy"><span className="eyebrow">COMUNICAÇÃO</span><h1>Mensagens WhatsApp</h1><p>Configure os textos padrão usados pela equipa. Os campos entre chaves são variáveis preenchidas pelo sistema.</p></div><div className="admin-page-actions"><a className="admin-secondary-action" href="https://wa.me/258842553641"><MessageCircle size={15}/> Abrir WhatsApp</a></div></div>
  {notice&&<div className="admin-notice" role="status"><Check size={15}/>{notice}</div>}
  {busy?<p>A carregar templates...</p>:<div className="admin-template-grid">{items.map(item=><form className="admin-template-card" key={item.id} onSubmit={e=>save(e,item)}><div><span className="admin-template-key">{item.template_key}</span><h2>{item.name}</h2><p>{item.description}</p></div><label>Mensagem<textarea value={item.message} onChange={e=>setItems(x=>x.map(v=>v.id===item.id?{...v,message:e.target.value}:v))} rows={5}/></label><div className="admin-template-foot"><label className="admin-check"><input type="checkbox" checked={item.active} onChange={e=>setItems(x=>x.map(v=>v.id===item.id?{...v,active:e.target.checked}:v))}/> Ativo</label><button type="submit" disabled={saving===item.id}><Save size={15}/>{saving===item.id?"A guardar...":"Guardar"}</button></div></form>)}</div>}
 </section></main>;
}