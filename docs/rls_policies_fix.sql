-- ============================================================
-- FIX: Políticas RLS faltantes para CRUD completo
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

-- ========================
-- BOOKS: Políticas de escritura para ADMIN
-- ========================

-- Admins pueden insertar libros
CREATE POLICY "Admins can insert books"
ON public.books FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Admins pueden actualizar libros
CREATE POLICY "Admins can update books"
ON public.books FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Admins pueden eliminar libros
CREATE POLICY "Admins can delete books"
ON public.books FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- ========================
-- LOANS: Políticas de escritura
-- ========================

-- Usuarios autenticados pueden crear préstamos (solicitar)
CREATE POLICY "Authenticated users can insert loans"
ON public.loans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins pueden actualizar préstamos (activar, devolver, marcar vencido)
CREATE POLICY "Admins can update loans"
ON public.loans FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Admins pueden ver todos los préstamos (para gestión)
CREATE POLICY "Admins can view all loans"
ON public.loans FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- ========================
-- USERS: Políticas para que admin vea todos los usuarios
-- ========================

-- Admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
