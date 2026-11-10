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

-- Índices para consultas operacionais e prevenção estrutural de operações duplicadas.
create index if not exists inventory_lots_product_idx on public.inventory_lots(product_id);
create index if not exists inventory_lots_package_idx on public.inventory_lots(package_id);
create index if not exists inventory_movements_order_idx on public.inventory_movements(order_id,created_at desc);
create index if not exists inventory_movements_order_item_idx on public.inventory_movements(order_item_id);
create index if not exists inventory_movements_reservation_idx on public.inventory_movements(stock_reservation_id);
create index if not exists inventory_movements_creator_idx on public.inventory_movements(created_by);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists order_items_product_idx on public.order_items(product_id);
create index if not exists order_items_package_idx on public.order_items(package_id);
create index if not exists stock_reservations_order_idx on public.stock_reservations(order_id,status);
create index if not exists stock_reservations_order_item_idx on public.stock_reservations(order_item_id);
create index if not exists stock_reservations_lot_idx on public.stock_reservations(inventory_lot_id);
create index if not exists fulfillments_order_idx on public.fulfillments(order_id);
create unique index if not exists fulfillments_one_active_per_order on public.fulfillments(order_id) where status<>'cancelled';
create index if not exists payments_order_idx on public.payments(order_id);
create index if not exists payments_installment_idx on public.payments(installment_id);
create index if not exists payment_proofs_payment_idx on public.payment_proofs(payment_id);
create index if not exists payment_plans_order_idx on public.payment_plans(order_id);
create index if not exists payment_installments_plan_idx on public.payment_installments(payment_plan_id);
