-- Entrada de stock atómica: criação do lote + movimento de entrada.
-- A função valida o artigo, as datas, quantidade e permissões, e grava ambos
-- os registos na mesma transacção para não deixar lotes sem saldo auditável.
create or replace function public.staff_create_inventory_lot(
  p_lot_code text,
  p_product_id uuid,
  p_package_id uuid,
  p_arrival_date date,
  p_availability_date date,
  p_quantity numeric,
  p_reason text
)
returns jsonb
language plpgsql
set search_path=public,private,pg_temp
as $function$
declare v_lot public.inventory_lots%rowtype;
begin
  if not private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role]) then
    raise exception 'Sem permissões para criar lotes.' using errcode='42501';
  end if;
  if nullif(trim(p_lot_code),'') is null or length(trim(p_lot_code)) > 80 then
    raise exception 'A referência do lote é obrigatória e deve ter até 80 caracteres.' using errcode='22023';
  end if;
  if (p_product_id is null) = (p_package_id is null) then
    raise exception 'Associe o lote a um produto ou pacote, mas não aos dois.' using errcode='22023';
  end if;
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'A quantidade inicial deve ser superior a zero.' using errcode='22023';
  end if;
  if nullif(trim(p_reason),'') is null then
    raise exception 'Indique a origem ou documento da entrada.' using errcode='22023';
  end if;
  if p_arrival_date is not null and p_availability_date is not null and p_availability_date < p_arrival_date then
    raise exception 'A data de disponibilidade não pode anteceder a chegada.' using errcode='22023';
  end if;
  if p_product_id is not null and not exists(select 1 from public.products where id=p_product_id and active=true) then
    raise exception 'Produto não encontrado ou inactivo.';
  end if;
  if p_package_id is not null and not exists(select 1 from public.packages where id=p_package_id and active=true) then
    raise exception 'Pacote não encontrado ou inactivo.';
  end if;
  insert into public.inventory_lots(lot_code,product_id,package_id,arrival_date,availability_date,available_quantity,reserved_quantity,active)
  values(trim(p_lot_code),p_product_id,p_package_id,p_arrival_date,p_availability_date,p_quantity,0,true)
  returning * into v_lot;
  insert into public.inventory_movements(inventory_lot_id,movement_type,quantity,notes,created_by)
  values(v_lot.id,'entry',p_quantity,left(trim(p_reason),300),auth.uid());
  return jsonb_build_object('id',v_lot.id,'lot_code',v_lot.lot_code,'available_quantity',v_lot.available_quantity,'reserved_quantity',v_lot.reserved_quantity);
end;
$function$;
grant execute on function public.staff_create_inventory_lot(text,uuid,uuid,date,date,numeric,text) to authenticated;
