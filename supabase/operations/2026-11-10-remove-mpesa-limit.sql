-- Remove value-based payment routing and keep customer choice for all order values.
alter table public.business_settings drop column if exists mpesa_limit;