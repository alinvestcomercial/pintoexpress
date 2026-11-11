-- Encomendas + Stock + Financeiro: confirmation gate and synchronized lifecycle.
-- Applied to Supabase project eizeqvqgqrwhjbcubeuf.

create or replace function public.staff_update_order_status(
  p_order_id uuid,
  p_status order_status,
  p_message text default null
) returns jsonb
language plpgsql
set search_path=public,private,pg_temp
as $function$
declare v_order public.orders%rowtype; v_role public.user_role; v_allowed boolean:=false; v_current text; v_next text; v_has_finance boolean:=false; v_has_active_plan boolean:=false;
begin
 if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'sales'::user_role,'support'::user_role,'finance'::user_role]) then raise exception 'Acesso interno não autorizado.' using errcode='42501'; end if;
 select role into v_role from public.staff_profiles where id=auth.uid() and active=true;
 select * into v_order from public.orders where id=p_order_id for update;
 if not found then raise exception 'Encomenda não encontrada.'; end if;
 v_current:=v_order.status::text; v_next:=p_status::text;
 if v_current=v_next then raise exception 'A encomenda já se encontra neste estado.'; end if;
 if v_next in ('preparing','ready','out_for_delivery','ready_for_pickup','completed') then raise exception 'Esta etapa deve ser actualizada no módulo Logística.' using errcode='23514'; end if;
 if v_role in ('super_admin','admin','manager') then v_allowed:=true;
 elsif v_role in ('sales','support') then v_allowed:=v_next in ('draft','pending_payment','payment_submitted','cancelled') and v_current in ('draft','pending_payment','payment_submitted');
 elsif v_role='finance' then v_allowed:=v_next in ('paid','cancelled') and v_current in ('pending_payment','payment_submitted','paid'); end if;
 if not v_allowed then raise exception 'Transição não permitida para o seu perfil.' using errcode='42501'; end if;
 if not ((v_current='draft' and v_next in ('pending_payment','cancelled')) or (v_current='pending_payment' and v_next in ('payment_submitted','paid','cancelled')) or (v_current='payment_submitted' and v_next in ('paid','pending_payment','cancelled')) or (v_current='paid' and v_next in ('confirmed','cancelled')) or (v_current in ('confirmed','preparing','ready','out_for_delivery','ready_for_pickup') and v_next='cancelled')) then raise exception 'Transição de estado inválida: % → %.',v_current,v_next using errcode='23514'; end if;
 if v_next='confirmed' then
   select exists(select 1 from public.payments p where p.order_id=p_order_id and p.status='verified') into v_has_finance;
   select exists(select 1 from public.payment_plans pp where pp.order_id=p_order_id and pp.status='active') into v_has_active_plan;
   if not v_has_finance and not v_has_active_plan then raise exception 'A encomenda só pode ser confirmada depois de o pagamento ser validado ou de existir um plano de pagamento activo.' using errcode='23514'; end if;
   perform public.staff_reserve_order_stock(p_order_id);
   if not exists(select 1 from public.fulfillments where order_id=p_order_id and status<>'cancelled') then
     insert into public.fulfillments(order_id,type,status,contact_phone,notes)
     select v_order.id,case when coalesce(v_order.notes,'') ilike '%levant%' then 'pickup'::public.fulfillment_type else 'delivery'::public.fulfillment_type end,'pending',c.phone,'Criada após confirmação' from public.customers c where c.id=v_order.customer_id;
   end if;
 end if;
 if v_next='cancelled' then
   perform public.staff_release_order_stock(p_order_id,'Encomenda cancelada');
   update public.payment_plans set status='cancelled',updated_at=now() where order_id=p_order_id and status='active';
 end if;
 update public.orders set status=p_status,payment_status=case when v_next='paid' then 'verified'::public.payment_status when v_next='payment_submitted' then 'submitted'::public.payment_status else payment_status end,updated_at=now() where id=p_order_id returning * into v_order;
 if v_next='paid' then
   update public.payments set status='verified',paid_at=coalesce(paid_at,now()),updated_at=now() where order_id=p_order_id and status in ('pending','submitted');
   update public.payment_installments pi set paid_amount=x.paid,status=case when x.paid>=pi.amount then 'paid' when x.paid>0 then 'partially_paid' when pi.due_date<current_date then 'overdue' else 'pending' end,updated_at=now()
   from (select pi2.id,coalesce(sum(p.amount) filter(where p.status='verified'),0) paid from public.payment_installments pi2 join public.payment_plans pp on pp.id=pi2.payment_plan_id left join public.payments p on p.installment_id=pi2.id where pp.order_id=p_order_id group by pi2.id) x where pi.id=x.id;
 end if;
 insert into public.order_events(order_id,status,event_type,message,metadata) values(p_order_id,p_status,'status_changed',nullif(left(p_message,500),''),jsonb_build_object('actor_role',v_role,'previous_status',v_current,'stock_reserved',case when v_next='confirmed' then true else false end,'finance_ready',case when v_next='confirmed' then (v_has_finance or v_has_active_plan) else null end));
 return jsonb_build_object('id',v_order.id,'reference',v_order.reference,'status',v_order.status,'payment_status',v_order.payment_status,'updated_at',v_order.updated_at);
end;
$function$;
grant execute on function public.staff_update_order_status(uuid,order_status,text) to authenticated;