"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
type Item={id:string;name:string;category:string;quantity:number};
type CartApi={items:Item[];add:(item:Omit<Item,"quantity">)=>void;setQty:(id:string,q:number)=>void;remove:(id:string)=>void;clear:()=>void};
const CartContext=createContext<CartApi|null>(null);
export function CartProvider({children}:{children:React.ReactNode}){const [items,setItems]=useState<Item[]>([]);const [ready,setReady]=useState(false);useEffect(()=>{try{const raw=localStorage.getItem("pintoexpress-cart");if(raw)setItems(JSON.parse(raw));}catch{}setReady(true);},[]);useEffect(()=>{if(ready)localStorage.setItem("pintoexpress-cart",JSON.stringify(items));},[items,ready]);const api=useMemo<CartApi>(()=>({items,add:item=>setItems(old=>old.some(x=>x.id===item.id)?old.map(x=>x.id===item.id?{...x,quantity:x.quantity+1}:x):[...old,{...item,quantity:1}]),setQty:(id,q)=>setItems(old=>old.map(x=>x.id===id?{...x,quantity:Math.max(1,q)}:x)),remove:id=>setItems(old=>old.filter(x=>x.id!==id)),clear:()=>setItems([])}),[items]);return <CartContext.Provider value={api}>{children}</CartContext.Provider>}
export function useCart(){const value=useContext(CartContext);if(!value)throw new Error("useCart must be used inside CartProvider");return value}
