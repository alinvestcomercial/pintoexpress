alter table public.products
  add column if not exists supplier_name text,
  add column if not exists cost_price numeric(12,2),
  add column if not exists reorder_level numeric(12,2) not null default 0,
  add column if not exists image_url text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_cost_price_nonnegative') then
    alter table public.products add constraint products_cost_price_nonnegative check (cost_price is null or cost_price >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_reorder_level_nonnegative') then
    alter table public.products add constraint products_reorder_level_nonnegative check (reorder_level >= 0);
  end if;
end $$;
