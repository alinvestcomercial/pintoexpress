-- Applied to PintoExpress Supabase project on 2026-11-09.
-- Payment review is intentionally SECURITY INVOKER; authorization is checked
-- both here and by the underlying table RLS policies.
create policy "finance staff update payment proofs" on public.payment_proofs
for update to authenticated
using ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'finance'::user_role])))
with check ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'finance'::user_role])));

create policy "logistics staff update fulfillments" on public.fulfillments
for update to authenticated
using ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])))
with check ((select private.has_staff_role(array['super_admin'::user_role,'admin'::user_role,'manager'::user_role,'logistics'::user_role])));

-- Function bodies are deployed in the live database; see Supabase SQL history.
-- public.staff_review_payment(uuid, payment_status, text)
-- public.staff_update_fulfillment(uuid, fulfillment_status, timestamptz, text)
-- Both are SECURITY INVOKER, EXECUTE revoked from PUBLIC/anon and granted
-- only to authenticated. Their bodies validate roles and create order_events.
