-- RLS necessário às funções operacionais executadas com sessão autenticada.
drop policy if exists "staff insert inventory movements" on public.inventory_movements;
create policy "staff insert inventory movements" on public.inventory_movements for insert to authenticated
with check ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])));
drop policy if exists "staff manage stock reservations" on public.stock_reservations;
create policy "staff manage stock reservations" on public.stock_reservations for all to authenticated
using ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])))
with check ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])));
drop policy if exists "staff create fulfillments" on public.fulfillments;
create policy "staff create fulfillments" on public.fulfillments for insert to authenticated
with check ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])));

-- A reserva/libertação são acções de gestão operacional, não de consulta/vendas.
-- As funções staff_reserve_order_stock e staff_release_order_stock validam estes mesmos perfis.
