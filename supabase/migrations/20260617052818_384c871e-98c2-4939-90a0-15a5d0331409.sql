
-- ============ BOOKINGS ============
DROP POLICY IF EXISTS "Clients can view bookings by email and phone" ON public.bookings;
DROP POLICY IF EXISTS "Clients can update their bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;

-- Anon and authenticated can still INSERT (guest booking form), but no SELECT back
CREATE POLICY "Anyone can create a booking"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can read only their own bookings (matched by email)
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR lower(email) = lower((auth.jwt() ->> 'email'))
  );

-- Only admins can update / delete bookings
CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ CLIENTS ============
DROP POLICY IF EXISTS "Admins can view clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can modify clients" ON public.clients;

CREATE POLICY "Admins can view clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can modify clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE: contracts bucket ============
DROP POLICY IF EXISTS "Anyone can read contracts" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload contracts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read contracts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload contracts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update contracts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete contracts" ON storage.objects;

CREATE POLICY "Admins can read contracts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'contracts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload contracts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'contracts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contracts"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'contracts' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'contracts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contracts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'contracts' AND public.has_role(auth.uid(), 'admin'));
