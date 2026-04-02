
-- Create bookings table for storing rental bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_value TEXT NOT NULL,
  car_label TEXT NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  days INTEGER NOT NULL,
  city TEXT NOT NULL DEFAULT 'Альметьевск',
  delivery_time TEXT,
  age_category TEXT NOT NULL,
  experience_category TEXT NOT NULL,
  selected_extras TEXT[] DEFAULT '{}',
  daily_rate INTEGER NOT NULL,
  extras_cost INTEGER NOT NULL DEFAULT 0,
  total_cost INTEGER NOT NULL,
  prepay INTEGER NOT NULL,
  remaining INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  promo_code TEXT,
  -- Client data
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  passport_series TEXT,
  passport_number TEXT,
  passport_date TEXT,
  passport_code TEXT,
  license_number TEXT,
  license_date TEXT,
  -- Payment
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  -- Meta
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a booking (public form, no auth required)
CREATE POLICY "Anyone can create a booking"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read/update/delete (admin via dashboard)
-- No SELECT policy for anon means they cannot read other bookings

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
