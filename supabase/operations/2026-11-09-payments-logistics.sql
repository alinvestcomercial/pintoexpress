-- PintoExpress: role-secured payment review and fulfillment operations.
create policy "finance staff update payment proofs" on public.payment_proofs
for update to authenticated
using ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'finance'::user_role])))
with check ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'finance'::user_role])));

create policy "logistics staff update fulfillments" on public.fulfillments
for update to authenticated
using ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])))
with check ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])));

create or replace function public.staff_review_payment(p_payment_id uuid,p_status public.payment_status,p_note text default null)
returns jsonb language plpgsql security invoker set search_path=public,private,pg_temp as $$
declare v_payment public.payments; v_order public.orders;
begin
 if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'finance'::user_role]) then raise exception 'Sem permissões para validar pagamentos.' using errcode='42501'; end if;
 if p_status not in ('verified'::payment_status,'rejected'::payment_status) then raise exception 'Estado de validação inválido.'; end if;
 update public.payments set status=p_status,updated_at=now(),paid_at=case when p_status='verified' then coalesce(paid_at,now()) else null end where id=p_payment_id returning * into v_payment;
 if not found then raise exception 'Pagamento não encontrado.'; end if;
 update public.payment_proofs set status=p_status,verified_at=case when p_status='verified' then now() else null end,notes=coalesce(nullif(left(p_note,500),''),notes) where payment_id=p_payment_id;
 update public.orders set payment_status=p_status,status=case when p_status='verified' then 'paid'::order_status when status='paid' then 'pending_payment'::order_status else status end,updated_at=now() where id=v_payment.order_id returning * into v_order;
 insert into public.order_events(order_id,status,event_type,message,metadata) values(v_payment.order_id,v_order.status,'payment_'||p_status::text,coalesce(nullif(left(p_note,500),''),'Pagamento '||p_status::text),jsonb_build_object('payment_id',p_payment_id));
 return jsonb_build_object('payment_id',v_payment.id,'payment_status',v_payment.status,'order_id',v_order.id,'order_status',v_order.status);
end $$;
revoke all on function public.staff_review_payment(uuid,public.payment_status,text) from public,anon;
grant execute on function public.staff_review_payment(uuid,public.payment_status,text) to authenticated;

create or replace function public.staff_update_fulfillment(p_fulfillment_id uuid,p_status public.fulfillment_status,p_scheduled_for timestamptz default null,p_notes text default null)
returns jsonb language plpgsql security invoker set search_path=public,private,pg_temp as $$
declare v_f public.fulfillments; v_o public.orders; v_next public.order_status;
begin
 if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role]) then raise exception 'Sem permissões para gerir logística.' using errcode='42501'; end if;
 update public.fulfillments set status=p_status,scheduled_for=coalesce(p_scheduled_for,scheduled_for),notes=coalesce(nullif(left(p_notes,500),''),notes),updated_at=now() where id=p_fulfillment_id returning * into v_f;
 if not found then raise exception 'Operação logística não encontrada.'; end if;
 select * into v_o from public.orders where id=v_f.order_id;
 v_next:=case when p_status='out_for_delivery' then 'out_for_delivery'::order_status when p_status='ready' and v_f.type='pickup' then 'ready_for_pickup'::order_status when p_status='ready' then 'ready'::order_status when p_status='completed' then 'completed'::order_status when p_status='cancelled' then 'cancelled'::order_status else v_o.status end;
 if v_next<>v_o.status then update public.orders set status=v_next,updated_at=now() where id=v_o.id; end if;
 insert into public.order_events(order_id,status,event_type,message,metadata) values(v_o.id,v_next,'fulfillment_'||p_status::text,coalesce(nullif(left(p_notes,500),''),'Estado logístico actualizado'),jsonb_build_object('fulfillment_id',p_fulfillment_id));
 return jsonb_build_object('fulfillment_id',v_f.id,'status',v_f.status,'order_id',v_o.id,'order_status',v_next);
end $$;
revoke all on function public.staff_update_fulfillment(uuid,public.fulfillment_status,timestamptz,text) from public,anon;
grant execute on function public.staff_update_fulfillment(uuid,public.fulfillment_status,timestamptz,text) to authenticated;
