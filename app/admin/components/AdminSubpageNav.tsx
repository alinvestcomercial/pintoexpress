"use client";

import Link from "next/link";
import {ArrowLeft,ChevronRight} from "lucide-react";

export default function AdminSubpageNav({title}:{title:string}){
  return <nav className="admin-subpage-nav" aria-label="Navegação da página">
    <Link href="/admin"><ArrowLeft size={15}/> Voltar ao painel</Link>
    <ChevronRight size={14} aria-hidden="true"/>
    <span aria-current="page">{title}</span>
  </nav>;
}
