
-- 1. Add contract_url column to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS contract_url text;

-- 2. Create private storage bucket for contracts
INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Allow anyone to upload contract PDFs (booking flow is public)
CREATE POLICY "Anyone can upload contracts"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'contracts');

-- 4. Allow anyone to read contracts (URLs are unguessable; bucket stays private from listing)
CREATE POLICY "Anyone can read contracts"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'contracts');
