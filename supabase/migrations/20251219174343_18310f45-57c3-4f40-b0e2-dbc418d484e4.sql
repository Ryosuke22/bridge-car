-- Add custom_details column for free text input about custom modifications
ALTER TABLE public.assessment_requests 
ADD COLUMN custom_details text;