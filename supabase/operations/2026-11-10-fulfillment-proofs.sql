-- Comprovativos privados de entrega e levantamento
create table if not exists public.fulfillment_proofs (
 id uuid primary key default gen_random_uuid(),
 fulfillment_id uuid not null references public.fulfillments(id) on delete cascade,
 order_id uuid not null references public.orders(id) on delete cascade,
 bucket_id text not null default 'fulfillment-proofs',
 object_path text not null unique,
 file_name text not null,
 mime_type text not null,
 file_size bigint not null check (file_size > 0),
 uploaded_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);
alter table public.fulfillment_proofs enable row level security;
drop policy if exists "staff read fulfillment proofs" on public.fulfillment_proofs;
create policy "staff read fulfillment proofs" on public.fulfillment_proofs for select to authenticated using ((select private.has_staff_role(enum_range(null::user_role))));
drop policy if exists "logistics staff upload fulfillment proofs" on public.fulfillment_proofs;
create policy "logistics staff upload fulfillment proofs" on public.fulfillment_proofs for insert to authenticated with check ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])));
drop policy if exists "admins delete fulfillment proofs" on public.fulfillment_proofs;
create policy "admins delete fulfillment proofs" on public.fulfillment_proofs for delete to authenticated using ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role])));
grant select,insert,delete on public.fulfillment_proofs to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('fulfillment-proofs','fulfillment-proofs',false,12582912,array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=12582912,allowed_mime_types=array['application/pdf','image/jpeg','image/png','image/webp'];
drop policy if exists "logistics staff upload fulfillment proof objects" on storage.objects;
create policy "logistics staff upload fulfillment proof objects" on storage.objects for insert to authenticated with check (
 bucket_id='fulfillment-proofs' and name ~ '^[0-9a-fA-F-]{36}/'
 and exists (select 1 from public.fulfillments f where f.id::text=(storage.foldername(name))[1]
 and (select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])))
);
drop policy if exists "staff read fulfillment proof objects" on storage.objects;
create policy "staff read fulfillment proof objects" on storage.objects for select to authenticated using (
 bucket_id='fulfillment-proofs' and name ~ '^[0-9a-fA-F-]{36}/'
 and exists (select 1 from public.fulfillments f where f.id::text=(storage.foldername(name))[1]
 and (select private.has_staff_role(enum_range(null::user_role))))
);
