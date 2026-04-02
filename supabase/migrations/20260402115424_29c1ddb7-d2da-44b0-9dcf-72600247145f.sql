
-- Fleet table
CREATE TABLE public.fleet (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_value text NOT NULL UNIQUE,
  car_label text NOT NULL,
  status text NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'busy', 'maintenance')),
  mileage integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.fleet ENABLE ROW LEVEL SECURITY;

-- Seed fleet with existing cars
INSERT INTO public.fleet (car_value, car_label) VALUES
  ('bmw-420i', 'BMW 420i'),
  ('porsche-macan', 'Porsche Macan'),
  ('mercedes-glb', 'Mercedes GLB'),
  ('lixiang-l6', 'LiXiang L6');

-- Clients table
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  middle_name text,
  phone text NOT NULL,
  email text NOT NULL,
  loyalty_level text NOT NULL DEFAULT 'СВОБОДА' CHECK (loyalty_level IN ('СВОБОДА', 'ПРЕМИУМ', 'VIP')),
  bonus_balance integer NOT NULL DEFAULT 0,
  total_spent integer NOT NULL DEFAULT 0,
  total_rentals integer NOT NULL DEFAULT 0,
  list_status text NOT NULL DEFAULT 'normal' CHECK (list_status IN ('normal', 'white', 'black')),
  notes text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX idx_clients_phone ON public.clients (phone);

-- Triggers for updated_at
CREATE TRIGGER update_fleet_updated_at
  BEFORE UPDATE ON public.fleet
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
