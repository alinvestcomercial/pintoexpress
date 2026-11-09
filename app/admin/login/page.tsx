"use client";
import Link from "next/link";
import {FormEvent,useState} from "react";
import {ShieldCheck,ArrowRight} from "lucide-react";
export default function AdminLogin(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");
  try{const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Não foi possível entrar.");location.href="/admin";}
  catch(e){setError(e instanceof Error?e.message:"Não foi possível entrar.");}finally{setBusy(false);}
 }
 return <main className="admin-auth"><div className="admin-auth-card"><div className="admin-logo"><ShieldCheck/></div><span className="eyebrow">ÁREA RESERVADA</span><h1>Acesso da equipa</h1><p>Área interna PintoExpress para gestão comercial, encomendas e operações.</p><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Palavra-passe<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy}>{busy?"A entrar...":"Entrar"} <ArrowRight size={16}/></button>{error&&<div className="admin-error">{error}</div>}</form><Link href="/admin/primeiro-acesso">Primeiro acesso / configurar Super Admin</Link><Link href="/">Voltar ao site</Link></div></main>;
}