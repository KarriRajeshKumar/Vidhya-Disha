-- Add education_level column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS education_level text DEFAULT 'inter_to_degree';

-- Update existing profiles to have the default value
UPDATE public.profiles
SET education_level = 'inter_to_degree'
WHERE education_level IS NULL;