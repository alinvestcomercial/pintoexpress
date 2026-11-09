"use client";
import {FormEvent,useState} from "react";
import Link from "next/link";
import {ShieldCheck,ArrowRight} from "lucide-react";
export default function FirstAccess(){
 const [name,setName]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [msg,setMsg]=useState("");const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMsg("");
  try{const r=await fetch("/api/admin/bootstrap",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Não foi possível configurar.");setMsg(d.message||"Super Admin configurado. Pode entrar.");}
  catch(e){setMsg(e instanceof Error?e.message:"Não foi possível configurar.");}finally{setBusy(false);}
 }
 return <main className="admin-auth"><div className="admin-auth-card"><div className="admin-logo"><ShieldCheck/></div><span className="eyebrow">CONFIGURAÇÃO INICIAL</span><h1>Super Admin</h1><p>Use esta opção apenas para o primeiro acesso da plataforma. Depois disso, o cadastro fica fechado.</p><form onSubmit={submit}><label>Nome completo<input required value={name} onChange={e=>setName(e.target.value)}/></label><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Palavra-passe<input minLength={8} type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy}>{busy?"A configurar...":"Criar Super Admin"} <ArrowRight size={16}/></button></form>{msg&&<div className="admin-message">{msg}</div>}<Link href="/admin/login">Já tenho acesso</Link><Link href="/">Voltar ao site</Link></div></main>;
}