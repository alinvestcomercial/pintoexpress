-- Guardas adicionais: a logística é a única via para preparação, entrega e conclusão.
-- Ajustes e entradas de stock têm sinal explícito no histórico.
create or replace function public.staff_record_stock_movement(p_lot_id uuid,p_movement_type text,p_quantity numeric,p_reason text)
returns jsonb language plpgsql set search_path=public,private,pg_temp as $function$
declare v_lot public.inventory_lots%rowtype;v_record_type text;
begin
 if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role]) then raise exception 'Sem permissões para movimentar stock.' using errcode='42501';end if;
 if p_movement_type not in ('entry','adjustment') or p_quantity=0 or p_quantity is null or nullif(trim(p_reason),'') is null then raise exception 'Tipo, quantidade e motivo são obrigatórios.' using errcode='22023';end if;
 select * into v_lot from public.inventory_lots where id=p_lot_id for update;if not found then raise exception 'Lote não encontrado.';end if;
 if p_movement_type='entry' and p_quantity<0 then raise exception 'Uma entrada deve ter quantidade positiva.';end if;
 if p_movement_type='adjustment' and v_lot.available_quantity+p_quantity<0 then raise exception 'O ajuste não pode deixar o stock disponível negativo.' using errcode='23514';end if;
 v_record_type:=case when p_movement_type='adjustment' and p_quantity<0 then 'adjustment_out' when p_movement_type='adjustment' then 'adjustment_in' else 'entry' end;
 update public.inventory_lots set available_quantity=available_quantity+p_quantity,updated_at=now() where id=p_lot_id returning * into v_lot;
 insert into public.inventory_movements(inventory_lot_id,movement_type,quantity,notes,created_by) values(p_lot_id,v_record_type,abs(p_quantity),left(trim(p_reason),300),auth.uid());
 return jsonb_build_object('lot_id',p_lot_id,'movement_type',v_record_type,'quantity_delta',p_quantity,'available_quantity',v_lot.available_quantity,'reserved_quantity',v_lot.reserved_quantity);
end;$function$;

create or replace function public.staff_update_order_status(p_order_id uuid,p_status public.order_status,p_message text default null)
returns jsonb language plpgsql set search_path=public,private,pg_temp as $function$
declare v_order public.orders%rowtype;v_role public.user_role;v_allowed boolean:=false;v_current text;v_next text;
begin
 if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'sales'::user_role,'support'::user_role,'finance'::user_role]) then raise exception 'Acesso interno não autorizado.' using errcode='42501';end if;
 select role into v_role from public.staff_profiles where id=auth.uid() and active=true;
 select * into v_order from public.orders where id=p_order_id for update;if not found then raise exception 'Encomenda não encontrada.';end if;
 v_current:=v_order.status::text;v_next:=p_status::text;if v_current=v_next then raise exception 'A encomenda já se encontra neste estado.';end if;
 if v_next in ('preparing','ready','out_for_delivery','ready_for_pickup','completed') then raise exception 'Esta etapa deve ser actualizada no módulo Logística.' using errcode='23514';end if;
 if v_role in ('super_admin','admin','manager') then v_allowed:=true;
 elsif v_role='sales' then v_allowed:=(v_next in ('draft','pending_payment','payment_submitted','cancelled') and v_current in ('draft','pending_payment','payment_submitted')) or (v_next='confirmed' and v_current='paid');
 elsif v_role='support' then v_allowed:=v_next in ('draft','pending_payment','payment_submitted','cancelled') and v_current in ('draft','pending_payment','payment_submitted');
 elsif v_role='finance' then v_allowed:=v_next in ('paid','cancelled') and v_current in ('pending_payment','payment_submitted','paid');end if;
 if not v_allowed then raise exception 'Transição não permitida para o seu perfil.' using errcode='42501';end if;
 if not ((v_current='draft' and v_next in ('pending_payment','cancelled')) or (v_current='pending_payment' and v_next in ('payment_submitted','paid','cancelled')) or (v_current='payment_submitted' and v_next in ('paid','pending_payment','cancelled')) or (v_current='paid' and v_next in ('confirmed','cancelled')) or (v_current in ('confirmed','preparing','ready','out_for_delivery','ready_for_pickup') and v_next='cancelled')) then raise exception 'Transição de estado inválida: % → %.',v_current,v_next using errcode='23514';end if;
 if v_next='confirmed' then perform public.staff_reserve_order_stock(p_order_id);
  if not exists(select 1 from public.fulfillments where order_id=p_order_id and status<>'cancelled') then insert into public.fulfillments(order_id,type,status,contact_phone,notes) select v_order.id,case when coalesce(v_order.notes,'') ilike '%levant%' then 'pickup'::public.fulfillment_type else 'delivery'::public.fulfillment_type end,'pending',c.phone,'Criada após confirmação' from public.customers c where c.id=v_order.customer_id;end if;end if;
 if v_next='cancelled' then perform public.staff_release_order_stock(p_order_id,'Encomenda cancelada');end if;
 update public.orders set status=p_status,payment_status=case when v_next='paid' then 'verified'::public.payment_status when v_next='payment_submitted' then 'submitted'::public.payment_status else payment_status end,updated_at=now() where id=p_order_id returning * into v_order;
 if v_next='paid' then update public.payments set status='verified',paid_at=coalesce(paid_at,now()),updated_at=now() where order_id=p_order_id and status in ('pending','submitted');end if;
 insert into public.order_events(order_id,status,event_type,message,metadata) values(p_order_id,p_status,'status_changed',nullif(left(p_message,500),''),jsonb_build_object('actor_role',v_role,'previous_status',v_current));
 return jsonb_build_object('id',v_order.id,'reference',v_order.reference,'status',v_order.status,'payment_status',v_order.payment_status,'updated_at',v_order.updated_at);
end;$function$;

create or replace function public.staff_update_fulfillment(p_fulfillment_id uuid,p_status public.fulfillment_status,p_scheduled_for timestamptz default null,p_notes text default null)
returns jsonb language plpgsql set search_path=public,private,pg_temp as $function$
declare v_f public.fulfillments%rowtype;v_o public.orders%rowtype;v_next public.order_status;v_allowed boolean:=false;v_schedule timestamptz;
begin
 if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role]) then raise exception 'Sem permissões para gerir logística.' using errcode='42501';end if;
 select * into v_f from public.fulfillments where id=p_fulfillment_id for update;if not found then raise exception 'Operação logística não encontrada.';end if;
 select * into v_o from public.orders where id=v_f.order_id for update;if v_f.status=p_status then raise exception 'A operação já se encontra neste estado.';end if;
 v_schedule:=coalesce(p_scheduled_for,v_f.scheduled_for);
 v_allowed:=case when v_f.status='pending' and p_status in ('scheduled','cancelled') then true when v_f.status='scheduled' and p_status in ('ready','cancelled') then true when v_f.status='ready' and p_status='out_for_delivery' and v_f.type='delivery' then true when v_f.status='ready' and p_status='completed' and v_f.type='pickup' then true when v_f.status='out_for_delivery' and p_status in ('completed','cancelled') then true else false end;
 if not v_allowed then raise exception 'Transição logística inválida para o tipo e estado actual.' using errcode='23514';end if;
 if p_status='scheduled' and v_schedule is null then raise exception 'Defina a data e hora antes de agendar.' using errcode='23514';end if;
 if p_status='completed' and v_o.status not in ('ready','out_for_delivery','ready_for_pickup') then raise exception 'A encomenda ainda não está pronta para conclusão.' using errcode='23514';end if;
 if p_status='completed' then perform public.staff_consume_order_stock(v_o.id);elsif p_status='cancelled' then perform public.staff_release_order_stock(v_o.id,'Operação logística cancelada');end if;
 update public.fulfillments set status=p_status,scheduled_for=v_schedule,notes=coalesce(nullif(left(p_notes,500),''),notes),updated_at=now() where id=p_fulfillment_id returning * into v_f;
 v_next:=case when p_status='scheduled' then 'preparing'::order_status when p_status='out_for_delivery' then 'out_for_delivery'::order_status when p_status='ready' and v_f.type='pickup' then 'ready_for_pickup'::order_status when p_status='ready' then 'ready'::order_status when p_status='completed' then 'completed'::order_status when p_status='cancelled' then 'cancelled'::order_status else v_o.status end;
 if v_next<>v_o.status then update public.orders set status=v_next,updated_at=now() where id=v_o.id;end if;
 insert into public.order_events(order_id,status,event_type,message,metadata) values(v_o.id,v_next,'fulfillment_'||p_status::text,coalesce(nullif(left(p_notes,500),''),'Estado logístico actualizado'),jsonb_build_object('fulfillment_id',p_fulfillment_id));
 return jsonb_build_object('fulfillment_id',v_f.id,'status',v_f.status,'order_id',v_o.id,'order_status',v_next);
end;$function$;
grant execute on function public.staff_record_stock_movement(uuid,text,numeric,text) to authenticated;
grant execute on function public.staff_update_order_status(uuid,public.order_status,text) to authenticated;
grant execute on function public.staff_update_fulfillment(uuid,public.fulfillment_status,timestamptz,text) to authenticated;
