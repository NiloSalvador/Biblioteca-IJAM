-- SQL Schema for Biblioteca Virtual IJAM

-- 1. Create Data Types
CREATE TYPE user_role AS ENUM ('ADMIN', 'STUDENT');
CREATE TYPE book_type AS ENUM ('PHYSICAL', 'VIRTUAL');
CREATE TYPE loan_status AS ENUM ('RESERVED', 'ACTIVE', 'RETURNED', 'OVERDUE');

-- 2. Create Users Table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'STUDENT',
  institutional_email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Books Table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category TEXT,
  type book_type NOT NULL,
  total_stock INTEGER, -- For virtual: concurrent licenses (NULL for unlimited). For physical: hard copies.
  available_stock INTEGER,
  resource_url TEXT, -- Path to private file in storage (only for Virtual)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Loans Table
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  loan_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ, -- Should be calculated as loan_date + 3 days in app logic or DB triggers
  return_date TIMESTAMPTZ,
  status loan_status DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

-- 6. Add Basic Security Policies (You can restrict these further later)

-- Users can read their own profile, Admins can read all.
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT USING (auth.uid() = id);

-- Public (unauthenticated) and authenticated users can see books.
CREATE POLICY "Anyone can view books" 
ON public.books FOR SELECT USING (true);

-- Only authenticated users can see their own loans.
CREATE POLICY "Users can view their own loans"
ON public.loans FOR SELECT USING (auth.uid() = user_id);

-- 7. Trigger to automatically create a profile in public.users when a new auth.users signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, institutional_email, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Estudiante Nuevo'),
    new.email,
    'STUDENT'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
