ALTER TABLE public.profiles
ADD COLUMN passport_issued_by text DEFAULT '' ,
ADD COLUMN registration_address text DEFAULT '';