-- Garante que todo pedido público inicia uma operação logística vinculada.
create or replace function public.create_order_request(
  p_name text,p_phone text,p_location text,p_package_slug text default null,
  p_bird_type public.bird_type default null,p_quantity integer default null,
  p_delivery text default 'A combinar',p_notes text default null
) returns table(order_id uuid,reference text,status public.order_status)
language plpgsql security definer set search_path=public
as $function$
declare v_customer_id uuid; v_package public.packages%rowtype; v_order_id uuid;
v_reference text; v_total numeric(14,2); v_fulfillment_type public.fulfillment_type;
begin
 if nullif(trim(p_name),'') is null or nullif(trim(p_phone),'') is null then raise exception 'Nome e telefone são obrigatórios'; end if;
 if p_quantity is null or p_quantity<=0 then raise exception 'Quantidade inválida'; end if;
 if p_package_slug is not null then
  select * into v_package from public.packages where slug=p_package_slug and active=true limit 1;
  if not found then raise exception 'Pacote indisponível'; end if;
  if p_bird_type is not null and v_package.bird_type<>p_bird_type then raise exception 'Linhagem incompatível com o pacote'; end if;
  v_total:=case when v_package.price is null then 0 else v_package.price*p_quantity/v_package.bird_count end;
 else v_total:=0; end if;
 select id into v_customer_id from public.customers where phone=trim(p_phone) order by created_at desc limit 1;
 if v_customer_id is null then
  insert into public.customers(full_name,phone,notes)
  values(trim(p_name),trim(p_phone),nullif(trim(coalesce(p_location,'')||case when p_location is not null and p_notes is not null then E'\n' else '' end||coalesce(p_notes,'')),''))
  returning id into v_customer_id;
 else
  update public.customers set full_name=trim(p_name),
   notes=nullif(trim(coalesce(p_location,'')||case when p_location is not null and p_notes is not null then E'\n' else '' end||coalesce(p_notes,'')),'')
   where id=v_customer_id;
 end if;
 v_reference:='PE-'||to_char(now(),'YYYYMMDD')||'-'||upper(substr(encode(gen_random_bytes(4),'hex'),1,6));
 insert into public.orders(reference,customer_id,channel,status,total_amount,payment_status,notes)
 values(v_reference,v_customer_id,'website','draft',v_total,'pending',concat('Recepção: ',coalesce(p_delivery,'A combinar'),'. Localidade: ',coalesce(p_location,'')))
 returning id into v_order_id;
 if p_package_slug is not null then
  insert into public.order_items(order_id,package_id,item_name,bird_type,quantity,unit_price,line_total)
  values(v_order_id,v_package.id,v_package.name,v_package.bird_type,p_quantity,coalesce(v_package.price,0),coalesce(v_package.price,0)*p_quantity/v_package.bird_count);
 end if;
 v_fulfillment_type:=case when coalesce(p_delivery,'') ilike '%levant%' or coalesce(p_delivery,'') ilike '%pickup%' then 'pickup'::public.fulfillment_type else 'delivery'::public.fulfillment_type end;
 insert into public.fulfillments(order_id,type,status,address,contact_phone,notes)
 values(v_order_id,v_fulfillment_type,'pending',nullif(trim(p_location),''),trim(p_phone),nullif(trim(p_delivery),''));
 insert into public.order_events(order_id,status,event_type,message)
 values(v_order_id,'draft','request_created','Pedido iniciado pelo website; aguarda validação comercial.');
 return query select v_order_id,v_reference,'draft'::public.order_status;
end;$function$;
grant execute on function public.create_order_request(text,text,text,text,public.bird_type,integer,text,text) to anon,authenticated;
