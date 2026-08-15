CREATE TABLE public.corporate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  inn text,
  contact_name text NOT NULL,
  phone text NOT NULL,
  email text,
  need_docs boolean NOT NULL DEFAULT false,
  deferred_payment boolean NOT NULL DEFAULT false,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.corporate_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corporate_requests TO authenticated;
GRANT ALL ON public.corporate_requests TO service_role;

ALTER TABLE public.corporate_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a corporate request"
  ON public.corporate_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view corporate requests"
  ON public.corporate_requests FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update corporate requests"
  ON public.corporate_requests FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete corporate requests"
  ON public.corporate_requests FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_corporate_requests_updated_at
  BEFORE UPDATE ON public.corporate_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();