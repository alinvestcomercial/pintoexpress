-- PintoExpress: acesso interno ao módulo de encomendas
-- Este SQL foi aplicado directamente ao projecto Supabase e guardado aqui
-- como registo de implementação. Antes de usar em novo ambiente, executar
-- através de uma migration Supabase gerada pelo CLI.

create or replace function private.has_staff_role(allowed_roles public.user_role[])
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_profiles s
    where s.id = auth.uid() and s.active = true and s.role = any(allowed_roles)
  );
$$;
revoke all on function private.has_staff_role(public.user_role[]) from public;
grant usage on schema private to authenticated;
grant execute on function private.has_staff_role(public.user_role[]) to authenticated;

create policy "staff can read orders" on public.orders
for select to authenticated
using ((select private.has_staff_role(enum_range(null::public.user_role))));

create policy "staff can read customers" on public.customers
for select to authenticated
using ((select private.has_staff_role(enum_range(null::public.user_role))));

create policy "staff can read order items" on public.order_items
for select to authenticated
using ((select private.has_staff_role(enum_range(null::public.user_role))));

create policy "staff can read payments" on public.payments
for select to authenticated
using ((select private.has_staff_role(enum_range(null::public.user_role))));

create policy "staff can read payment proofs" on public.payment_proofs
for select to authenticated
using ((select private.has_staff_role(enum_range(null::public.user_role))));

create policy "staff can read fulfillments" on public.fulfillments
for select to authenticated
using ((select private.has_staff_role(enum_range(null::public.user_role))));

create policy "staff can read order events" on public.order_events
for select to authenticated
using ((select private.has_staff_role(enum_range(null::public.user_role))));

create policy "staff update orders by role" on public.orders
for update to authenticated
using ((select private.has_staff_role(array['super_admin','admin','manager','sales','support','finance','logistics']::public.user_role[])))
with check ((select private.has_staff_role(array['super_admin','admin','manager','sales','support','finance','logistics']::public.user_role[])));

create policy "staff update payments by role" on public.payments
for update to authenticated
using ((select private.has_staff_role(array['super_admin','admin','manager','finance']::public.user_role[])))
with check ((select private.has_staff_role(array['super_admin','admin','manager','finance']::public.user_role[])));

create policy "staff insert order events" on public.order_events
for insert to authenticated
with check ((select private.has_staff_role(enum_range(null::public.user_role))));

grant update(status,payment_status,updated_at) on public.orders to authenticated;
grant update(status,paid_at,updated_at) on public.payments to authenticated;
grant insert(order_id,status,event_type,message,metadata) on public.order_events to authenticated;

create or replace function public.staff_update_order_status(
  p_order_id uuid, p_status public.order_status, p_message text default null
)
returns jsonb language plpgsql security invoker
set search_path = public, private
as $$
declare v_role public.user_role; v_order public.orders%rowtype;
begin
  select role into v_role from public.staff_profiles where id=auth.uid() and active=true;
  if v_role is null then raise exception 'Acesso interno não autorizado.' using errcode='42501'; end if;
  if v_role in ('super_admin','admin','manager') then null;
  elsif v_role in ('sales','support') then
    if p_status not in ('draft','pending_payment','payment_submitted','confirmed','cancelled') then raise exception 'Este perfil não pode aplicar o estado solicitado.' using errcode='42501'; end if;
  elsif v_role='finance' then
    if p_status not in ('payment_submitted','paid','cancelled') then raise exception 'Este perfil não pode aplicar o estado solicitado.' using errcode='42501'; end if;
  elsif v_role='logistics' then
    if p_status not in ('preparing','ready','out_for_delivery','ready_for_pickup','completed','cancelled') then raise exception 'Este perfil não pode aplicar o estado solicitado.' using errcode='42501'; end if;
  else raise exception 'Este perfil tem acesso apenas de consulta.' using errcode='42501'; end if;
  update public.orders set status=p_status,
    payment_status=case when p_status='paid' then 'verified'::public.payment_status when p_status='payment_submitted' then 'submitted'::public.payment_status else payment_status end,
    updated_at=now()
  where id=p_order_id returning * into v_order;
  if not found then raise exception 'Encomenda não encontrada.' using errcode='P0002'; end if;
  if p_status='paid' then
    update public.payments set status='verified'::public.payment_status,paid_at=coalesce(paid_at,now()),updated_at=now()
    where order_id=p_order_id and status in ('pending','submitted');
  elsif p_status='payment_submitted' then
    update public.payments set status='submitted'::public.payment_status,updated_at=now()
    where order_id=p_order_id and status='pending';
  end if;
  insert into public.order_events(order_id,status,event_type,message,metadata)
  values(v_order.id,p_status,'status_changed',nullif(trim(p_message),''),jsonb_build_object('actor_role',v_role));
  return jsonb_build_object('id',v_order.id,'reference',v_order.reference,'status',v_order.status,'payment_status',v_order.payment_status,'updated_at',v_order.updated_at);
end;
$$;
revoke all on function public.staff_update_order_status(uuid,public.order_status,text) from public,anon;
grant execute on function public.staff_update_order_status(uuid,public.order_status,text) to authenticated;
