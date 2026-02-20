
-- Create users table for simple session-based accounts (no password)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  email TEXT,
  address TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Public read/insert for simple session-based auth (no Supabase Auth)
CREATE POLICY "Anyone can create a user account"
  ON public.users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update users"
  ON public.users FOR UPDATE
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
