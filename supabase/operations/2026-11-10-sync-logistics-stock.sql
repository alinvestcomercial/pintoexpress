-- Integra conclusão logística com consumo/libertação transaccional de stock.
-- A operação permanece protegida por private.has_staff_role nas funções chamadas.
create or replace function public.staff_update_fulfillment(
  p_fulfillment_id uuid,
  p_status public.fulfillment_status,
  p_scheduled_for timestamptz default null,
  p_notes text default null
) returns jsonb
language plpgsql
set search_path = public, private, pg_temp
as $function$
declare
  v_f public.fulfillments;
  v_o public.orders;
  v_next public.order_status;
begin
  if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role]) then
    raise exception 'Sem permissões para gerir logística.' using errcode='42501';
  end if;
  select * into v_f from public.fulfillments where id=p_fulfillment_id for update;
  if not found then raise exception 'Operação logística não encontrada.'; end if;
  select * into v_o from public.orders where id=v_f.order_id for update;
  update public.fulfillments
    set status=p_status,scheduled_for=coalesce(p_scheduled_for,scheduled_for),
        notes=coalesce(nullif(left(p_notes,500),''),notes),updated_at=now()
    where id=p_fulfillment_id returning * into v_f;
  v_next:=case
    when p_status='out_for_delivery' then 'out_for_delivery'::public.order_status
    when p_status='ready' and v_f.type='pickup' then 'ready_for_pickup'::public.order_status
    when p_status='ready' then 'ready'::public.order_status
    when p_status='completed' then 'completed'::public.order_status
    when p_status='cancelled' then 'cancelled'::public.order_status
    else v_o.status end;
  if v_next<>v_o.status then update public.orders set status=v_next,updated_at=now() where id=v_o.id; end if;
  if p_status='completed' then
    perform public.staff_consume_order_stock(v_o.id);
  elsif p_status='cancelled' then
    perform public.staff_release_order_stock(v_o.id,'Operação logística cancelada');
  end if;
  insert into public.order_events(order_id,status,event_type,message,metadata)
  values(v_o.id,v_next,'fulfillment_'||p_status::text,
    coalesce(nullif(left(p_notes,500),''),'Estado logístico actualizado'),
    jsonb_build_object('fulfillment_id',p_fulfillment_id));
  return jsonb_build_object('fulfillment_id',v_f.id,'status',v_f.status,'order_id',v_o.id,'order_status',v_next);
end
$function$;
grant execute on function public.staff_update_fulfillment(uuid,public.fulfillment_status,timestamptz,text) to authenticated;
