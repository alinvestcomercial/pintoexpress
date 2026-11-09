"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";

export default function AdminLogin(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e:FormEvent){
    e.preventDefault(); setBusy(true); setError("");
    try{
      const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||"Não foi possível entrar.");
      window.location.href="/admin";
    }catch(e){
      setError(e instanceof Error?e.message:"Não foi possível entrar.");
    }finally{setBusy(false);}
  }

  return <main className="admin-auth">
    <div className="admin-auth-layout">
      <section className="admin-auth-intro">
        <Link href="/" className="admin-site-brand"><span className="brand-mark">P</span><span><strong>PintoExpress</strong><small>AVICULTURA · MOÇAMBIQUE</small></span></Link>
        <span className="eyebrow">ÁREA DA EQUIPA</span>
        <h1>O balcão interno do PintoExpress.</h1>
        <p>Gestão de encomendas, pagamentos, logística e atendimento num único espaço de operação.</p>
        <div className="admin-auth-links">
          <Link href="/"><ArrowLeft size={15}/> Voltar ao site</Link>
          <a href="https://wa.me/258842553641"><MessageCircle size={15}/> Falar com a equipa</a>
        </div>
      </section>
      <section className="admin-auth-card">
        <div className="admin-logo"><ShieldCheck/></div>
        <div><span className="eyebrow">ACESSO RESTRITO</span><h2>Entrar na área interna</h2><p>Use as credenciais atribuídas pela administração.</p></div>
        <form onSubmit={submit}>
          <label>Email<input autoComplete="username" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
          <label>Palavra-passe<input autoComplete="current-password" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
          <button disabled={busy}>{busy?"A validar acesso...":"Entrar"} <ArrowRight size={16}/></button>
          {error&&<div role="alert" className="admin-error">{error}</div>}
        </form>
        <div className="admin-auth-note"><LockKeyhole size={15}/><span>Área exclusiva para utilizadores internos autorizados.</span></div>
      </section>
    </div>
  </main>