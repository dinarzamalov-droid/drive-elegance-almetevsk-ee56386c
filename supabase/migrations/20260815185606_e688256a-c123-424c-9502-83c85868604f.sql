GRANT SELECT ON public.fleet TO anon, authenticated;
GRANT ALL ON public.fleet TO service_role;
CREATE POLICY "Fleet is publicly viewable" ON public.fleet FOR SELECT USING (true);
CREATE POLICY "Admins manage fleet" ON public.fleet FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));