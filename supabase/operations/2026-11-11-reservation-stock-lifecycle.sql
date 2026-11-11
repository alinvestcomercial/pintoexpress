-- Connect reservations to stock allocation lifecycle.
-- Applied to project and kept here as the deployable migration record.

create table if not exists public.reservation_stock_allocations (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  inventory_lot_id uuid not null references public.inventory_lots(id),
  quantity numeric not null check (quantity > 0),
  status text not null default 'reserved' check (status in ('reserved','released','consumed')),
  created_by uuid null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservation_stock_allocations_reservation_idx
  on public.reservation_stock_allocations(reservation_id,status);
create index if not exists reservation_stock_allocations_lot_idx
  on public.reservation_stock_allocations(inventory_lot_id,status);

alter table public.reservation_stock_allocations enable row level security;

create or replace function public.staff_transition_reservation(p_reservation_id uuid,p_status text)
returns jsonb language plpgsql set search_path=public,private,pg_temp as $function$
declare
  v_res public.reservations%rowtype;
  v_lot public.inventory_lots%rowtype;
  v_need numeric;
  v_take numeric;
  v_alloc numeric := 0;
  v_staff uuid := auth.uid();
begin
  if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'sales'::user_role,'logistics'::user_role])
    then raise exception 'Sem permissões.' using errcode='42501'; end if;
  if p_status not in ('pending','confirmed','fulfilled','cancelled')
    then raise exception 'Estado inválido.' using errcode='22023'; end if;

  select * into v_res from public.reservations where id=p_reservation_id for update;
  if not found then raise exception 'Reserva não encontrada.' using errcode='P0002'; end if;
  if v_res.status=p_status then return jsonb_build_object('id',v_res.id,'status',v_res.status); end if;

  if not ((v_res.status='pending' and p_status in ('confirmed','cancelled'))
       or (v_res.status='confirmed' and p_status in ('fulfilled','cancelled')))
    then raise exception 'Transição de estado não permitida.' using errcode='22023'; end if;

  if p_status='confirmed' then
    v_need:=v_res.quantity;
    for v_lot in
      select * from public.inventory_lots
      where active=true and available_quantity>0
        and (v_res.product_id is null or product_id=v_res.product_id)
        and (v_res.package_id is null or package_id=v_res.package_id)
        and (availability_date is null or availability_date<=v_res.reserved_for)
      order by availability_date nulls last,created_at,id
      for update
    loop
      exit when v_need<=0;
      v_take:=least(v_need,v_lot.available_quantity);
      update public.inventory_lots
        set available_quantity=available_quantity-v_take,
            reserved_quantity=reserved_quantity+v_take,updated_at=now()
        where id=v_lot.id;
      insert into public.reservation_stock_allocations(reservation_id,inventory_lot_id,quantity,status,created_by)
        values(v_res.id,v_lot.id,v_take,'reserved',v_staff);
      insert into public.inventory_movements(inventory_lot_id,movement_type,quantity,notes,created_by)
        values(v_lot.id,'reservation',v_take,'Reserva '||v_res.reference||' confirmada',v_staff);
      v_need:=v_need-v_take;
      v_alloc:=v_alloc+v_take;
    end loop;
    if v_need>0 then
      raise exception 'Stock insuficiente para confirmar a reserva. Faltam % unidades.',v_need using errcode='23514';
    end if;

  elsif p_status='cancelled' then
    for v_lot in
      select il.* from public.inventory_lots il
      join public.reservation_stock_allocations a on a.inventory_lot_id=il.id
      where a.reservation_id=v_res.id and a.status='reserved'
      for update of il
    loop
      select coalesce(sum(a.quantity),0) into v_take
        from public.reservation_stock_allocations a
        where a.reservation_id=v_res.id and a.inventory_lot_id=v_lot.id and a.status='reserved';
      update public.inventory_lots
        set available_quantity=available_quantity+v_take,
            reserved_quantity=greatest(0,reserved_quantity-v_take),updated_at=now()
        where id=v_lot.id;
      insert into public.inventory_movements(inventory_lot_id,movement_type,quantity,notes,created_by)
        values(v_lot.id,'release',v_take,'Reserva '||v_res.reference||' cancelada',v_staff);
      update public.reservation_stock_allocations
        set status='released',updated_at=now()
        where reservation_id=v_res.id and inventory_lot_id=v_lot.id and status='reserved';
    end loop;

  elsif p_status='fulfilled' then
    for v_lot in
      select il.* from public.inventory_lots il
      join public.reservation_stock_allocations a on a.inventory_lot_id=il.id
      where a.reservation_id=v_res.id and a.status='reserved'
      for update of il
    loop
      select coalesce(sum(a.quantity),0) into v_take
        from public.reservation_stock_allocations a
        where a.reservation_id=v_res.id and a.inventory_lot_id=v_lot.id and a.status='reserved';
      update public.inventory_lots
        set reserved_quantity=greatest(0,reserved_quantity-v_take),updated_at=now()
        where id=v_lot.id;
      insert into public.inventory_movements(inventory_lot_id,movement_type,quantity,notes,created_by)
        values(v_lot.id,'exit',v_take,'Reserva '||v_res.reference||' atendida',v_staff);
      update public.reservation_stock_allocations
        set status='consumed',updated_at=now()
        where reservation_id=v_res.id and inventory_lot_id=v_lot.id and status='reserved';
    end loop;
  end if;

  update public.reservations set status=p_status::reservation_status,updated_at=now() where id=v_res.id;
  return jsonb_build_object('id',v_res.id,'reference',v_res.reference,'status',p_status,'allocated_quantity',v_alloc);
end;
$function$;

grant execute on function public.staff_transition_reservation(uuid,text) to authenticated;
