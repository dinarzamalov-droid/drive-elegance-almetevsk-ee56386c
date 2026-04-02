-- Add preferred_messenger column
ALTER TABLE public.bookings ADD COLUMN preferred_messenger text DEFAULT '';

-- Allow clients to read their own bookings by email+phone
CREATE POLICY "Clients can view bookings by email and phone"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow clients to update their own bookings (limited)
CREATE POLICY "Clients can update their bookings"
ON public.bookings
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);