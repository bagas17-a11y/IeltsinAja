-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create payment_verifications table
CREATE TABLE public.payment_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('pro', 'road_to_8')),
    amount INTEGER NOT NULL,
    receipt_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on payment_verifications
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment verifications
CREATE POLICY "Users can view their own payments"
ON public.payment_verifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own payment verifications
CREATE POLICY "Users can create payments"
ON public.payment_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all payment verifications
CREATE POLICY "Admins can view all payments"
ON public.payment_verifications
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update payment verifications
CREATE POLICY "Admins can update payments"
ON public.payment_verifications
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for payment receipts
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-receipts', 'payment-receipts', false);

-- Storage policies for payment receipts
CREATE POLICY "Users can upload their own receipts"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own receipts"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all receipts"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-receipts' AND public.has_role(auth.uid(), 'admin'));

-- Function to approve payment and update user tier
CREATE OR REPLACE FUNCTION public.approve_payment(payment_id UUID, admin_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_plan_type TEXT;
    v_new_tier subscription_tier;
BEGIN
    -- Get payment details
    SELECT user_id, plan_type INTO v_user_id, v_plan_type
    FROM public.payment_verifications
    WHERE id = payment_id;
    
    -- Determine new tier
    IF v_plan_type = 'pro' THEN
        v_new_tier := 'pro';
    ELSE
        v_new_tier := 'elite';
    END IF;
    
    -- Update payment status
    UPDATE public.payment_verifications
    SET status = 'approved', reviewed_at = now(), reviewed_by = admin_id
    WHERE id = payment_id;
    
    -- Update user's subscription tier
    UPDATE public.profiles
    SET subscription_tier = v_new_tier, updated_at = now()
    WHERE user_id = v_user_id;
END;
$$;