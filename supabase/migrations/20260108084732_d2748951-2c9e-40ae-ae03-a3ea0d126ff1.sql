-- Add subscription_expires_at column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;