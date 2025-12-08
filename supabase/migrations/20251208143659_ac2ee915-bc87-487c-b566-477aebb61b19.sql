-- Create vehicle type enum
CREATE TYPE public.vehicle_type AS ENUM ('car', 'bike');

-- Create fuel type enum
CREATE TYPE public.fuel_type AS ENUM ('gasoline', 'diesel', 'hybrid', 'electric');

-- Create transmission type enum
CREATE TYPE public.transmission_type AS ENUM ('mt', 'at', 'cvt');

-- Create handle type enum
CREATE TYPE public.handle_type AS ENUM ('right', 'left');

-- Create engine status enum
CREATE TYPE public.engine_status AS ENUM ('running', 'not_running');

-- Create assessment status enum
CREATE TYPE public.assessment_status AS ENUM ('pending', 'reviewing', 'quoted', 'completed', 'cancelled');

-- Price master table for simulator
CREATE TABLE public.price_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type vehicle_type NOT NULL,
  model_name TEXT NOT NULL,
  min_price INTEGER NOT NULL DEFAULT 0,
  max_price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assessment requests table
CREATE TABLE public.assessment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type vehicle_type NOT NULL,
  
  -- Common fields
  manufacturer TEXT NOT NULL,
  model_name TEXT NOT NULL,
  year INTEGER,
  
  -- Car specific fields
  displacement INTEGER,
  fuel_type fuel_type,
  transmission transmission_type,
  handle_position handle_type,
  mileage INTEGER,
  
  -- Bike specific fields
  has_custom BOOLEAN DEFAULT false,
  engine_status engine_status,
  inspection_remaining TEXT,
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  
  -- Status and admin
  status assessment_status DEFAULT 'pending',
  admin_notes TEXT,
  estimated_price_min INTEGER,
  estimated_price_max INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assessment photos table
CREATE TABLE public.assessment_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessment_requests(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_photos ENABLE ROW LEVEL SECURITY;

-- Public read access for price_master (needed for simulator)
CREATE POLICY "Anyone can read price master"
ON public.price_master
FOR SELECT
USING (true);

-- Public insert for assessment requests (no auth required for submissions)
CREATE POLICY "Anyone can submit assessment"
ON public.assessment_requests
FOR INSERT
WITH CHECK (true);

-- Public insert for assessment photos
CREATE POLICY "Anyone can upload assessment photos"
ON public.assessment_photos
FOR INSERT
WITH CHECK (true);

-- Insert sample data for price simulator
INSERT INTO public.price_master (vehicle_type, model_name, min_price, max_price) VALUES
('car', 'Toyota Hiace', 500000, 1500000),
('car', 'Toyota Land Cruiser', 800000, 3000000),
('car', 'Toyota Hilux', 600000, 2000000),
('car', 'Nissan Safari', 400000, 1500000),
('car', 'Mitsubishi Pajero', 300000, 1200000),
('car', 'Suzuki Jimny', 400000, 1000000),
('car', 'Honda CR-V', 200000, 800000),
('car', 'Subaru Forester', 150000, 600000),
('bike', 'Honda CB400', 200000, 600000),
('bike', 'Kawasaki Ninja', 300000, 900000),
('bike', 'Yamaha SR400', 250000, 700000),
('bike', 'Suzuki GSX-R', 350000, 1000000),
('bike', 'Harley Davidson Sportster', 500000, 1500000),
('bike', 'Honda Africa Twin', 400000, 1200000);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_price_master_updated_at
BEFORE UPDATE ON public.price_master
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_requests_updated_at
BEFORE UPDATE ON public.assessment_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();