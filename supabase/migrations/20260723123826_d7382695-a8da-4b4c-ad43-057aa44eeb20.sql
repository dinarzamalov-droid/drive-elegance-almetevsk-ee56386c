
-- 1. Fix RLS policy always true: remove permissive anon insert on bookings
-- Booking creation goes through the customer-booking edge function (service role).
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;

CREATE POLICY "Service role can insert bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

-- 2. Set immutable search_path on functions that lack it
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;

-- 3. Revoke EXECUTE from anon/authenticated on SECURITY DEFINER functions
-- that must not be callable from the client. Keep has_role callable
-- (used inside RLS policies).
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_admin_role_on_signup() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_wake() TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_admin_role_on_signup() TO service_role;
